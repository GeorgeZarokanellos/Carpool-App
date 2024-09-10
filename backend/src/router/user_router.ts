import express, { type Router } from "express";
import { retrieveCurrentTrips, retrieveUserNameAndRating, retrieveVehicleImages, updateUser } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveCurrentTrips);
router.get('/:userId', retrieveUserNameAndRating);
router.get('/vehicle/:userId', retrieveVehicleImages);
router.put('/:userId', updateUser);
export default router;