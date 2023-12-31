const express = require('express');
const router = express.Router();

const {addUser} = require('../controllers/registration_controllers');

router.post('/registration', addUser);

module.exports = router;