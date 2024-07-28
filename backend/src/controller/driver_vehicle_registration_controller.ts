// #region import statements
import type { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import multer, { type FileFilterCallback } from 'multer';
import fs from 'fs';
import Driver from '../model/driver';
import Vehicle from '../model/vehicle';
import sequelize from '../database/connect_to_db';
import path from 'path';
import { carRegisterRequestBodyInterface } from '../interface/interface';


interface MulterFile {
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
//TODO check if the files to be uploaded are the same with existing ones
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
                await initializeUpload(req, res, next, username); // initialize the upload function
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

export const addDriverAndVehicle = (req: Request, res: Response, next: NextFunction): void => {
    async function addDriverAndVehicleAsync(): Promise<void> {
        try {
            const driverId = Number(req.params.id);
            // const bodyFromMulter: carRegisterRequestBodyInterface =  await findUsernameAndInitializeUpload(req, res, next, driverId);
            const {plateNumber, maker, model, noOfSeats}: carRegisterRequestBodyInterface = req.body;
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

