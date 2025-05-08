import express from 'express';
import { getDiscountUsage, getPromotionPerformance, getUserActivity } from '../controllers/reportController.js';

const router = express.Router();

// Report routes
router.get('/discounts', getDiscountUsage);
router.get('/promotions', getPromotionPerformance);
router.get('/users', getUserActivity);

export default router;
