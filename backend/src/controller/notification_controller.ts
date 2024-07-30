import { type NextFunction, type Request, type Response } from 'express';
import sequelize from '../database/connect_to_db';
import Notification from '../model/notification';
import { Transaction } from 'sequelize';
import { notificationInterface, updatedNotificationInterface } from '../interface/interface';
import { Op } from 'sequelize';

export const getNotifications = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.params.userId;
        const notifications = await Notification.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {driverId: userId},
                            {passengerId: userId}
                        ]
                    },
                    {status: 'pending'}
                ]
            }
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            // console.log("There was an error retrieving the trips: " + error);
            res.status(500).send('Error retrieving notifications: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving notifications: ' + error.message);
        }
    }
}

export const getNotification = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findByPk(req.params.notificationId);
        if(notification !== null)
            res.status(200).json(notification);
        else
            res.status(404).send('Notification not found');
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            // console.log("There was an error retrieving the trips: " + error);
            res.status(500).send('Error retrieving notification: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving notification: ' + error.message);
        }
    }
}

export const createNotification = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await sequelize.transaction(async (transaction: Transaction) => {
            const {driverId, passengerId, tripId, message, stopId}: notificationInterface = req.body;
            const notification = await Notification.create({driverId, passengerId, tripId, message, stopId});
            await notification.save({transaction}); 
        });
        res.status(201).send('Notification created');  
    } catch (err) {
        console.error(err);
        if (typeof err === 'string') {
            console.log("There was an error creating the notification: " + err);
            res.status(500).send('Error creating notification: ' + err);
        } else if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send('Error creating notification: ' + err.message);
        }
    }
}

export const updateNotification = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await sequelize.transaction(async (transaction: Transaction) => {
            const notificationId: string = req.params.notificationId;
            const updateDetails: updatedNotificationInterface = req.body;
            const notification = await Notification.findByPk(notificationId);
            if(notification !== null){
                await notification.update(updateDetails, {transaction});
                await notification.save({transaction});
                res.status(200).json(notification);
            } else {
                res.status(404).send('Notification not found');
            }
        });
        res.status(200).send('Notification updated');
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            // console.log("There was an error updating the trip: " + error);
            res.status(500).send('Error updating notification: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error updating notification: ' + error.message);
        }
    }
}

export const deleteNotification = async(req: Request, res: Response, next: NextFunction) => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const notificationId: string = req.params.notificationId;
        const notification = await Notification.findByPk(notificationId);
        if(notification !== null){
            await notification.destroy({transaction});
            res.status(200).send('Notification deleted');
        } else {
            res.status(404).send('Notification not found');
        }
    }).catch((err) => {
        console.error(err);
        if(typeof err === 'string'){
            console.log("There was an error deleting the notification: " + err);
            res.status(500).send('Error deleting notification: ' + err);
        } else if (err instanceof Error){
            console.log(err.message); 
            res.status(500).send('Error deleting notification: ' + err.message);
        }
    });
}