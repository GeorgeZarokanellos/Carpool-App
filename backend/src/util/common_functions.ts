import {Review, User} from '../model/association';
import {validationResult} from 'express-validator';
import type {NextFunction, Request, Response} from 'express';

export const retrieveUserReviews = async (userId: string) : Promise<Review[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
        return await Review.findAll({
                where: {
                    reviewedUserId: Number(userId)
                },
                attributes: ['reviewId', 'reviewerId', 'reviewRating', 'reviewDateTime'],
                include: [
                    {
                        model: User,
                        as: 'reviewer',
                        attributes: ['firstName', 'lastName']
                    }
                ]
            });
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the reviews: " + error);
        } else if (error instanceof Error){
            console.log("There was an error retrieving the reviews" + error.message); 
        }
        return await Promise.resolve([]);
    }
};

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
          res.status(400).json({errors: errors.array()});
    } else
        next();
 
};

export default {
    retrieveUserReviews,
    validate
}