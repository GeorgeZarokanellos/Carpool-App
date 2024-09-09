import express  from "express";
import { returnAvailableStops } from "../controller/stop_controller";

const router = express.Router();

router.get('/', returnAvailableStops);

export default router;