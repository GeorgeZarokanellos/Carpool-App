import express from 'express';
import { addUser, findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controllers/registration_controller';
const router = express.Router();


router.post('/user', addUser);
router.post('/driver/:id', findUsernameAndInitializeUpload ,addDriverAndVehicle);

export default router;