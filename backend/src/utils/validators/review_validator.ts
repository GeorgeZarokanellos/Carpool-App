import {type ValidationChain, body} from 'express-validator';

export const reviewValidationRules = (): ValidationChain[] => {
    return [
        body('reviewRating')
            .isFloat()
            .withMessage('Review rating must be a number between 0 and 5')
            .custom((value, {req}) => {
                const reviewRating = req.body.reviewRating;
                if(!Number.isInteger(reviewRating*10)) {
                    throw new Error('Review rating must have at most one decimal place');
                }
                return value;
            })
    ];

}

export default {
}
reviewValidationRules