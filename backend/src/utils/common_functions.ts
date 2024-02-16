import { User, Review } from '../models/associations';


export const retrieveUserReviews = async (userId: string) : Promise<Review[]> => {
    // console.log(user);
    // console.log(user.userId);
    try {
            const userReviews: Review[] = await Review.findAll({
                where: {
                    reviewedUserId: userId
                },
                attributes: ['reviewerId', 'reviewRating', 'reviewDateTime'],
                include : [
                    {
                        model: User,
                        as : 'reviewer',
                        attributes: ['firstName', 'lastName']  
                    }
                ]
            });
            return userReviews;
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error retrieving the reviews: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
        return await Promise.resolve([]);
    }
};

export default {
    retrieveUserReviews
}