import { type NextFunction, type Request, type Response } from 'express';
import Stop from "../model/stop"


export const returnAvailableStops = async (req: Request, res: Response, next: NextFunction) => {
    const side = req.params.side;
    const startLat = parseFloat(req.query.startLat as string);
    const startLng = parseFloat(req.query.startLng as string);
    const endLat = parseFloat(req.query.endLat as string);
    const endLng = parseFloat(req.query.endLng as string);

    try {
        const allStops: Stop[] = await Stop.findAll(
            {
                where: {
                    side
                },
                order: [['stopLocation', 'ASC']]    //sort stops alphabetically
            }
        );  
        const availableStops = allStops.filter(stop => {
            const stopLatBetween = (stop.lat >= startLat && stop.lat <= endLat) || (stop.lat <= startLat && stop.lat >= endLat);
            const stopLngBetween = (stop.lng >= startLng && stop.lng <= endLng) || (stop.lng <= startLng && stop.lng >= endLng);

            return stopLatBetween && stopLngBetween;
        });
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