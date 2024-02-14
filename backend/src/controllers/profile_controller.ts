import type { Request, Response, NextFunction } from "express";
import { User, Review, Trip, Stop, TripPassenger, TripStop } from "../models/associations";

export const retrieveProfileInfo = (req: Request, res: Response, next: NextFunction): void => {
    async function retrieveProfileInfoAsync(): Promise<void> {
        const userId: string = req.params.id;
        // const userId: string = req.user.id;  //for later use
        const user: User | null = await User.findByPk(userId);
        if(user !== null){
            try {
                const [userReviews, userSubmittedReviews, tripsCreated, tripsParticipated] = await Promise.all([
                    retrieveUserReviews(user),
                    retrieveUserSubmittedReviews(user),
                    retrieveCreatedTrips(user),
                    retrieveParticipatedTrips(user)
                ]);
                const arraysToCheck = [
                    {array: userReviews, message: 'This user has not been reviewed yet'},
                    {array: userSubmittedReviews, message: 'This user has not submitted any reviews yet'},
                    {array: tripsCreated, message: 'This user has not created any trips yet'},
                    {array: tripsParticipated, message: 'This user has not participated in any trips yet'}
                ];
                arraysToCheck.forEach(({array, message}) => {
                    if(array.length === 0) {
                        console.log(message);
                    }
                });
                res.status(200).json({
                    userReviews,
                    userSubmittedReviews,
                    tripsCreated,
                    tripsParticipated
                });
            } catch (error){
                console.error(error);
                res.status(500).send('There was an error retrieving the user profile information');
            }
            
        } else {
            res.status(404).send('User not found');
        }
    }
    retrieveProfileInfoAsync().catch(next);
};

const retrieveUserReviews = async (user: User) : Promise<Review[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
            const userReviews: Review[] = await Review.findAll({
                where: {
                    reviewedUserId: user.userId
                },
                attributes: ['reviewerId', 'rating', 'reviewDate'],
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

const retrieveUserSubmittedReviews = async (user: User) : Promise<Review[]> => {
    try {
        const userSubmittedReviews: Review[] = await Review.findAll({
            where: {
                reviewerId: user.userId,
            },
            attributes: ['reviewedUserId', 'reviewerId', 'rating', 'reviewDate'],
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

const retrieveCreatedTrips = async (user: User): Promise<Trip[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
        const tripsCreated : Trip[] = await Trip.findAll({
            where : {
                tripCreatorId: user.userId 
            },
            attributes : [ 'startLocation', 'stops', 'tripDate', 'passengers'],
            include : [
                {
                    model: User,
                    as: 'tripCreator',
                    attributes: ['firstName', 'lastName'] 
                },
                {
                    model: TripPassenger,
                    as: 'tripPassengers',
                    include: [
                        {
                            model: User,
                            as: 'passenger',
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                },
                {
                    model: TripStop,
                    as: 'tripStop',
                    include: [
                        {
                            model: Stop,
                            as: 'stopLocation',
                            attributes: ['stopLocation']
                        }
                    ]
                }
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

const retrieveParticipatedTrips = async (user: User): Promise<Trip[]> => {
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

export default {
    retrieveProfileInfo
}