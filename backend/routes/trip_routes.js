const express = require('express');
const router = express.Router();

const {display_trips} = require('../controllers/trip_controllers');

router.get('/trips', display_trips);

module.exports = router;