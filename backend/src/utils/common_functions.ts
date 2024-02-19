import { User, Review } from '../models/associations';
import {validationResult} from 'express-validator';
import type {Request, Response, NextFunction} from 'express';

export const retrieveUserReviews = async (userId: string) : Promise<Review[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
            const userReviews: Review[] = await Review.findAll({
                where: {
                    reviewedUserId: userId
                },
                attributes: ['reviewerId', 'reviewRating', 'reviewDateTime'],
                include : [
                    {
                        model: User,
                        as : 'reviewer',
                        attributes: ['firstName', 'lastName']  
                    }
                ]
            });
            return userReviews;
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the reviews: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
        return await Promise.resolve([]);
    }
};

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
          res.status(400).json({errors: errors.array()});
    }
    next();
 
};

export default {
    retrieveUserReviews,
    validate
}