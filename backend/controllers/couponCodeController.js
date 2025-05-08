import CouponCode from '../models/CouponCode.js';
import User from '../models/User.js';

// Create a new coupon code
export async function createCouponCode(req, res) {
  try {
    const { code, percentage, validUntil, assignedTo, promotion } = req.body;
    // If promotion is provided, fetch its details and use them for coupon creation
    let promo = null;
    let codeToUse = code;
    let percentageToUse = percentage;
    if (promotion) {
      const Promotion = (await import('../models/Promotion.js')).default;
      promo = await Promotion.findById(promotion);
      if (promo) {
        if (typeof promo.percentage !== 'number') {
          console.error('Promotion found but missing percentage:', promo);
          return res.status(400).json({ message: 'Promotion does not have a valid percentage.' });
        }
        codeToUse = promo.title;
        percentageToUse = promo.percentage;
      }
    }
    const coupon = new CouponCode({
      code: codeToUse,
      percentage: percentageToUse,
      validUntil,
      assignedTo,
      promotion,
      createdBy: req.user?._id,
    });
    await coupon.save();
    console.log("Coupon saved:", coupon);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get all coupon codes (admin only)
export async function getAllCouponCodes(req, res) {
  try {
    const coupons = await CouponCode.find().populate('assignedTo', 'name email').populate('promotion');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get coupon codes assigned to a user
export async function getCouponCodesForUser(req, res) {
  try {
    const userId = req.params.userId;
    const user = req.user;
    
    // Only allow user to view their own coupons
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view these coupons' });
    }

    // Find coupon codes assigned to this user
    const coupons = await CouponCode.find({
      assignedTo: userId,
      validUntil: { $gt: new Date() } // Only show valid coupons
    })
    .populate('assignedTo', 'name email')
    .populate('promotion');

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Assign users to a coupon code
export async function assignUsersToCoupon(req, res) {
  try {
    const { couponId, userIds } = req.body;
    const coupon = await CouponCode.findByIdAndUpdate(
      couponId,
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true }
    ).populate('assignedTo', 'name email');
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get all users (for admin UI)
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Validate a coupon code for a user
export async function validateCouponCode(req, res) {
  try {
    const { code } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;
    // Find coupon and populate promotion
    const coupon = await CouponCode.findOne({ code: code.trim() }).populate('promotion');
    if (!coupon) return res.status(404).json({ valid: false, message: 'Coupon not found' });
    if (new Date(coupon.validUntil) <= new Date()) {
      return res.status(400).json({ valid: false, message: 'Coupon expired' });
    }
    // If the coupon has a promotion, check if user is assigned to the promotion
    if (coupon.promotion && coupon.promotion.assignedTo && coupon.promotion.assignedTo.length > 0) {
      // assignedTo is array of ObjectIds, so convert to string for comparison
      const assigned = coupon.promotion.assignedTo.map(id => String(id));
      if (
        userRole === 'admin' ||
        (userId && assigned.includes(String(userId)))
      ) {
        return res.json({ valid: true, percentage: coupon.promotion.percentage, coupon });
      } else {
        return res.status(403).json({ valid: false, message: 'Not authorized for this promotion' });
      }
    }
    // If no promotion or no assignedTo, allow if public or admin
    if (
      !coupon.assignedTo ||
      coupon.assignedTo.length === 0 ||
      userRole === 'admin' ||
      (userId && coupon.assignedTo.map(id => String(id)).includes(String(userId)))
    ) {
      return res.json({ valid: true, percentage: coupon.percentage, coupon });
    }
    return res.status(403).json({ valid: false, message: 'Not authorized for this coupon' });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
}

// Assign users to a discount by creating a coupon for each user
export async function assignUsersToDiscountCoupons(req, res) {
  try {
    const { discountId, userIds } = req.body;
    if (!discountId || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'discountId and userIds[] are required.' });
    }
    const Discount = (await import('../models/Discount.js')).default;
    const discount = await Discount.findById(discountId);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    if (typeof discount.percentage !== 'number') {
      console.error('Discount found but missing percentage:', discount);
      return res.status(400).json({ message: 'Discount does not have a valid percentage.' });
    }
    const CouponCode = (await import('../models/CouponCode.js')).default;
    const createdCoupons = [];
    for (const userId of userIds) {
      // Check if a coupon for this user and discount already exists
      let coupon = await CouponCode.findOne({ promotion: discountId, assignedTo: userId });
      if (!coupon) {
        coupon = new CouponCode({
          code: discount.code + '-' + userId.slice(-4) + '-' + Math.floor(Math.random()*10000),
          percentage: discount.percentage,
          validUntil: discount.validUntil || new Date(Date.now() + 7*24*60*60*1000), // fallback: 1 week validity
          assignedTo: [userId],
          promotion: discountId,
        });
        await coupon.save();
      }
      createdCoupons.push(coupon);
    }
    res.status(201).json({ message: 'Coupons assigned to users for discount.', coupons: createdCoupons });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
