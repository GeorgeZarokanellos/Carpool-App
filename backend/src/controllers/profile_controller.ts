import type { Request, Response, NextFunction } from "express";
import { type Reviews} from "../models/associations";
import User from "../models/associations";

export const displayProfile = (req: Request, res: Response, next: NextFunction): void => {
    async function displayProfileAsync(): Promise<void> {
        try {
            const userId: string = req.params.id;
            const user: User | null = await User.findByPk(userId);
            if(user !== null){
                const reviews: Reviews[] = await user.getReviews();
                console.log(reviews);
                
            } else {
                res.status(500).send('User not found!');
            } 
        } catch (error) {
            console.error(error);
            if(typeof error === 'string'){
                console.log("There was an error deleting the trip's passengers: " + error);
                res.status(500).send('Error retrieving trips: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving trips: ' + error.message);
            }
            
        }
    }
};
