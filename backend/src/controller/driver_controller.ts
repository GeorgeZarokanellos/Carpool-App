import { Request, Response, NextFunction } from "express";
import Driver from "../model/driver";
import { Transaction } from "sequelize";
import sequelize from "../database/connect_to_db";

interface driverUpdateRequestBodyInterface {
    nextScheduledTripId: number;
}

export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await sequelize.transaction(async (transaction: Transaction) => {
            const updateDetails: driverUpdateRequestBodyInterface = req.body;
            const driverId = req.params.driverId;
            const driver = await Driver.findByPk(driverId, {transaction});
            if( driver !== null){
                await driver.update(updateDetails,{transaction});
                res.status(200).send('Driver updated successfully');
            } else {
                res.status(404).send('Driver not found');
            }
        })
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            res.status(500).send('Error updating driver\'s next scheduled trip: ' + error);
        } else if (error instanceof Error){
            res.status(500).send('Error updating driver\'s next scheduled trip: ' + error.message);
        }
    }
}