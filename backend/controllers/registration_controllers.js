const {Op} = require ('sequelize');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10; //determines the complexity of the generated hash
const multer = require ('multer');
const fs = require('fs');
const { urlToHttpOptions } = require('url');

const addUser = async (req,res) => {
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
            if(existingUser.username === username)
                message += 'Username already exists!';
            if(existingUser.universityId === universityId)
                message += 'University ID already exists!';
            if(existingUser.email === email)
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

const addDriver = async (req,res) => {
    try {
        const {carMaker, carModel, carCapacity} = req.body;
        const requiredFields = ['carMaker', 'carModel', 'carCapacity']
        for (let field of requiredFields){
            if(!req.body[field])
                return res.status(400).send(`${field} is missing`);
        }
        const storage = multer.diskStorage({    //store the uploaded files in the uploads folder
            destination: function(req,file,cb){    //cb is callback
                const dir = `./uploads/drivers/${req.body.username}`;   //create a folder for each driver using the username
                fs.existsSync(dir, exist => {   //check if the folder already exists
                    if(!exist)
                        return fs.mkdir(dir, error => cb(error, dir));
                    return cb(null, dir);
                })
            },
            filename: function(req,file,cb){
                cb(null, Date.now() + '-' + file.originalname); //give the file a name that includes the current date and time
            }
        })

        const upload = multer({storage: storage}).fields([
            {name: 'driverLicense', maxCount: 1},
            {name: 'carRegistration', maxCount: 1},
            {name: 'carInsurance', maxCount: 1},
            {name: 'car', maxCount: 4},
        ]);

        upload(req, res, (err) => {
            if(err)
                return res.status(500).send(err);
        })
    } catch(error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    addUser,
    addDriver,
}
