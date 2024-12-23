import { Router } from "express";
import { createCoupon, deleteCoupon, deleteUser, retrieveAllCoupons, retrieveAllTrips, retrieveAllUsers, updateCoupon } from "../controller/admin_controller";

const router = Router();
//users routes
router.get('/users', retrieveAllUsers);
router.delete('/user/:userId', deleteUser);
//trips routes
router.get('/trips', retrieveAllTrips);
//coupons routes
router.get('/coupons', retrieveAllCoupons);
router.post('/coupon', createCoupon);
router.patch('/coupon/:couponId', updateCoupon);
router.delete('/coupon/:couponId', deleteCoupon);

export default router;