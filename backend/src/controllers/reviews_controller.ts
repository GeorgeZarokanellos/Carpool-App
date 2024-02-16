import type { Request, Response } from "express";
import { retrieveUserReviews } from "../utils/common_functions"; 
import { Review } from "../models/associations";
import { reviewRequestBodyInterface } from "../interfaces/trip_interfaces";

export const getReviews =  (req: Request, res: Response): void => {
    const userId: string = req.params.id;
    retrieveUserReviews(userId)
        .then((userReviews) => {
            res.status(200).json(userReviews);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('There was an error retrieving the user reviews');
        });
}

export const createReview = (req: Request, res: Response): void => {
    const { reviewRating, reviewDateTime}: reviewRequestBodyInterface = req.body;
    const reviewedUserId = req.params.reviewedPersonId;
    // const reviewerId  = req.session.id;
    const reviewerId = 1; // TODO: change this to the logged in user's id
    Review.create({
        reviewRating,
        reviewDateTime,
        reviewedUserId,
        reviewerId
    })
    .then(() => {
        res.status(201).send('Review created');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('There was an error creating the review');
    });
    
}

export default {
    getReviews
}