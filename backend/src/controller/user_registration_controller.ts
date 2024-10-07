import bcrypt from 'bcryptjs';
import User from '../model/user';
import sequelize from '../database/connect_to_db';
import multer, { type FileFilterCallback } from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { type addUserRequestBodyInterface} from '../interface/interface';
import fs from 'fs';
import { promisify } from 'util'; //takes a function and makes it return a promise

//TODO: handle image deletion after request has been made

const saltRounds = 10;
interface MulterFile {
    mimetype: string;
}

const localPath = '/home/george/Desktop/Carpool-App/backend/static/uploads';
const remotePath = '/home/zaro/backend/static/uploads';

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //multer uses memory storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, localPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback): void => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            console.log("Image accepted");
            cb(null, true); //accept the file
        } else 
            cb(null, false);  //reject the file
    }
    try{
        await new Promise((resolve,reject) => {
            multer({storage, fileFilter, limits:{fileSize: 5 * 1024 * 1024}}).single('profilePicture')(req,res,(err)=>{
                if(err){
                    reject(err);
                    console.warn("image wasn't uploaded");
                } else {
                    if (req.file !== undefined) {
                        console.log("Image was uploaded");
                        resolve(req);
                    } else {
                        console.warn("No file uploaded");
                        reject(new Error("No file uploaded"));
                    }
                    //TODO: add error handling
                }
            });
        });
        next();
    } catch(error) {
        console.warn("Error in image upload", error);
        res.status(500).json({ error: "Image upload failed", details: (error as Error).message });
    } 
}

export const addUser = (req: Request, res: Response, next: NextFunction): void => {
    async function addUserAsync(): Promise<void> {
        try {
            const readFileASync = promisify(fs.readFile);
            let fileBuffer;
            const {universityId, firstName, lastName, username, password, email, role, phone}: addUserRequestBodyInterface = req.body;
            const requiredFields = ['universityId', 'firstName', 'username', 'password', 'email', 'role'];
            // const uniIdInt = parseInt(universityId,10); //convert to int because multipart only sends strings
            let profilePicture: Buffer;
            // console.log(req.body);
            for (const field of requiredFields){
                if(req.body[field] === undefined || req.body[field] === null || req.body[field] === ''){
                    console.log(`${field}`);
                    res.status(400).json({ error: `${field} is missing` });
                    return;
                }
            }


            // check if the username|uniId|email already exists
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
                return;
            }
            //check if req.file is populated
            if (req.file !== undefined) {
                try {
                    fileBuffer = await readFileASync(req.file.path);
                    profilePicture = fileBuffer;
                } catch (error) {
                    res.status(500).json({ error: 'Error reading the file' });
                    return;
                }
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
                    phone,
                    profilePicture
                }, {transaction});
                res.status(200).json(newUser);

            });
        } catch (err) {
            if (err instanceof Error)
                console.log('Error: ' + err.message);
            else if (typeof err === 'string')
                console.log('Error: ' + err);
            res.status(500).send(err);
            return ;
        }
    }
    addUserAsync().catch(next); // catch any errors that occur in the addUserAsync function
}