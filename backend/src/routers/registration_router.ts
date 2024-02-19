import express from 'express';
import { addUser, findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controllers/registration_controller';
import {newUserValidationRules, newDriverAndVehicleValidationRules} from '../utils/validators/registration_validator';
import {validate} from '../utils/common_functions';
const router = express.Router();


router.post('/user', newUserValidationRules(), validate, addUser);
router.post('/driver/:id', newDriverAndVehicleValidationRules(), validate, findUsernameAndInitializeUpload ,addDriverAndVehicle);

export default router;