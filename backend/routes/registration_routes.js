const express = require('express');
const router = express.Router();

const {testComms, addUser} = require('../controllers/registration_controllers');

router.get('/registration', testComms);    

router.post('/registration', addUser);

module.exports = router;