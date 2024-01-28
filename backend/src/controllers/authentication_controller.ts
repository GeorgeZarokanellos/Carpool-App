import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';

//#region passport setup
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user: User | null = await User.findOne({where: {username: username}});
            if(!user)
                return done(null, false, {message: 'Incorrect username'});
            const userPassword: string =  user.getDataValue('password');    //retrieves the user's password from the database
            const validPassword: boolean = await bcrypt.compare(password, userPassword);
            if(!validPassword)
                return done(null, false, {message: 'Incorrect password'});
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.userId);  //user id is the data to be stored in the session
});

passport.deserializeUser(async (userId, done) => {
    try {
        //if the user refreshes the page, the user id is retrieved from the session and used to find the user
        if(typeof userId === 'number'){
            const user = await User.findByPk(userId);
            done(null, user);
        }
    } catch (error) {
        done(error);
    }
});
//#endregion

const displayLogin = async (req:Request,res:Response) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
}

export default {
    displayLogin
}