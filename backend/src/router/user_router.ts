import express, { type Router } from "express";
import { retrieveUserTrips, retrieveUserInfo, retrieveVehicleImages, updateUser, deleteUserNotifications, getUserRequestNotification } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveUserTrips);
router.get('/:userId', retrieveUserInfo);
router.get('/vehicle/:userId', retrieveVehicleImages);
router.get('/notification/:userId', getUserRequestNotification);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUserNotifications);
export default router;