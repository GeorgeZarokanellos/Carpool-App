import express  from "express";
import { returnAvailableStops } from "../controller/stop_controller";

const router = express.Router();

router.get('/:side', returnAvailableStops);

export default router;