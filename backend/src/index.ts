// #region import statements
import express, {type Request, type Response, type NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config({path: '/home/george/Desktop/Carpool-App/backend/env'});
import {env} from './config'
import http from 'http';
import bodyParser from 'body-parser';
import passport from 'passport'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import path from 'path';
import User from './model/user';
import { StrategyOptions } from 'passport-jwt';
import registration_router from './router/registration_router';
import trip_router from './router/trip_router';
import profile_router from './router/profile_router';
import stop_router from './router/stop_router';
import review_router from './router/review_router';
import notification_router from './router/notification_router';
import user_router from './router/user_router';
import driver_router  from './router/driver_router';
// #endregion

const app = express();
const cors = require('cors');
const basePath = '/api/v1';

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var option: StrategyOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
    algorithms: ['HS256']
};

app.use('/static/uploads', express.static(path.join(__dirname, '../static/uploads')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({
    // origin: 'http://localhost:8100',
    // origin: 'http://node91.imslab.gr:3080/api/',
    origin: 'http://192.168.1.3:8100',
    credentials: true,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    AccessControlAllowCredentials: true,
    allowedHeaders: 'Content-Type, Authorization'
}));

const generateToken = (user: {userId: number, role: string, username: string}) => {
    const payload = {
        userId: user.userId,
        role: user.role,
        username: user.username
    };
    return jwt.sign(payload, env.JWT_SECRET, {expiresIn: '1h'});
};

passport.use(new JwtStrategy(option, async (payload: {userId: number}, done: any) => {
    await User.findOne({where: {userId: payload.userId}})
    .then(user => {
        if(user)
            return done(null, user, {message: 'User found'});
        else 
            return done(null, false, {message: 'User not found'});
    })
    .catch(err => {
        return done(err, false, {message: 'Error from passport jwt strategy'});
    })
}));

const authenticateJWT = passport.authenticate('jwt', {session: false});

app.use(passport.initialize()); 

// #region middleware
app.post(`${basePath}/login`, async (req,res) => {
    const {username, password} = req.body;
    console.log("Im in login");
    
    try {
        const user = await User.findOne({where: {username}});
        if(user === null){
            console.log('Incorrect username!');
            res.status(401).send('Incorrect username');
        } else {
            const passwordsMatch = await bcrypt.compare(password, user.getDataValue('password'));
            if(!passwordsMatch){
                console.log('Incorrect password!');
                res.status(401).send('Incorrect password');
            }
            //generate token and send it to the client
            const token = generateToken({
                userId: user.userId,
                role: user.role,
                username: user.username
            });

            return res.status(200).json({
                message: 'Login successful',
                token,
                userId: user.userId,
                role: user.role,
                username: user.username
            });
            
        }
    } catch (error) {
        return res.status(500).json({message: 'Error from login'});
    }
});
app.use(`${basePath}/registration`, registration_router);

//middleware to check if user is authenticated
app.use((req, res, next) => {
    
    if(req.path === `${basePath}/registration` || req.path === `${basePath}/login` ){
        console.log('Registration or login');
        next();
    }
    else {
        console.log('Need to authenticate');
        return authenticateJWT(req, res, next);
    }
});

app.use(`${basePath}/trips`, trip_router);
app.use(`${basePath}/profile`, profile_router);
app.use(`${basePath}/reviews`, review_router);
app.use(`${basePath}/stops`, stop_router);
app.use(`${basePath}/notifications`, notification_router);
app.use(`${basePath}/user`, user_router);
app.use(`${basePath}/driver`, driver_router);

const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// #endregion