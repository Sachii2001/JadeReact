import express from 'express';
import { createCouponCode, getAllCouponCodes, assignUsersToCoupon, getAllUsers, validateCouponCode, assignUsersToDiscountCoupons, getCouponCodesForUser } from '../controllers/couponCodeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


// Admin only routes (add admin check in production)
router.post('/', requireAuth, createCouponCode);
router.get('/', requireAuth, getAllCouponCodes);
router.get('/user/:userId', requireAuth, getCouponCodesForUser); // No auth required for users to view their own coupons
router.put('/assign', requireAuth, assignUsersToCoupon);
router.get('/users', requireAuth, getAllUsers);
router.post('/assign-users-to-discount', requireAuth, assignUsersToDiscountCoupons);

// Validate coupon code (POST)
router.post('/validate', requireAuth, validateCouponCode);

export default router;
