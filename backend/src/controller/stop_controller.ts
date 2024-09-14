import { type NextFunction, type Request, type Response } from 'express';
import Stop from "../model/stop"


export const returnAvailableStops = async (req: Request, res: Response, next: NextFunction) => {
    const side = req.params.side;
    try {
        const availableStops: Stop[] = await Stop.findAll(
            {
                where: {
                    side
                }
            }
        );  
        res.status(200).json(availableStops);  
    } catch (error) {
        if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving stops: ' + error.message);
        } else {
            res.status(500).send('Error retrieving stops');
        }
    }
    
}