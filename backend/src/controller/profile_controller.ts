import type { Request, Response, NextFunction } from "express";
import { User, Review, Trip, Stop, TripPassenger, TripStop } from "../model/association";
import { retrieveUserReviews } from "../util/common_functions";
import { role } from "../interface/trip_interface";

export const retrieveProfileInfo = (req: Request, res: Response, next: NextFunction): void => {
    async function retrieveProfileInfoAsync(): Promise<void> {
        const userId: string = req.params.id;
        // const userId: string = req.user.id;  //for later use
        const user: User | null = await User.findByPk(userId);
        console.log(user);
        
        if(user !== null){
            try {
                // retrieve the user's reviews, submitted reviews, trips created and trips participated
                const [userReviews, userSubmittedReviews, tripsCreated, tripsParticipated] = await Promise.all([
                    retrieveUserReviews(userId),
                    retrieveUserSubmittedReviews(userId),
                    retrieveCreatedTrips(user),
                    retrieveParticipatedTrips(user)
                ]);
                // create an array of objects containing the arrays to check and the message to log if the array is empty
                const arraysToCheck = [
                    {array: userReviews, message: 'This user has not been reviewed yet'},
                    {array: userSubmittedReviews, message: 'This user has not submitted any reviews yet'},
                    {array: tripsCreated, message: 'This user has not created any trips yet'},
                    {array: tripsParticipated, message: 'This user has not participated in any trips yet'}
                ];
                // check if any of the arrays are empty and log a message to the console
                arraysToCheck.forEach(({array, message}) => {
                    if(array.length === 0) {
                        console.log(message);
                    }
                });
                res.status(200).json({  // send the user profile information to the client
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    overallRating: user.overallRating,
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


const retrieveUserSubmittedReviews = async (userId: string) : Promise<Review[]> => {
    try {
        const userSubmittedReviews: Review[] = await Review.findAll({
            where: {
                reviewerId: userId,
            },
            attributes: ['reviewedUserId', 'reviewerId', 'rating', 'reviewDateTime'],
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
    retrieveProfileInfo,
}