import express from 'express';
import { addUser, findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controllers/registration_controller';
const router = express.Router();


router.post('/registration/user', addUser);
router.post('/registration/driver/:id', findUsernameAndInitializeUpload ,addDriverAndVehicle);

export default router;