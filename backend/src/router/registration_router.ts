import express from 'express';
import { findUsernameAndInitializeUpload, addDriverAndVehicle } from '../controller/driver_vehicle_registration_controller';
import { addUser, uploadProfilePicture } from '../controller/user_registration_controller';
import {newUserValidationRules, newDriverAndVehicleValidationRules} from '../util/validator/registration_validator';
import {validate} from '../util/common_functions';
import { Request, Response, NextFunction } from 'express-serve-static-core';

//TODO: add validation for driver-vehicle post request  

const router = express.Router();

router.post('/user', 
            // newUserValidationRules(), 
            // validate, 
            async (req: Request, res: Response, next: NextFunction)  => {
                try {
                    await uploadProfilePicture(req, res, next);
                } catch(error) {
                    console.warn("Error in upload profile picture", error);
                }
            },
            addUser
        );

router.post('/driver/:id', 
    async (req,res, next) => {
        try {
            await findUsernameAndInitializeUpload(req, res, next, Number(req.params.id))
            console.log("find username success");
        } catch (error) {
            console.log("find username failed"); 
        }
    },
    addDriverAndVehicle
);

export default router;