const express = require('express');
const app = express();
const registration_router = require('./routes/registration_routes');
// const trip_router = require('./routes/trip_router');

app.use(express.static('./methods-public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1', registration_router);
// app.use('/api/v1/trips', trip_router);

app.get('/', (req,res) => {
    res.status(200).send('Home Page');
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})