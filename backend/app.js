//#region require statements
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');   //to read ssl certificate
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session'); //enables the user stay logged in even after refreshing the page
//#endregion

//#region SSL certificate
const private_key = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf-8');
const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf-8');
const credentials = {
    key: private_key,
    cert: certificate 
}
//#endregion



//#region routers
const registration_router = require('./routes/registration_routes');
const trip_router = require('./routes/trip_routes');
const authentication_router = require('./routes/authentication_router');
//#endregion
app.use(express.static('./methods-public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize()); 
app.use(passport.session());//to use persistent login sessions

//#region middleware
app.use('/api/v1', registration_router);
app.use('/api/v1', trip_router);
app.use('/api/v1', authentication_router);

app.get('/', (req,res) => {
    res.status(200).send('Home Page');
})

app.use((req,res,next) => {
    if(!req.secure){
        return res.redirect('https://' + req.headers.host + req.url);
        //req.headers.host is the domain name(localhost:5000) and req.url is the path(/api/v1/registration)
    }
    next();
});
//#endregion


//create https server with express js
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(5000, () => {
    console.log('HTTPS Server running on port 5000');  
});

//#region redirect to https server

//Create http server to redirect to https server for users that type in http://localhost:3000
const httpApp = express();
httpApp.get('*', (req,res) => {
    res.redirect('https://' + req.headers.host + req.url);
});

const httpServer = http.createServer(httpApp);
httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
});

//#endregion