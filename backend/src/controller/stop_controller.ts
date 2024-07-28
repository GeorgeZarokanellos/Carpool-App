import { type NextFunction, type Request, type Response } from 'express';
import Stop from "../model/stop"


export const returnAvailableStops = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableStops: Stop[] = await Stop.findAll();  
        res.status(200).json(availableStops);  
    } catch (error) {
        console.error(error);
            if(typeof error === 'string'){
                // console.log("There was an error retrieving the trips: " + error);
                res.status(500).send('Error retrieving stops: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving stops: ' + error.message);
            }
    }
    
}