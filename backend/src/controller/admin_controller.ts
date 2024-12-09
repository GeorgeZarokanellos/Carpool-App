import {Request, Response ,NextFunction } from "express";
import sequelize from "../database/connect_to_db";
import { Op } from "sequelize";
import { Coupon, User, Trip } from "../model/association";

export const retrieveAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll(
            {
                attributes: ['universityId', 'firstName', 'lastName', 'email', 'role', 'phone', 'overallRating', 'overallPoints', 'noOfReviews'],
                where: {
                    role: {
                        [Op.ne]: 'admin'
                    } 
                        
                }
            }
        );
        res.status(200).json(users);
    } catch (error) {
        console.log("Error trying to retrieve users", error);
        res.status(500).json({message: 'Error trying to retrieve users', error: error})
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIdToBeDeleted = req.params.userId;

        const deleteUserResponse = await User.destroy(
            {
                where: {
                    userId: userIdToBeDeleted 
                }
            }
        )
        if(deleteUserResponse === 0)
            res.status(404).json({message: 'User to be deleted not found!'});
        else 
            res.status(200).json({message: 'User deleted successfully'});

    } catch (error) {
        res.status(500).json({message: 'Error deleting the user', error: error});      
    }
}

export const retrieveAllTrips = async (req: Request, res: Response, next: Function) => {
    try {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);
        const tripStatus = req.query.status;

        const tripsBetweenDates = await Trip.findAll({
            where: {
                startingTime: {
                    [Op.between]: [startDate, endDate]
                },
                status: tripStatus
            }
        });

        res.status(200).json(tripsBetweenDates);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving trips between dates', error: error});
    }
}

export const retrieveAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await Coupon.findAll(
            {
                order: [['createdAt', 'DESC']]
            }
        );
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving coupons', error: error});
    }
}

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, description, discountValue, pointsCost} = req.body;
        const newCoupon = await Coupon.create({
            title,
            description,
            discountValue,
            pointsCost
        });
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(500).json({message: 'Error creating coupon', error: error});
    }
}

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.couponId;
        const updateDetails = req.body;

        const couponToUpdate = await Coupon.findByPk(couponId);
        if(!couponToUpdate){
            res.status(404).json({message: 'Coupon to be updated not found!'});
        } else {
            const updatedCoupon = await couponToUpdate.update(updateDetails);
            res.status(200).json(updatedCoupon);
        }

    } catch (error) {
        res.status(500).json({message: 'Error updating coupon', error: error});
    }
}

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.couponId;
        const deleteCouponResponse = await Coupon.destroy({
            where: {
                couponId
            }
        });
        if(deleteCouponResponse === 0)
            res.status(404).json({message: 'Coupon to be deleted not found!'});
        else 
            res.status(200).json({message: 'Coupon deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting the coupon', error: error});
    }
}