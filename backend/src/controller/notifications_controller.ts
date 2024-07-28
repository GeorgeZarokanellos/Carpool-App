import { type NextFunction, type Request, type Response } from 'express';
import sequelize from '../database/connect_to_db';
import Notification from '../model/notification';

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