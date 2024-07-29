import express, { type Router } from "express";
import { retrieveCurrentTrips } from "../controller/user_controller";

const router: Router = express.Router();
router.get('/trips/:userId', retrieveCurrentTrips);

export default router;