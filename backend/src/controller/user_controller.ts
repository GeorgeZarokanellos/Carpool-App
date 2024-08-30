import { Op } from "sequelize";
import { User, Review, Trip, Stop, TripPassenger, TripStop, Driver } from "../model/association";
import { Request, Response, NextFunction } from "express";
import { Transaction } from "sequelize";
import sequelize from '../database/connect_to_db';
import { updatedUserInterface } from "../interface/interface";

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const userId: string = req.params.userId;
        const updateDetails: updatedUserInterface = req.body;
        const type = req.query.type;
        const user = await User.findByPk(userId, {transaction});
        if(user !== null ){
            if (type === 'points' && updateDetails.overallPoints !== undefined){
                const newOverallPoints = user.overallPoints + updateDetails.overallPoints;
                updateDetails.overallPoints = newOverallPoints;
            }
            await user.update(updateDetails, {transaction});
            res.status(200).json({ message: 'User updated successfully', user });
        } else {
            res.status(404).send('User not found');
        }
    })
    .catch((err) => {
        console.error(err);
        if(typeof err === 'string'){
            console.log("There was an error updating the user: " + err);
            res.status(500).send('Error updating user: ' + err);
        } else if (err instanceof Error){
            console.log(err.message); 
            res.status(500).send('Error updating user: ' + err.message);
        }
    });
};

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

export const retrieveUserSubmittedReviews = async (userId: string) : Promise<Review[]> => {
    try {
        const userSubmittedReviews: Review[] = await Review.findAll({
            where: {
                reviewerId: userId,
            },
            attributes: ['reviewedUserId', 'reviewerId', 'reviewRating', 'reviewDateTime'],
            include : [
                {
                    model: User,
                    as : 'reviewer',
                    attributes: ['firstName', 'lastName']  
                }
            ]
        })
        return userSubmittedReviews;
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the reviews: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
        return await Promise.resolve([]);
    }
}

export const retrieveCompletedTrips = async (userId: string): Promise<Trip[]> => {
    try {
        const tripsCompleted : Trip[] = await Trip.findAll({
            where : {
                [Op.or]: [
                    {
                        tripCreatorId: Number(userId),
                    },
                    {
                        driverId: Number(userId),
                    },
                    {
                        '$tripPassengers.passenger_id$': Number(userId)
                    }
                ],
                status: 'completed'
            },
            attributes : [ 'startLocationId', 'endLocationId', 'noOfStops', 'startingTime', 'noOfPassengers', 'status'],
            include : [
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['driverId'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['firstName', 'lastName']
                    }]
                },
                {
                    model: TripPassenger,
                    as: 'tripPassengers',
                },
                {
                    model: Stop,
                    as: 'startLocation',
                    attributes: ['stopLocation']
                },
                {
                    model: Stop,
                    as: 'endLocation',
                    attributes: ['stopLocation']
                },
            ]
        });
        return tripsCompleted;
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the trips created by the user: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
        return await Promise.resolve([]);
    }
}

export const retrieveParticipatedTrips = async (userId: string): Promise<Trip[]> => {
    try {
        const tripPassengerRecords: TripPassenger[] = await TripPassenger.findAll({
            where: {
                passengerId: Number(userId)
            }
        });
        const tripIds = tripPassengerRecords.map((tripPassenger) => tripPassenger.tripId);
        const tripsParticipated: Trip[] = await Trip.findAll({
            where: {
                tripId: {
                    [Op.in]: tripIds
                }
            }
        });
        return tripsParticipated;
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the trips the user has participated: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
        return await Promise.resolve([]);   // return an empty array if there is an error
    }
}

export const retrieveCurrentTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.userId;

    try {
        const currentUserTrips = await Trip.findAll({
            where : {
                [Op.and] : [
                    {
                        [Op.or]: [
                            {driverId: Number(userId)},
                            {'$tripPassengers.passenger_id$': Number(userId)}
                        ]
                    },
                    {
                        status: 'planning'
                    }
                ]
            },
            include: [
                {
                    model: TripPassenger,
                    as: 'tripPassengers',
                    attributes: ['passengerId'],
                },
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                },
                {
                    model :User,
                    as: 'tripCreator',
                    attributes: ['firstName', 'lastName']
                }
            ]
        });
        res.status(200).json(currentUserTrips);
    } catch (err) {
        console.error(err);
            if(typeof err === 'string'){
                console.log("There was an error retrieving the current trips: " + err);
                res.status(500).send('Error retrieving the current trips: ' + err);
            } else if (err instanceof Error){
                console.log(err.message); 
                res.status(500).send('Error retrieving the current trips: ' + err.message);
            }
    }
}

export const retrieveUserNameAndRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.userId;

    try {
        const userData = await User.findByPk(userId, {
            attributes: ['firstName', 'lastName', 'overallRating', 'role', 'currentTripId']
        });
        if(userData !== null){
            res.status(200).json(userData);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
            if(typeof err === 'string'){
                console.log("There was an error retrieving the user data: " + err);
                res.status(500).send('Error retrieving the user data: ' + err);
            } else if (err instanceof Error){
                console.log(err.message); 
                res.status(500).send('Error retrieving the user data: ' + err.message);
            }
    }
}
