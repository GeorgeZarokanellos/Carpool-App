const db = require('../database/db');

const display_trips = async (req,res) => {
    try {
        const result = await db.retrieve_trips();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    display_trips,
}