// #region import statements
import type { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../model/user';
import bcrypt from 'bcryptjs';
import multer, { type FileFilterCallback } from 'multer';
import fs from 'fs';
import Driver from '../model/driver';
import Vehicle from '../model/vehicle';
import sequelize from '../database/connect_to_db';
import { type addUserRequestBodyInterface, type carRegisterRequestBodyInterface} from '../interface/trip_interface';
import path from 'path';

const saltRounds = 10;

interface MulterFile {
    // name: string;
    mimetype: string;
}
// #endregion

const uploadFiles = async (
        req: Request,
        res: Response,
        storage: multer.StorageEngine, 
        fileFilter: (req: Request, file: MulterFile, cb: FileFilterCallback) => void
    ): Promise<void> => {
    try {
        await new Promise((resolve,reject) => {
            multer({storage, fileFilter}).fields([ // specify the fields to be uploaded
               //multer uses the name attribute of the input field to determine the field name
               {name: 'driversLicense', maxCount: 1},  
               {name: 'vehicleRegistration', maxCount: 1},
               {name: 'vehicleInsurance', maxCount: 1},
               {name: 'vehicleImages', maxCount: 4},
           ])(req,res, (err)=>{
            if(err)
                reject(err)
            else {
                
                if (req.files && Object.keys(req.files).length === 0) {
                    console.warn("No files were uploaded.");
                } else {
                    console.log("Uploaded files:", req.files);
                }
                resolve(req);
            }
           });
        })
    } catch (error) {
        console.log("error from uploadFilesSync", error);
    }
}

const initializeUpload = async (req:Request, res:Response, next: NextFunction , username: string): Promise<void> => {
    // store the uploaded files in the uploads folder
    const Storage = multer.diskStorage({   
        destination: function(req,file,cb){    // cb is callback function that takes an error and a destination folder as parameters
            if(!username){
                throw new Error('Username is missing');
            }
            const dir = path.resolve(`/home/george/Desktop/Carpool App/backend/static/uploads/${username}`);   // create a folder for each driver using the username
            fs.access(dir, fs.constants.F_OK, (err) => {   // check if the folder already exists
                if(err !== null){    // err here means that the folder doesn't exist
                    fs.mkdir(dir, {recursive:true}, (err)=>{  // create the folder
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
        console.log("file type",file.mimetype);
        
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf'){
            console.log("Accepted the file", file);
            
            cb(null, true); // accept the file
        }
        else
            cb(null, false);    // reject the file
    };

    try {
        await uploadFiles(req, res, Storage, fileFilter);
        next();
    } catch (error) {
        console.log("Error from initialize upload in upload files");
        
    }
}

export const findUsernameAndInitializeUpload = async (req:Request, res: Response, next: NextFunction , driverId: number): Promise<void> => {
    try {
        const user: User | null = await User.findByPk(driverId);
        // console.log("User from findUsername", user);
        
        if (user !== null) {
            const username: string = user.username;
            try {
                await initializeUpload(req,res, next,username); // initialize the upload function
            } catch (error) {
                console.log("error in initializing upload", error);
                // next(error);
            }
        } else {
            res.status(404).send('User not found from initialization of upload');
            // return Promise.reject('User not found from initialization of upload');
        }
    } catch (err) {
        if (err instanceof Error)
            console.error('Error from findUsernameAndInitializeUpload:' + err.message);
        else if (typeof err === 'string')
            console.error('Error from findUsernameAndInitializeUpload:' + err);
        res.status(500).send(err);
        // return Promise.reject(err);
    }
};

export const addUser = (req: Request, res: Response, next: NextFunction): void => {
    async function addUserAsync(): Promise<void> {
        try {
            const {universityId, firstName, lastName, username, password, email, role, phone}: addUserRequestBodyInterface = req.body;
            const requiredFields = ['universityId', 'firstName', 'username', 'password', 'email', 'role']
            // console.log(req.body);
            for (const field of requiredFields){
                if(req.body[field] === undefined || req.body[field] === null || req.body[field] === ''){
                    console.log(`${field}`);
                    res.status(400).json({ error: `${field} is missing` });
                    return;
                }
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
                res.status(200).json(newUser);

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
            const driverId = Number(req.params.id);
            // const bodyFromMulter: carRegisterRequestBodyInterface =  await findUsernameAndInitializeUpload(req, res, next, driverId);
            const {plateNumber, maker, model, noOfSeats} = req.body;
            // console.log('body from multer', bodyFromMulter);

            // create a new driver and vehicle in a transaction
            
            await sequelize.transaction(async (transaction) => {
                const newDriver = await Driver.create({ // create a new driver
                    // fields
                    driverId,
                    licenseId: 90341, // temporary value
                }, {transaction});

                const newVehicle = await Vehicle.create({   // create a new vehicle
                    // fields
                    plateNumber,
                    ownerId: driverId,  
                    maker,
                    model,
                    noOfSeats
                }, {transaction});

                res.status(200).send({driver: newDriver, vehicle: newVehicle, files: req.files});
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

