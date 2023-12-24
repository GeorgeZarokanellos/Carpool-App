const express = require('express');
const app = express();
const registration_router = require('./routes/registration_routes');
require('dotenv').config();
// const trip_router = require('./routes/trip_router');

app.use(express.static('./methods-public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.PORT
})

app.use('/api/v1', registration_router);
// app.use('/api/v1/trips', trip_router);

app.get('/', (req,res) => {
    res.status(200).send('Home Page');
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})