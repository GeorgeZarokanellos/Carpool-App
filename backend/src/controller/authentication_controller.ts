/**
 * Authentication Controller module.
 * @module controllers/authentication_controller
 */

import User from '../model/user';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// #region passport setup

/**
 * Configures the local strategy for passport authentication.
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @param {function} done - The callback function to be called when authentication is complete.
 * @returns {Promise<void>} - A promise that resolves when authentication is complete.
 */
passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({where: {username}})
            .then(user => {
                if(!user){
                    return done(null, false, {message: "Incorrect username from passport stategy"})
                }
                bcrypt.compare(password,user.getDataValue('password'))
                    .then(passwordsMatch => {
                        if(passwordsMatch)
                            return done(null,user);
                        else 
                            return done(null,false,{message:"passwords don't match"})
                    })
                    .catch(err => {
                        console.log("Error from bcrypt");
                        done(err);
                    });
            })
            .catch(err => {
                console.log("Error from strategy");
                done(err);
            })
    }
));

/**
 * Serializes the user object and stores the user id in the session.
 * @param {object} user - The user object to be serialized.
 * @param {function} done - The callback function to be called when serialization is complete.
 * @returns {void}
 */
passport.serializeUser((user, done) => {
    done(null, user.userId);  // user id is the data to be stored in the session
    
});

/**
 * Deserializes the user id from the session and retrieves the user object.
 * @param {number} userId - The user id retrieved from the session.
 * @param {function} done - The callback function to be called when deserialization is complete.
 * @returns {Promise<void>} - A promise that resolves when deserialization is complete.
 */
passport.deserializeUser(
    (userId, done) => {
        (async () => {
            try {
                console.log('userId: ', userId);
                console.log('typeof userId: ', typeof userId);
                
                
                // if the user refreshes the page, the user id is retrieved from the session and used to find the user
                if(typeof userId === 'number'){
                    const user = await User.findByPk(userId);
                    if(user !== null) {
                        done(null, user);
                    }
                    else {    
                        console.log('User not found');
                        done(null, false);
                    }
                } else 
                    console.log('userId is not a number');
                    
            } catch (error) {
                done(error);
            }
        })().catch(error => {done(error)});
    });
// #endregion
