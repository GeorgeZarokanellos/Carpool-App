import {type ValidationChain, check} from 'express-validator';

export const newUserValidationRules = (): ValidationChain[] => {
    return [
        check('universityId')
            .isNumeric()
            .withMessage('University ID must be a number')
            .isLength({min: 12, max: 12})
            .withMessage('Unisersity ID must be 12 characters long'),


        check('firstName')
            .isString()
            .withMessage('First name must be a string')
            .isLength({min: 2, max: 10})
            .withMessage('First name must be between 2 and 10 characters long'),
        
        check('lastName')
            .isString()
            .withMessage('Last name must be a string')
            .isLength({min: 2, max: 15})
            .withMessage('Last name must be between 2 and 15 characters long'),
        
        check('username')
            .isString()
            .withMessage('Username must be a string')
            .isLength({min: 4, max: 10})
            .withMessage('Username must be between 4 and 10 characters long'),
        
        check('password')
            .isString()
            .withMessage('Password must be a string')
            .isLength({min: 8, max: 15})
            .withMessage('Password must be between 8 and 15 characters long'),
        
        check('email')
            .isEmail()
            .withMessage('Invalid email'),
        
        check('role')
            .isIn(['driver', 'passenger'])
            .withMessage('Invalid role'),
        
        check('phone')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
    ]
}

export const newDriverAndVehicleValidationRules = (): ValidationChain[] => {
    return [
        check('vehicleId')
            .isString()
            .withMessage('Vehicle ID must be a string'),

        check('carMaker')
            .isString()
            .withMessage('Car maker must be a string')
            .isLength({min: 2, max: 15})
            .withMessage('Car maker must be between 2 and 15 characters long'),
        
        check('carModel')
            .isString()
            .withMessage('Car model must be a string')
            .isLength({min: 2, max: 15})
            .withMessage('Car model must be between 2 and 15 characters long'),
        
        check('carCapacity')
            .isInt({min: 2, max: 4})
            .withMessage('Car capacity must be a number between 2 and 4')
    ]
}


export default {
        newUserValidationRules,
        newDriverAndVehicleValidationRules
}