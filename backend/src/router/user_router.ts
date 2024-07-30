import express, { type Router } from "express";
import { retrieveCurrentTrips, retrieveUserNameAndRating } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveCurrentTrips);
router.get('/:userId', retrieveUserNameAndRating);
export default router;