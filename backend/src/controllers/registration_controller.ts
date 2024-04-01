// #region import statements
import type { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import multer, { type FileFilterCallback } from 'multer';
import fs from 'fs';
import Driver from '../models/driver';
import Vehicle from '../models/vehicle';
import sequelize from '../database/connect_to_db';
import { type addUserRequestBodyInterface, type carRegisterRequestBodyInterface} from '../interfaces/trip_interfaces';

const saltRounds = 10;

interface MulterFile {
    // name: string;
    mimetype: string;
}


// #endregion
const initializeUpload = (username: string): (req: Request, res: Response, next: NextFunction) => void => {
    const storage = multer.diskStorage({    // store the uploaded files in the uploads folder
        destination: function(req,file,cb){    // cb is callback function that takes an error and a destination folder as parameters
            const dir = `./uploads/drivers/${username}`;   // create a folder for each driver using the username
            fs.access(dir, fs.constants.F_OK, (err) => {   // check if the folder already exists
                if(err !== null){    // err here means that the folder doesn't exist
                    fs.mkdir(dir, (err)=>{  // create the folder
                        if(err !== null){   // error when creating the folder 
                            console.log('Error from mkdir in initializeUpload:' + err.message);
                            cb(err, '');
                        }
                        else 
                            cb(null, dir);// if the folder doesn't exist, create it
                    });
                } else {
                    cb(null, dir);  // if the folder already exists, use it
                }
            })
        },
        filename: function(req,file,cb){
            cb(null, Date.now() + '-' + file.originalname); // give the file a name that includes the current date and time
        }
    });

    const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback): void => {  // checks if the file is an image or pdf
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf')
            cb(null, true); // accept the file
        else
            cb(null, false);    // reject the file
    };

    return multer({ storage, fileFilter }).fields([ // specify the fields to be uploaded
        {name: 'driversLicense', maxCount: 1},  //TODO take the id of the license
        {name: 'carsRegistration', maxCount: 1},
        {name: 'carsInsurance', maxCount: 1},
        {name: 'carImages', maxCount: 4},
    ]);
}

export const findUsernameAndInitializeUpload = (req: Request, res: Response, next: NextFunction): void => {
    async function findUsernameAndInitializeUploadAsync(): Promise<void> {
        try {
            const userId = req.params.id;
            const user: User | null = await User.findByPk(userId);
            if(user !== null)
                initializeUpload(user.username)(req, res ,next);
            else
                res.status(404).send('User not found');
        } catch(err) {
            if(err instanceof Error)
                console.error('Error from findUsernameAndInitializeUploadAsync:' + err.message);
            else if (typeof err === 'string')
                console.error('Error from findUsernameAndInitializeUploadAsync:' + err);
            res.status(500).send(err);
        }
    }
    findUsernameAndInitializeUploadAsync().catch(next);
};

export const addUser = (req: Request, res: Response, next: NextFunction): void => {
    async function addUserAsync(): Promise<void> {
        try {
            const {universityId, firstName, lastName, username, password, email, role, phone}: addUserRequestBodyInterface = req.body;
            const requiredFields = ['universityId', 'firstName', 'username', 'password', 'email', 'role']
            // console.log(req.body);
            for (const field of requiredFields){
                if(req.body[field] === undefined || req.body[field] === null || req.body[field] === '')
                    res.status(400).send(`${field} is missing`);
            }


            // check if the username already exists
            const existingUser = await User.findOne(
                {where: {
                        [Op.or]: [    // check if the username or universityId already exists
                            {username}, 
                            {universityId},
                            {email}
                        ]
                    }
                });
            if(existingUser !== null){
                let message = '';
                if(existingUser.getDataValue('username') === username)
                    message += 'Username already exists!';
                if(existingUser.getDataValue('universityId') === universityId)
                    message += 'University ID already exists!';
                if(existingUser.getDataValue('email') === email)
                    message += 'Email already exists!';
                res.status(400).send(message);
            }

            await sequelize.transaction(async (transaction) => {
                const hash = await bcrypt.hash(password, saltRounds); // hash the password before storing it in the database
                const newUser = await User.create({
                    universityId,
                    firstName,
                    lastName,
                    username,
                    password: hash,     // store the hashed password
                    email,
                    role,
                    phone
                }, {transaction});
                res.status(200).send(newUser);

            });
        } catch (err) {
            if (err instanceof Error)
                console.error('Error: ' + err.message);
            else if (typeof err === 'string')
                console.error('Error: ' + err);
            res.status(500).send(err);
        }
    }
    addUserAsync().catch(next); // catch any errors that occur in the addUserAsync function
}

export const addDriverAndVehicle = (req: Request, res: Response, next: NextFunction): void => {
    async function addDriverAndVehicleAsync(): Promise<void> {
        try {
            const driverId = req.params.id;
            const username: string = req.body.username;
            //TODO vehicle now has owner id field change logic accordingly
            const {vehicleId, ownerId, carMaker, carModel, carCapacity}: carRegisterRequestBodyInterface = req.body;
            const requiredFields = ['vehicleId', 'ownerId' , 'carMaker', 'carModel', 'carCapacity']
            for (const field of requiredFields){
                if(req.body[field] !== undefined || req.body[field] !== null || req.body[field] !== '')
                    res.status(400).send(`${field} is missing`);
            }
            const upload = initializeUpload(username); // initialize the upload function
            try{
                await new Promise<void> ((resolve,reject) => {
                    upload(req, res, (err) => { // upload the files
                        if(err !== null){
                            reject(err);
                            // console.log('Error from upload in addDriver:' + err);
                        }
                        else    
                            resolve();
                    });
                })
            } catch(err) { 
                if(err instanceof Error)
                    console.error('Error from upload in addDriver:' + err.message);
                else if (typeof err === 'string')
                    console.error('Error from upload in addDriver:' + err);
                res.status(500).send(err);
            }

            await sequelize.transaction(async (transaction) => {
                const newDriver = await Driver.create({ // create a new driver
                    // fields
                    driverId
                }, {transaction});

                const newVehicle = await Vehicle.create({   // create a new vehicle
                    // fields
                    plateNumber: vehicleId,
                    ownerId: ownerId,
                    maker: carMaker,
                    model: carModel,
                    noOfSeats: carCapacity
                }, {transaction});

                res.status(200).send({driver: newDriver, vehicle: newVehicle});
            });
        } catch(err) {
            if(err instanceof Error)
                console.error('Error from addDriverAndVehicleAsync:' + err.message);
            else if (typeof err === 'string')
                console.error('Error from addDriverAndVehicleAsync:' + err);
            res.status(500).send(err);
        }
    }
    addDriverAndVehicleAsync().catch(next);
}   

