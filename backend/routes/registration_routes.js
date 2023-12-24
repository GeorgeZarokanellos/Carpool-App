const express = require('express');
const router = express.Router();

const {test} = require('../controllers/registration_controllers');

router.post('/registration', test);

module.exports = router;