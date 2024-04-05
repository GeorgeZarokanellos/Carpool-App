import express from 'express';
import { addUser, findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controller/registration_controller';
import {newUserValidationRules, newDriverAndVehicleValidationRules} from '../util/validator/registration_validator';
import {validate} from '../util/common_functions';
const router = express.Router();


router.post('/user', newUserValidationRules(), validate, addUser);
router.post('/driver/:id', newDriverAndVehicleValidationRules(), validate, findUsernameAndInitializeUpload ,addDriverAndVehicle);

export default router;