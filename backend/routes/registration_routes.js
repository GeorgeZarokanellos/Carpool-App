const express = require('express');
const router = express.Router();

const {addUser, findUsernameAndInitializeUpload, addDriverAndVehicle} = require('../controllers/registration_controllers');

router.post('/registration/user', addUser);
router.post('/registration/driver/:id', findUsernameAndInitializeUpload ,addDriverAndVehicle);

module.exports = router;