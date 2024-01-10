const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');   
const LocalStrategy = require('passport-local').Strategy;  //strategy for authenticating with a username and password
const path = require('path');

//#region passport setup
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({where: {username: username}});
            if(!user)
                return done(null, false, {message: 'Incorrect username'});
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword)
                return done(null, false, {message: 'Incorrect password'});
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user. userId);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findByPk(userId);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
//#endregion

const displayLogin = async (req,res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
}

module.exports = {
    displayLogin
};