import type { NextFunction, Request, Response } from "express";
import { retrieveUserReviews } from "../util/common_functions"; 
import { Review,User, Trip, TripPassenger} from "../model/association";
import type { reviewRequestBodyInterface } from "../interface/trip_interface";
import sequelize from '../database/connect_to_db';
import { type Transaction, Op } from 'sequelize';
import logger from '../util/winston';


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

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await sequelize.transaction(async (transaction: Transaction) => {
            const { reviewRating }: reviewRequestBodyInterface = req.body;
            logger.info("Review rating from request body: " + reviewRating);
            const reviewedUserId = Number(req.params.reviewedPersonId);
            const tripId = Number(req.params.tripId);
            logger.info("reviewed user id: " + reviewedUserId + " " + "trip id: " + tripId);
            // const reviewerId  = req.session.id;
            const reviewerId = 1; // TODO: change this to the logged in user's id
            const reviewDateTime = new Date().toISOString();
            let fromTrip: boolean = await checkIfUsersAreInTrip(tripId, reviewerId, reviewedUserId);
            if (fromTrip) { //if the reviewer is the driver or a passenger allow them to review someone that was on the trip
                const createdReview = await Review.create({
                        reviewRating,
                        reviewDateTime,
                        tripId,
                        reviewedUserId,
                        reviewerId
                    },{transaction});
                await calculateAverageRatingForNewReview(reviewRating, reviewedUserId);
                const UserToUpdate = await User.findOne({
                    where: {
                        userId: reviewedUserId
                    }
                });
                if(UserToUpdate != null){
                    logger.debug("no of reviews before update: " + UserToUpdate.noOfReviews);
                    UserToUpdate.noOfReviews += 1;  //increment the number of reviews of the user
                    logger.debug("no of reviews after update: " + UserToUpdate.noOfReviews);
                    await UserToUpdate.save();  //save the updated user
                }else
                    throw new Error("User not found when trying to update the number of reviews");
    
                    res.status(200).json({ message: "Review created", review: createdReview.toJSON() });
            } else 
                throw new Error("You are not allowed to review this trip");
        }).catch((err) => {
            if(typeof err === 'string'){
                console.error(err);
                logger.info("There was an error creating the review: " + err);
                res.status(500).send('Error creating trip: ' + err);
            } else if (err instanceof Error){
                logger.info(err.message); 
                res.status(500).send('Error creating review: ' + err.message);
            }
        });
    }

