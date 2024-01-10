const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth_controller = require('../controllers/authentication_controller');


router.post('/login', passport.authenticate('local', {failureRedirect: '/api/v1/login-failure', successRedirect: '/api/v1/login-success'}));

router.get('/login', auth_controller.displayLogin);

router.get('/login-success', (req,res) => {
    res.status(200).send('Login successful');
});

router.get('/login-failure', (req,res) => {
    res.status(400).send('Login failed');
});

module.exports = router;