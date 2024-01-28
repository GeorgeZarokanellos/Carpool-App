//#region import statements
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import Driver from '../models/driver';
import Vehicle from '../models/vehicle';
import sequelize from '../database/connect_to_db';

const saltRounds = 10;

interface MulterFile {
    // name: string;
    mimetype: string;
}


//#endregion


export const findUsernameAndInitializeUpload = async (req: Request,res: Response,next: NextFunction) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if(!user)
        return res.status(404).send('User not found');
    initializeUpload(user.getDataValue('username'))(req,res,next);
};

const initializeUpload = (username: string) => {
    const storage = multer.diskStorage({    //store the uploaded files in the uploads folder
        destination: function(req,file,cb){    //cb is callback function that takes an error and a destination folder as parameters
            const dir = `./uploads/drivers/${username}`;   //create a folder for each driver using the username
            fs.access(dir, fs.constants.F_OK, (err) => {   //check if the folder already exists
                if(err){    //err here means that the folder doesn't exist
                    fs.mkdir(dir, (err)=>{  //create the folder
                        if(err){ 
                            cb(err, '');
                            console.log('Error from mkdir in initializeUpload:' + err);
                        }
                        else 
                            cb(null, dir);  //if the folder doesn't exist, create it
                    });
                } else {
                    cb(null, dir);  //if the folder already exists, use it
                }
            })
        },
        filename: function(req,file,cb){
            cb(null, Date.now() + '-' + file.originalname); //give the file a name that includes the current date and time
        }
    });

    const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback) => {  //checks if the file is an image or pdf
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf')
            cb(null, true); //accept the file
        else
            cb(null, false);    //reject the file
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter
    }).fields([ //specify the fields to be uploaded
        {name: 'driversLicense', maxCount: 1},  
        {name: 'carsRegistration', maxCount: 1},
        {name: 'carsInsurance', maxCount: 1},
        {name: 'carImages', maxCount: 4},
    ]);
}

export const addUser = async (req: Request, res: Response) => {
    try {
        const {universityId, firstName, lastName, username, password, email, role, phone} = req.body;
        const requiredFields = ['universityId', 'firstName', 'username', 'password', 'email', 'role']
        // console.log(req.body);
        for (let field of requiredFields){
            if(!req.body[field])
                return res.status(400).send(`${field} is missing`);
        }
        

        //check if the username already exists
        const existingUser = await User.findOne(
            {where: {
                    [Op.or]: [    //check if the username or universityId already exists
                        {username: username}, 
                        {universityId: universityId},
                        {email: email}
                    ]
                }
            });
        if(existingUser){
            let message = '';
            if(existingUser.getDataValue('username') === username)
                message += 'Username already exists!';
            if(existingUser.getDataValue('universityId') === universityId)
                message += 'University ID already exists!';
            if(existingUser.getDataValue('email') === email)
                message += 'Email already exists!';
            return res.status(400).send(message);
        }
        
        bcrypt.hash(password, saltRounds, async function(err, hash){    //hash the password before storing it in the database
            if(err) throw err; //check for hashing errors first then proceed to store the user in the database
            const newUser = await User.create({
                universityId,
                firstName, 
                lastName, 
                username, 
                password: hash, //store the hashed password in the database
                email, 
                role, 
                phone
            });
            res.status(200).send(newUser);
        });
    } catch (error) {
        console.error('Error: ' + error);
        res.status(500).send(error);
    }
}

export const addDriverAndVehicle = async (req: Request, res: Response) => {
    try {
        const driverId = req.params.id;
        const {vehicleId, carMaker, carModel, carCapacity} = req.body;
        const requiredFields = ['vehicleId', 'carMaker', 'carModel', 'carCapacity']
        for (let field of requiredFields){
            if(!req.body[field])
                return res.status(400).send(`${field} is missing`);
        }
        const upload = initializeUpload(req.body.username); //initialize the upload function
        try{
            await new Promise<void> ((resolve,reject) => {
                upload(req, res, (err) => { //upload the files
                    if(err){
                        reject(err);
                        // console.log('Error from upload in addDriver:' + err);
                    }
                    else    
                        resolve();
                });
            })
        } catch(error) { 
            return res.status(500).send(error);
        }
        
        const transaction = await sequelize.transaction(); //create a transaction to ensure that the driver and vehicle are created together

        try {
            const newDriver = await Driver.create({ //create a new driver
                //fields
                driverId: driverId,
                vehicleId: vehicleId
            },{transaction});

            const newVehicle = await Vehicle.create({   //create a new vehicle
                //fields
                plateNumber: vehicleId,
                maker: carMaker,
                model: carModel,
                noOfSeats: carCapacity
            }, {transaction});
            

            await transaction.commit(); //commit the transaction
            res.status(200).send({driver:newDriver, vehicle: newVehicle});
        } catch(error) {
            if(error instanceof Error){
                if(error.name === 'SequelizeForeignKeyConstraintError')
                    return res.status(400).send(error);
                // console.log('Error from transaction:' + error);
                await transaction.rollback(); //rollback the transaction if an error occurs
            }  else {
                console.log('Error is not of type Error:' + error);
                
            }
        }

    } catch(error) {
        return res.status(500).send(error);
    }
}

export default {
    addUser,
    findUsernameAndInitializeUpload,
    addDriverAndVehicle,
}