//TODO logic to update the average rating of the user being reviewed 
export const updateReview = async (req: Request, res: Response): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const reviewId = Number(req.params.id);
        const { reviewRating }: reviewRequestBodyInterface = req.body;
        const reviewDateTime = new Date().toISOString();
        const [updateCount, updatedReviews] = await Review.update({ //update the review
            reviewRating,
            reviewDateTime
        }, {
            where: {
                reviewId
            },
            returning: true,
            transaction
        })
        if (updateCount > 0) {  //if the review was updated
            const updatedReview = updatedReviews[0]; //get the updated review
            const reviewedUserId = updatedReview.reviewedUserId;
            //update the average rating of the user being reviewed
            if(isNaN(reviewedUserId))
                throw new Error("Invalid user id");
            else
                await calculateAverageRatingForUpdatedReview(reviewId, reviewRating, reviewedUserId);
            //send the updated review
            res.status(200).json({ message: "Review updated", review: updatedReview.toJSON() });
        } else {
            res.status(404).send('Review not found');
        }
    }).catch((err) => {
        console.error(err);
        if(typeof err === 'string'){
            logger.info("There was an error updating the review: " + err);
            res.status(500).send('Error updating review: ' + err);
        } else if (err instanceof Error){
            logger.info(err.message); 
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

const calculateAverageRatingForNewReview = async (reviewRating: number, reviewedUserId: number): Promise<void> => {
    try {       
        //find the user to update
        const userToUpdate: User | null = await User.findOne({
            where: {
                    userId: reviewedUserId
                }
        });
        //check if the user exists
        if(userToUpdate != null){
            logger.info("User found: " + userToUpdate.userId);
            let newOverallRating = 0;
            const userReviews = userToUpdate.noOfReviews;
            logger.info("Total reviews: " + userReviews);
            logger.info("Overall rating before update: " + userToUpdate.overallRating);
            //calculate the new overall rating
            if(userReviews != 0)
                {
                    logger.debug("User reviews" + userReviews);
                    logger.debug("Review rating" + reviewRating);
                    //multiply the old overall rating by the number of reviews to keep the impact of the old reviews
                    logger.debug("increase or decrease in overall rating: " + (reviewRating/userReviews));
                    newOverallRating = Number((userToUpdate.overallRating * userReviews) + reviewRating)/Number(userReviews + 1);  
                } else {
                    newOverallRating = Number(reviewRating);
                }

            logger.info("New overall rating: " + newOverallRating);
            //update the user's overall rating
            userToUpdate.overallRating = newOverallRating;
            userToUpdate.save();
        } else {
            throw new Error("User not found");
        }
    } catch( error) {
        if(typeof error === 'string'){
            console.error(error);
            logger.error("There was an error updating the average rating of the user: " + error);
        } else if (error instanceof Error){
            logger.error(error.message); 
        }
    }
    
}

const calculateAverageRatingForUpdatedReview = async (reviewId: number, reviewRating: number, reviewedUserId: number): Promise<void> => {
    try {
        const review = await Review.findOne({
            where: {
                reviewId
            }
        })
        const userToUpdate = await User.findOne({
            where: {
                userId: reviewedUserId
            }
        });
        if(review != null && userToUpdate != null){
            let overallRating = userToUpdate.overallRating;
            let adjustedOverallRating = 0;
            const userReviews = userToUpdate.noOfReviews;
            const oldReviewRating = review.reviewRating;
            logger.info("Old review rating: " + oldReviewRating);
            logger.info("Total reviews: " + userReviews);
            logger.info("Overall rating before update: " + overallRating);
            //calculate the new overall rating
            if(userReviews != 0){
                //remove the impact of the old review
                adjustedOverallRating = overallRating * userReviews - oldReviewRating;
            } else {
                adjustedOverallRating = 0;
            }
            const newOverallRating = Number((adjustedOverallRating + reviewRating)/Number(userReviews));
            logger.info("New overall rating: " + overallRating);
            //update the user's overall rating
            userToUpdate.overallRating = newOverallRating;
            userToUpdate.save();
        } else {
            if(review == null)
                throw new Error("Review not found");
            if(userToUpdate == null)
                throw new Error("User not found");
        }
    } catch (error) {
        if(typeof error === 'string'){
            console.error(error);
            logger.info("There was an error updating the average rating of the user: " + error);
        } else if (error instanceof Error){
            logger.info(error.message); 
        }
    }
}

const checkIfUsersAreInTrip = async (tripId: number, reviewerId: number, reviewedUserId: number): Promise<boolean> => {
    let fromTrip: boolean = false;
    logger.info("tripId: " + tripId + " reviewerId: " + reviewerId + " reviewedUserId: " + reviewedUserId + " from checkIfUsersAreInTrip");
    const trip = await Trip.findOne({
        where: {
            tripId,
            [Op.or]: [  //check if either of the users are driver in the trip
                {driverId: reviewerId},
                {driverId: reviewerId}
            ]
        },
        include: [
            {
                model: TripPassenger,
                as: 'tripPassengers',
                where: {
                    [Op.or]: [
                        {passengerId: reviewerId},
                        {passengerId: reviewedUserId}
                    ]
                },
                required: false //check if either of the users are in the trip
        }]
    });
    logger.info("Trip found: " + JSON.stringify(trip));
    if(!trip){
        logger.info("Trip not found or users are not in the trip");
        throw new Error("Trip not found or users are not in the trip");
    } else {
        fromTrip = true;
    }

    return fromTrip;
}