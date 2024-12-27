import { Op } from "sequelize";
import { User, Review, Trip, Stop, TripPassenger, TripStop, Driver, Coupon, UserCoupon } from "../model/association";
import Notification from '../model/notification';
import { Request, Response, NextFunction, response } from "express";
import { Transaction } from "sequelize";
import sequelize from '../database/connect_to_db';
import { CouponStatus, updatedUserInterface } from "../interface/interface";
import path from "path";
import fs from "fs";
import Vehicle from "../model/vehicle";

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

//User Information

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
    const currentTripId = req.query.currentTripId;
    const nextScheduledTripId = req.query.nextScheduledTripId;
    try {
        const currentUserTrips = await Trip.findAll({
            where : {
                [Op.and] : [
                    {
                       driverId: Number(userId),
                    },
                    {
                        tripId: {
                            [Op.and]: [
                                {
                                    [Op.ne]: currentTripId
                                },
                                {
                                    [Op.ne]: nextScheduledTripId
                                }
                            ]
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
            attributes: ['firstName', 'lastName', 'overallRating', 'overallPoints', 'role', 'currentTripId', 'pendingRequestTripId', 'tripCompleted', 'noOfTripsCompleted']
        });
        if(userData){
            let responseData = userData.toJSON();
            let driverData;
            let vehicleData;
            if(userData.role === 'driver'){
                driverData = await Driver.findByPk(userId, {
                    attributes: ['nextScheduledTripId']
                });
                vehicleData = await Vehicle.findOne({
                    where: {
                        ownerId: userId
                    },
                    attributes: ['noOfSeats']
                })
            }
            if(driverData){
                responseData = {
                    ...responseData,
                    ...driverData.toJSON(),
                    ...vehicleData?.toJSON()
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
            // const imageFolder = `/static/uploads/${tripDriver.userId}`;
            
            if(!fs.existsSync(imageFolder)){
                res.status(404).send('No images found');
                return;
            }
            //reads the contents of the folder
            const imageFilenames = fs.readdirSync(imageFolder);
            //filter only the images
            const jpgsFilenames = imageFilenames.filter(filename => filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'));
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

//User Notifications

export const deleteUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const userId: string = req.params.userId;
        const tripId: string = req.query.tripId as string;

        const notifications = await Notification.findAll({
            where: {
                passengerId: userId,
                tripId,
                type: {
                    [Op.or] : [
                        'request',
                        'delay'
                ]}
            },
            transaction
        });
        console.log("Notifications to be deleted", notifications);
        
        if (notifications.length === 0) {
            return res.status(404).send('Notifications not found');
        }

        await Promise.all(notifications.map(notification => notification.destroy({ transaction })));

        res.status(200).send('Notifications deleted');
    }).catch((err) => {
        console.error(err);
        if (typeof err === 'string') {
            console.log("There was an error deleting the notifications: " + err);
            res.status(500).send('Error deleting notifications: ' + err);
        } else if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send('Error deleting notifications: ' + err.message);
        }
    });
}

export const getUserRequestNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.params.userId;
        const tripId: string = req.query.tripId as string;
        let deleteStop = true;
        const resultNotification = await Notification.findOne({
            where: {
                tripId: tripId,
                passengerId: userId,
                status: 'accepted',
                type: 'request'
            }
        });
        if(resultNotification !== null){
            const similarNotifications = await Notification.findAll({
                where: {
                    notificationId : {
                        [Op.ne]: resultNotification.notificationId
                    },
                    tripId,
                    stopId: resultNotification.stopId,
                    status: 'accepted',
                    type: 'request'
                }
            });
            if(similarNotifications.length > 0){
                deleteStop = false;
            }
        res.status(200).json({notification: resultNotification, deleteStop});
        } else  
            res.status(404).send('Notification not found!');
    } catch (error) {
        res.status(500).send('Internal Server Error' + error);
    }
}

//User Coupons

export const retrieveCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponStatus = req.query.couponStatus as CouponStatus;
        const userId = req.query.userId;

        if (!Object.values(CouponStatus).includes(couponStatus)) {
            return res.status(400).json({ message: 'Invalid coupon status requested!' });
        }

        switch (couponStatus) {
            case CouponStatus.ACTIVE:
                const availableCouponsList = await Coupon.findAll({
                    attributes: ['couponId', 'title', 'description', 'discountValue', 'pointsCost']
                });
                if(availableCouponsList.length === 0){
                    return res.status(404).json({message: 'No available coupons found. Return later!'});
                }
                return res.status(200).json({data: availableCouponsList, message: 'Available coupons list retrieved!'})

            case CouponStatus.REDEEMED:
                const userCouponsList = await UserCoupon.findAll({
                    where: {
                        userId: userId
                    },
                    include: {
                        model: Coupon,
                        as: 'coupon',
                        attributes: ['title', 'description', 'code', 'discountValue', 'pointsCost']
                    },
                    order: [['purchasedAt', 'ASC']]
                });
                if(userCouponsList.length === 0){
                    return res.status(404).json({message: 'No User Coupons found! '})
                }
                return res.status(200).json({data: userCouponsList, message: 'User Coupons List retrieved!'});

            default:
                return res.status(400).json({message: 'Wrong type of coupon requested!'});
        }
    } catch (error) {
        return res.status(500).json({message: 'Error retrieving coupons!', error: error});
    }
}

export const addPurchasedCoupon = async (req: Request, res: Response, next: NextFunction) => {
    await sequelize.transaction(async (transaction: Transaction) => {
        try {
            const couponId = parseInt(req.params.couponId, 10);
            const {userId, couponPointsCost} = req.body;
            const userToUpdate = await User.findByPk(userId);

            if (!userToUpdate) {
                throw new Error('User not found');
            }

            if (userToUpdate.overallPoints < couponPointsCost) {
                throw new Error('Not enough points');
            }
            
            const removePointsFromUser = await userToUpdate.update(
                { overallPoints: userToUpdate.overallPoints - couponPointsCost },
                {transaction}
            );
            
            if(!removePointsFromUser){
                return res.status(400).json({message: 'Error subtracting user\'s points'})
            }

            const addCouponToUser = await UserCoupon.create(
                { userId: parseInt(userId, 10), couponId, couponStatus: CouponStatus.REDEEMED }, 
                {transaction}
            ); 

            if(!addCouponToUser){
                return res.status(400).json({message: 'Purchase of coupon failed'})
            }
            
            res.status(201).json({message: 'Coupon purchased successfully!'});
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).json({ message: 'An error occurred', error: error.message });
            else 
                res.status(500).json({ message: 'An error occurred', error: error });
        }
    })
}

export const removePurchasedCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = parseInt(req.params.couponId, 10);
        const userId = req.query.userId;
        
        const couponToBeDeleted = await UserCoupon.findOne({
            where: {
                userId,
                couponId
            }
        });
        
        if(!couponToBeDeleted){
            return res.status(404).json({message: 'Coupon to be deleted not found!'});
        }
        await couponToBeDeleted.destroy();
        return res.status(200).json({message: 'Coupon deleted successfully!'});
    } catch (error) {
        return res.status(500).json({message: 'Error! Failed to delete coupon.'});
    }
}