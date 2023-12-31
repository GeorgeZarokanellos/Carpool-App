const sequelize = require('../database/connect_to_db');
const User = require('../models/user');


const test_comms = async (req,res) => {
    try {
        // console.log('test_comms');
        await sequelize.authenticate();
        // res.status(200)
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const add_user = async (req,res) => {
    try {
        console.log('im in');
        const {university_id, first_name, last_name, username, password, email, role, phone} = req.body;
        const newUser = await User.create({
            university_id,
            first_name, 
            last_name, 
            username, 
            password, 
            email, 
            role, 
            phone});
        res.status(200).send(newUser);
    } catch (error) {
        console.error('Error: ' + error);
        res.status(500).send(error);
    }
}


module.exports = {
    test_comms,
    add_user,
}
