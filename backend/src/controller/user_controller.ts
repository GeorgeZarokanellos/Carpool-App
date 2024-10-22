import { Op } from "sequelize";
import { User, Review, Trip, Stop, TripPassenger, TripStop, Driver } from "../model/association";
import { Request, Response, NextFunction, response } from "express";
import { Transaction } from "sequelize";
import sequelize from '../database/connect_to_db';
import { updatedUserInterface } from "../interface/interface";
import path from "path";
import fs from "fs";

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const userId: string = req.params.userId;
        const updateDetails: updatedUserInterface = req.body;
        const user = await User.findByPk(userId, { transaction });

        if (user !== null) {
            // If overallPoints is provided, add it to the existing points
            if (updateDetails.overallPoints !== undefined) {
                updateDetails.overallPoints = user.overallPoints + updateDetails.overallPoints;
            }

            await user.update(updateDetails, { transaction });
            res.status(200).json({ message: 'User updated successfully', user });
        } else {
            res.status(404).send('User not found');
        }
    })
    .catch((error) => {
        console.error(error);
        if (typeof error === 'string') {
            console.log("There was an error updating the user: " + error);
            res.status(500).send('Error updating user: ' + error);
        } else if (error instanceof Error) {
            console.log(error.message);
            res.status(500).send('Error updating user: ' + error.message);
        }
    });
};

export const retrieveUserReviews = async (userId: string) : Promise<Review[]> => {
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
                },
                {
                    model: User,
                    as: 'reviewedUser',
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

export const retrieveUserTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.userId;
    const nextScheduledTripId = req.params.nextScheduledTripId;
    try {
        const currentUserTrips = await Trip.findAll({
            where : {
                [Op.and] : [
                    {
                       driverId: Number(userId),
                    },
                    {
                        tripId: {
                            [Op.ne]: nextScheduledTripId
                        }
                    },
                    {
                        status: 'planning'
                    },
                    {
                        //get trips that are scheduled to start after the current time
                        startingTime: {
                            [Op.gte]: new Date()
                        }
                    }
                ]
            },
            order: [
                ['startingTime', 'ASC']
            ]
        });
        res.status(200).json(currentUserTrips);
    } catch (error) {
        console.error(error);
            if(typeof error === 'string'){
                console.log("There was an error retrieving the current trips: " + error);
                res.status(500).send('Error retrieving the current trips: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving the current trips: ' + error.message);
            }
    }
}

export const retrieveUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.userId;

    try {
        const userData = await User.findByPk(userId, {
            attributes: ['firstName', 'lastName', 'overallRating', 'role', 'currentTripId', 'pendingRequestTripId']
        });
        if(userData){
            let responseData = userData.toJSON();
            let driverData;
            if(userData.role === 'driver'){
                driverData = await Driver.findByPk(userId, {
                    attributes: ['nextScheduledTripId']
                });
            }
            if(driverData){
                responseData = {
                    ...responseData,
                    ...driverData.toJSON()
                }
            }
            res.status(200).json(responseData);
        } else {
            res.send(404).send('User not found');
        }
        
    } catch (error) {
        console.error(error);
            if(typeof error === 'string'){
                console.log("There was an error retrieving the user data: " + error);
                res.status(500).send('Error retrieving the user data: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving the user data: ' + error.message);
            }
    }
}

export const retrieveVehicleImages = async (req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const userId: string = req.params.userId;
        const tripDriver = await User.findByPk(userId);
        if(tripDriver !== null && tripDriver.role === 'driver'){
            //get the path to the folder containing the images
            const imageFolder = path.join(__dirname, `../../static/uploads/${tripDriver.userId}`);
            
            if(!fs.existsSync(imageFolder)){
                res.status(404).send('No images found');
                return;
            }
            //reads the contents of the folder
            const imageFilenames = fs.readdirSync(imageFolder);
            //filter only the images
            const jpgsFilenames = imageFilenames.filter(filename => filename.endsWith('.jpg') || filename.endsWith('.jpeg'));
            //construct the urls that the client can use to access the images (include /api for remote)
            const imageUrls = jpgsFilenames.map(filename => `${req.protocol}://${req.get('host')}/static/uploads/${tripDriver.userId}/${filename}`);
            if(imageUrls.length !== 0){
                res.status(200).json(imageUrls);
            } else {
                res.status(404).send('No images found');
                return;
            }
        } else {
            res.status(404).send('User not found or user is not a driver');
            return;
        }
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the vehicle images: " + error);
            res.status(500).send('Error retrieving the vehicle images: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving the vehicle images: ' + error.message);
        }
    }
}