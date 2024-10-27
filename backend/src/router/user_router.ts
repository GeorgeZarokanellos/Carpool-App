import express, { type Router } from "express";
import { retrieveUserTrips, retrieveUserInfo, retrieveVehicleImages, updateUser } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveUserTrips);
router.get('/:userId', retrieveUserInfo);
router.get('/vehicle/:userId', retrieveVehicleImages);
router.patch('/:userId', updateUser);
export default router;