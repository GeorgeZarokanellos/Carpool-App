import express, { type Router } from "express";
import { retrieveProfileInfo } from "../controller/profile_controller";
// import router from "./registration_router";
const router: Router = express.Router();

router.get('/:id', retrieveProfileInfo);

export default router;
