const express = require('express');
const router = express.Router();

const {test_comms, add_user} = require('../controllers/registration_controllers');

router.get('/registration', test_comms);    

router.post('/registration', add_user);

module.exports = router;