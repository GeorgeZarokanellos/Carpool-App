const express = require('express');
const router = express.Router();

const {test_comms, user_insert} = require('../controllers/registration_controllers');

router.get('/registration', test_comms);    

router.post('/registration', user_insert);

module.exports = router;