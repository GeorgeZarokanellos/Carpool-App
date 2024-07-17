// #region import statements
import express, {type Request, type Response, type NextFunction} from 'express';

import dotenv from 'dotenv';
dotenv.config({path: '/home/george/Desktop/Carpool App/backend/env'});
import { env } from './config';

import http, { METHODS } from 'http';
import https from 'https';
import fs from 'fs'; // to read ssl certificate
import bodyParser from 'body-parser';

import passport, { use } from 'passport'; // import passport
import session from 'express-session';
// #endregion

// #region routers
import registration_router from './router/registration_router';
import trip_router from './router/trip_router';
import profile_router from './router/profile_router';
import reviews_router from './router/review_router';
import './controller/authentication_controller';
// #endregion

// #region SSL certificate
// const privateKey = fs.readFileSync(env.SSL_KEY_PATH, 'utf-8');
// const certificate = fs.readFileSync(env.SSL_CERT_PATH, 'utf-8');
// const credentials = {
//     key: privateKey,
//     cert: certificate 
// }
// #endregion

const app = express();
const cors = require('cors');
const basePath = '/api/v1';
app.use(express.static('./methods-public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({
    origin: 'http://localhost:8100',
    // origin: 'http://192.168.1.22:8100',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
    AccessControlAllowCredentials: true,
    // allowedHeaders: 'Content-Type, Authorization'
}));

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // to allow cookies over http
        maxAge: 1000 * 60 * 60 * 24 //1 hour
    }
}));

app.use(passport.initialize()); 
app.use(passport.session());// to use persistent login session

// #region middleware
app.post(`${basePath}/login`, passport.authenticate('local'), (req,res) => {
    // console.log('Im in login');
    // console.log(req.isAuthenticated());
    
    if(req.isAuthenticated()){
        req.session.save(); 
        res.status(200).json({message: 'Login successful', userId: req.user.userId, role: req.user.role });
    }
    else 
        res.status(401).send('Login failed');
});
app.use(`${basePath}/registration`, registration_router);

//middleware to check if user is authenticated
app.use((req, res, next) => {
    console.log(req.path !== `${basePath}/registration`);
    console.log(req.isAuthenticated());
    // console.log(req.session);
    
    if(req.path !== `${basePath}/registration` && req.isAuthenticated())
        next();
    else {
        console.log('failed to authenticate from index');
        res.status(401).send('Failed to authenticate');
    }
});

app.use(`${basePath}/trips`, trip_router);
app.use(`${basePath}/profile`, profile_router);
app.use(`${basePath}/reviews`, reviews_router);

// app.get('/', (req:Request,res:Response) => {
//     res.status(200).send('Home Page');
// })

// app.use((req:Request, res:Response, next:NextFunction) => {
//     if(!req.secure){
//         res.redirect('https://' + req.headers.host + req.url); return;
//         // req.headers.host is the domain name(localhost:5000) and req.url is the path(${basePath}registration)
//     }
//     next();
// });
// #endregion


// create https server with express js
// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(5000, () => {
//     console.log('HTTPS Server running on port 5000');  
// });

// #region redirect to https server

// Create http server to redirect to https server for users that type in http://localhost:3000
// const httpApp = express();
// httpApp.get('*', (req:Request,res:Response) => {
//     res.redirect('https://' + req.headers.host + req.url);
// });

const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// #endregion