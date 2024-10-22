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
// #endregion

interface MulterFile {
    mimetype: string;
}

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
                //check if any files were uploaded
                if (req.files && Object.keys(req.files).length === 0) {
                    console.warn("No files were uploaded.");
                    res.status(400).send('No files were uploaded.');
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
const initializeUpload = async (req:Request, res:Response, next: NextFunction , userId: number): Promise<void> => {
    // store the uploaded files in the uploads folder
    const localPath = `/home/george/Desktop/Carpool-App/backend/static/uploads/${userId}`;
    const remotePath = `/home/zaro/backend/static/uploads/${userId}`;
    
    const Storage = multer.diskStorage({   
        destination: function(req,file,cb){    // cb is callback function that takes an error and a destination folder as parameters
            if(!userId){
                throw new Error('Username is missing');
            }
            const dir = path.resolve(localPath);   // create a folder for each driver using the username
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
        console.log("Error from initializeUpload:", error);
        res.status(500).json({ error: "Initialization of file upload failed", details: (error as Error).message });
    }
}

export const retrieveUserAndInitializeUpload = async (req:Request, res: Response, next: NextFunction , driverId: number): Promise<void> => {
    try {
        const user: User | null = await User.findByPk(driverId);
        
        if (user !== null) {
            const userId: number = user.userId;
            try {
                await initializeUpload(req, res, next, userId); // initialize the upload function
            } catch (error) {
                console.log("error in initializing upload", error);
                res.status(500).json({ error: "Initialization of file upload failed", details: (error as Error).message });
            }
        } else {
            res.status(404).json({ error: "User not found from initialization of upload" });
            return;
        }
    } catch (error) {
        if (error instanceof Error){
            console.log("Error from retrieveUserAndInitializeUpload:", error);
            res.status(500).json({ error: "Initialization of file upload failed", details: (error as Error).message });
        } else {
            console.log("Error from retrieveUserAndInitializeUpload:", error);
            res.status(500).json({ error: "Initialization of file upload failed", details: error });
        }
            
        // return Promise.reject(err);
    }
};

export const addDriverAndVehicle = (req: Request, res: Response, next: NextFunction): void => {
    async function addDriverAndVehicleAsync(): Promise<void> {
        try {
            const driverId = Number(req.params.id);
            const {licenseId, plateNumber, maker, model, noOfSeats}: carRegisterRequestBodyInterface = req.body;            
            // create a new driver and vehicle in a transaction
            await sequelize.transaction(async (transaction) => {
                const newDriver = await Driver.create({ 
                    driverId,
                    licenseId,
                }, {transaction});

                const newVehicle = await Vehicle.create({
                    plateNumber,
                    ownerId: driverId,  
                    maker,
                    model,
                    noOfSeats
                }, {transaction});

                const user = await User.findByPk(driverId, {transaction});
                if(user !== null)
                    await user.update({role: 'driver'}, {transaction}); // update the role of the user to driver
                else {
                    console.error('User not found');
                    return;
                }

                res.status(200).send({driver: newDriver, vehicle: newVehicle, files: req.files});
            });


        } catch(err) {
            if(err instanceof Error){
                console.error(err.message);
                res.status(500).json({ error: 'Error adding driver and vehicle' , details: err.message });
            } else {
                console.error(err);
                res.status(500).json({ error: 'Error adding driver and vehicle', details: err });
            }
        }
    }
    addDriverAndVehicleAsync().catch(next);
}   

