import { Op } from "sequelize";
import { User, Review, Trip, Stop, TripPassenger, TripStop, Driver } from "../model/association";
import { Request, Response, NextFunction } from "express";

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

export const retrieveCreatedTrips = async (user: User): Promise<Trip[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
        const tripsCreated : Trip[] = await Trip.findAll({
            where : {
                tripCreatorId: user.userId,
                // status: 'completed'
            },
            attributes : [ 'startLocation', 'noOfStops', 'startingTime', 'noOfPassengers', 'status'],
            include : [
                // {
                //     model: User,
                //     as: 'tripCreator',
                //     attributes: ['firstName', 'lastName'] 
                // },
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['driverId'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['firstName', 'lastName']
                    }]
                }
                // {
                //     model: TripPassenger,
                //     as: 'tripPassengers',
                //     include: [
                //         {
                //             model: User,
                //             as: 'passenger',
                //             attributes: ['firstName', 'lastName']
                //         }
                //     ]
                // },
                // {
                //     model: TripStop,
                //     as: 'tripStop',
                //     include: [
                //         {
                //             model: Stop,
                //             as: 'stopLocation',
                //             attributes: ['stopLocation']
                //         }
                //     ]
                // }
            ]
        });
        return tripsCreated;
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

export const retrieveParticipatedTrips = async (user: User): Promise<Trip[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
        const tripIds: TripPassenger[] = await TripPassenger.findAll({
            where: {
                passengerId: user.userId
            }
        });
        const tripsParticipated: Trip[] = await Trip.findAll({
            where: {
                tripId: tripIds.map(tripId => tripId.tripId)
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
            attributes: ['firstName', 'lastName', 'overallRating', 'role']
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