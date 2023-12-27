const db = require('../database/db');

const test_comms = async (req,res) => {
    try {
        console.log('test_comms');
        const result = await db.test_connection();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const test_insert = async (req,res) => {
    const {university_id, first_name, last_name, username,  password, email, phone, role} = req.body;    //destructure the name from the body
    const john = {university_id, first_name, last_name, username,  password, email, phone, role};
    // if(username && password){
    //     return res.status(200).send(`Welcome ${username}`);
    // }
    // res.status(401).send('Please provide credentials');
    try {
        const result = await db.add_user(john);
        console.log(result);
        res.status(200).send('User added');
    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = {
    test_comms,
    test_insert,
}
