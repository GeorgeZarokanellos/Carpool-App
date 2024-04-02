import type { NextFunction, Request, Response } from "express";
import { retrieveUserReviews } from "../utils/common_functions"; 
import { Review } from "../models/associations";
import type { reviewRequestBodyInterface } from "../interfaces/trip_interfaces";
import sequelize from '../database/connect_to_db';
import { type Transaction } from 'sequelize';


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

//TODO logic to update the average rating of the user being reviewed
export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await sequelize.transaction(async (transaction: Transaction) => {
            const { reviewRating }: reviewRequestBodyInterface = req.body;
            console.log("Review rating from request body: " + reviewRating);
            const reviewedUserId = req.params.reviewedPersonId;
            // const reviewerId  = req.session.id;
            const reviewerId = 1; // TODO: change this to the logged in user's id
            const reviewDateTime = new Date().toISOString();
            await Review.create({
                    reviewRating,
                    reviewDateTime,
                    reviewedUserId,
                    reviewerId
                },{transaction});
            res.status(201).send('Review created');
        }).catch((err) => {
            if(typeof err === 'string'){
                console.error(err);
                console.log("There was an error creating the review: " + err);
                res.status(500).send('Error creating trip: ' + err);
            } else if (err instanceof Error){
                console.log(err.message); 
                res.status(500).send('Error creating review: ' + err.message);
            }
        });
    }

//TODO logic to update the average rating of the user being reviewed 
export const updateReview = async (req: Request, res: Response): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const reviewId = req.params.id;
        const { reviewRating}: reviewRequestBodyInterface = req.body;
        const reviewDateTime = new Date().toISOString();
        Review.update({
            reviewRating,
            reviewDateTime
        }, {
            where: {
                reviewId
            },
            transaction
        })
    }).catch((err) => {
        console.error(err);
        if(typeof err === 'string'){
            console.log("There was an error updating the review: " + err);
            res.status(500).send('Error updating review: ' + err);
        } else if (err instanceof Error){
            console.log(err.message); 
            res.status(500).send('Error updating review: ' + err.message);
        }
    });
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

const updateAverageRating = (reviewRating: number, reviewedUserId: string): void => {
    
}