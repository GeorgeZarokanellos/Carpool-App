import type { Request, Response, NextFunction } from "express";
import { User} from "../model/association";
import { retrieveUserReviews, retrieveUserSubmittedReviews, retrieveCreatedTrips, retrieveParticipatedTrips } from "../controller/user_controller";


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
                    profilePicture: user.profilePicture,
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

