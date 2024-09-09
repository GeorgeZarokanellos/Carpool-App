import {Review, User} from '../model/association';
import {validationResult} from 'express-validator';
import type {NextFunction, Request, Response} from 'express';


export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
          res.status(400).json({errors: errors.array()});
    } else
        next();
 
};

export default {
    validate
}