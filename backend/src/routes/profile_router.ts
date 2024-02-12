import express, { type Router } from "express";
import { displayProfile } from "../controllers/profile_controller";
// import router from "./registration_router";
const router: Router = express.Router();

router.get('/:id', displayProfile);

export default router;
