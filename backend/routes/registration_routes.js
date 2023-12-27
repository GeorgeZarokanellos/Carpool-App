const express = require('express');
const router = express.Router();

const {test_comms, test_insert} = require('../controllers/registration_controllers');

router.get('/registration', test_comms);    

router.post('/registration', test_insert);

module.exports = router;