// const db = require('../database/db_connect');
const sequelize = require('../database/connect_to_db');
const Trip = require('../models/trip');

const displayTrips = async (req,res) => {
    try {
        const trips = await Trip.findAll();
        res.status(200).send(trips);
    } catch (error) {
        res.status(500).send('Error retrieving trips:' + error);
    }
}
module.exports = {
    displayTrips,
}