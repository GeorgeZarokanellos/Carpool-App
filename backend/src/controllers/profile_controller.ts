import type { Request, Response, NextFunction } from "express";
import { User, Reviews } from "../models/associations";

export const displayProfile = (req: Request, res: Response, next: NextFunction): void => {
    async function displayProfileAsync(): Promise<void> {
        try {
            const userId: string = req.params.id;
            // const userId: string = req.user.id;  //for later use
            const user: User | null = await User.findByPk(userId);
            if(user !== null){
                const reviews: Reviews[] = await Reviews.findAll({
                    where: {
                        reviewedPersonId: userId
                    }
                });
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
    displayProfileAsync().catch(next);
};


export default {
    displayProfile
}