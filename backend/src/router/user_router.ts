import express, { type Router } from "express";
import { retrieveCurrentTrips, retrieveUserInfo, retrieveVehicleImages, updateUser } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveCurrentTrips);
router.get('/:userId', retrieveUserInfo);
router.get('/vehicle/:userId', retrieveVehicleImages);
router.put('/:userId', updateUser);
export default router;