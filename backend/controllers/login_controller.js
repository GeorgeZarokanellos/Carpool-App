const User = require('../models/user');
const bcrypt = require('bcryptjs');

const login = async (req,res) => {
    const requiredFields = ['username', 'password'];
    for (let field of requiredFields){
        if(!req.body[field])
            return res.status(400).send(`${field} is missing`);
    }
    try{
        const {username, password} = req.body;
        const existingUser = await User.findOne({where: {username: username}})
        if(!existingUser)
            return res.status(400).send('Invalid username');
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if(!validPassword)
            return res.status(400).send('Invalid password');   
        res.status(200).send(existingUser); 
    } catch(error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    login,
}