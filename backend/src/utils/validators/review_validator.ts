import {type ValidationChain, check} from 'express-validator';

export const reviewValidationRules = (): ValidationChain[] => {
    return [
        check('reviewRating')
            .isFloat({min: 0, max: 5})
            .withMessage('Review rating must be a number between 0 and 5')
            .bail()
            .custom((value) => {
                if(Math.floor(value * 10) !== value * 10) {
                    throw new Error('Review rating must have at most one decimal place');
                }
            }),
        check('reviewDateTime').isISO8601()
    ];

}

export default {
    reviewValidationRules
}