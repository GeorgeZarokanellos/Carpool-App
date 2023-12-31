const sequelize = require('../database/connect_to_db');
const {Op} = require ('sequelize');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10; //determines the complexity of the generated hash

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


module.exports = {
    addUser,
}
