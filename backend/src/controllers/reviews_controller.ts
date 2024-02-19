import type { Request, Response } from "express";
import { retrieveUserReviews } from "../utils/common_functions"; 
import { Review } from "../models/associations";
import type { reviewRequestBodyInterface } from "../interfaces/trip_interfaces";

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

export const updateReview = (req: Request, res: Response): void => {
    const reviewId = req.params.id;
    const { reviewRating, reviewDateTime}: reviewRequestBodyInterface = req.body;
    Review.update({
        reviewRating,
        reviewDateTime
    }, {
        where: {
            reviewId
        }
    })
    .then(() => {
        res.status(200).send('Review updated');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('There was an error updating the review');
    })
}

export const deleteReview = (req: Request, res: Response): void => {
    const reviewId = req.params.id;
    Review.destroy({
        where: {
            reviewId
        }
    })
    .then(() => {
        res.status(200).send('Review deleted');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('There was an error deleting the review');
    })
}

export default {
    getReviews,
    createReview,
    updateReview,
    deleteReview
}