import { Router } from "express";
import { updateDriver } from "../controller/driver_controller";

const router = Router();

router.patch('/:driverId', updateDriver);

export default router;