import { type NextFunction, type Request, type Response } from 'express';
import sequelize from '../database/connect_to_db';
import Notification from '../model/notification';
import { Transaction } from 'sequelize';
import { notificationInterface } from '../interface/interface';

export const getNotifications = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.findAll();
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
    await sequelize.transaction(async (transaction: Transaction) => {
        const {receiverId, message}: notificationInterface = req.body;
        const notification = await Notification.create({receiverId, message});
        await notification.save({transaction});
    }).catch((err) => {
        console.error(err);
        if(typeof err === 'string'){
            console.log("There was an error creating the notification: " + err);
            res.status(500).send('Error creating notification: ' + err);
        } else if (err instanceof Error){
            console.log(err.message); 
            res.status(500).send('Error creating notification: ' + err.message);
        }
    });
}

export const updateNotification = async(req: Request, res: Response, next: NextFunction) => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const notificationId: string = req.params.notificationId;
        const userId: number = req.body;
        const notification = await Notification.findByPk(notificationId);
        const updatedStatus: string = req.body;
    });
}