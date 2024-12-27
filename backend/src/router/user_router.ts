import express, { type Router } from "express";
import { retrieveUserTrips, retrieveUserInfo, retrieveVehicleImages, updateUser, deleteUserNotifications, getUserRequestNotification, retrieveCoupons, addPurchasedCoupon, removePurchasedCoupon } from "../controller/user_controller";

const router: Router = express.Router();

router.patch('/:userId', updateUser);
//User Information
router.get('/trips/:userId', retrieveUserTrips);
router.get('/:userId', retrieveUserInfo);
router.get('/vehicle/:userId', retrieveVehicleImages);
//User Notifications
router.get('/notification/:userId', getUserRequestNotification);
router.delete('/:userId', deleteUserNotifications);
//User Coupons
router.get('/coupons/available', retrieveCoupons);
router.post('/coupons/purchase/:couponId', addPurchasedCoupon);
router.delete('/coupons/remove/:couponId', removePurchasedCoupon);

export default router;