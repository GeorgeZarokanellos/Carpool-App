// #region import statements
import express, {type Request, type Response, type NextFunction} from 'express';

import { env } from './config';

import http from 'http';
import https from 'https';
import fs from 'fs'; // to read ssl certificate
import bodyParser from 'body-parser';

import passport from 'passport'; // import passport
import session from 'express-session';
// #endregion



// #region routers
import registration_router from './routers/registration_router';
import trip_router from './routers/trip_router';
import authentication_router from './routers/authentication_router';
import profile_router from './routers/profile_router';
import reviews_router from './routers/reviews_router';

// #endregion

// #region SSL certificate
const privateKey = fs.readFileSync(env.SSL_KEY_PATH, 'utf-8');
const certificate = fs.readFileSync(env.SSL_CERT_PATH, 'utf-8');
const credentials = {
    key: privateKey,
    cert: certificate 
}
// #endregion
const app = express();
app.use(express.static('./methods-public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize()); 
app.use(passport.session());// to use persistent login sessions

// #region middleware
const basePath = '/api/v1';
app.use(`${basePath}/registration`, registration_router);
app.use(`${basePath}/trips`, trip_router);
app.use(`${basePath}/authenticate`, authentication_router);
app.use(`${basePath}/profile`, profile_router);
app.use(`${basePath}/reviews`, reviews_router);

app.get('/', (req:Request,res:Response) => {
    res.status(200).send('Home Page');
})

app.use((req:Request, res:Response, next:NextFunction) => {
    if(!req.secure){
        res.redirect('https://' + req.headers.host + req.url); return;
        // req.headers.host is the domain name(localhost:5000) and req.url is the path(${basePath}registration)
    }
    next();
});
// #endregion


// create https server with express js
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(5000, () => {
    console.log('HTTPS Server running on port 5000');  
});

// #region redirect to https server

// Create http server to redirect to https server for users that type in http://localhost:3000
const httpApp = express();
httpApp.get('*', (req:Request,res:Response) => {
    res.redirect('https://' + req.headers.host + req.url);
});

const httpServer = http.createServer(httpApp);
httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

// #endregion