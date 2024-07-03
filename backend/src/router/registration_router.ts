import express from 'express';
import { addUser, findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controller/registration_controller';
import {newUserValidationRules, newDriverAndVehicleValidationRules} from '../util/validator/registration_validator';
import {validate} from '../util/common_functions';

//TODO: add validation for driver-vehicle post request  

const router = express.Router();

router.post('/user', 
            newUserValidationRules(), 
            validate, 
            addUser
        );

router.post('/driver/:id', 
    async (req,res, next) => {
        try {
            findUsernameAndInitializeUpload(req, res, next,Number(req.params.id))
            console.log("find username success");
        } catch (error) {
            console.log("find username failed"); 
        }
    },
    addDriverAndVehicle
);

export default router;