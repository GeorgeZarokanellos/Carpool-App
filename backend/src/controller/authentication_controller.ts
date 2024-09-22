
import User from '../model/user';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// #region passport setup

interface SessionData {
    userId: number;
    role: role;
}

let sessionDetails: SessionData;

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log('username: ', username);
        console.log('password: ', password);
        
        try {
            const user = await User.findOne({where: {username}});
            if(!user){
                console.log('Incorrect username!');
                return done(null, false , {message: 'Incorrect username'});
            }
            const passwordsMatch = await bcrypt.compare(password, user.getDataValue('password'));
            if(!passwordsMatch){
                console.log('Incorrect password!');
                return done(null, false, {message: 'Incorrect password'});
            }
            console.log('Login successful');
            return done(null, user);
        } catch (error) {
            console.log('Error from passport strategy');
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    console.log((user));
    
    sessionDetails = {
        userId: user.userId,
        role: user.role
    }
    done(null, sessionDetails);  // userSessionDetails is the data to be stored in the session
    
});

passport.deserializeUser(
    async (sessionDetails: SessionData, done) => {
            try {
                console.log('Session data: ',  sessionDetails);
                const userId  = sessionDetails.userId;
                // if the user refreshes the page, the user id is retrieved from the session and used to find the user
                if(typeof userId === 'number'){
                    const user = await User.findByPk(userId);
                    if(user !== null) {
                        console.log('User found');
                        return done(null, user);
                    }
                    else {    
                        console.log('User not found');
                        return done(null, false);
                    }
                } else 
                    console.log('userId is not a number');
                    
            } catch (error) {
                console.log('Error from deserializeUser');
                return done(error);
            }
        });
// #endregion
