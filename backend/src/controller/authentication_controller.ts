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
        (async () => {
            try {
                const user: User | null = await User.findOne({where: {username}});
                if(user === null) {
                    done(null, false, {message: 'Incorrect username'});
                    return;
                }
                const userPassword: string =  user.getDataValue('password');    // retrieves the user's password from the database
                const validPassword: boolean = await bcrypt.compare(password, userPassword);
                if(!validPassword) {
                    done(null, false, {message: 'Incorrect password'});
                    return;
                }
                done(null, user); 
            } catch (error) {
                done(error); 
            }
        })().catch(error => {done(error)});
    }
));

/**
 * Serializes the user object and stores the user id in the session.
 * @param {object} user - The user object to be serialized.
 * @param {function} done - The callback function to be called when serialization is complete.
 * @returns {void}
 */
passport.serializeUser((user: any, done) => {
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
                // if the user refreshes the page, the user id is retrieved from the session and used to find the user
                if(typeof userId === 'number'){
                    const user = await User.findByPk(userId);
                    done(null, user);
                }
            } catch (error) {
                done(error);
            }
        })().catch(error => {done(error)});
    });
// #endregion

// const displayLogin = (req:Request,res:Response):void => {
//     res.sendFile(path.join(__dirname, '../views/login.html'));
// }

// export default {
//     displayLogin
// }