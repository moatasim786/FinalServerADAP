require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const otps = require('./OTPRoutes');
const userD = require('./userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors')

var conn = mongoose.connection;

const uri = process.env.MONGODB_URI || 'mongodb+srv://autoDappAdmin:Gi14C0GSG7xUAtzf@cluster0.tlqhqho.mongodb.net/?retryWrites=true&w=majority'
//need use before routes
app.options('*', cors());
app.use(cors({origin: true}))

app.use(bodyParser.json());
app.use(otps);
app.use(userD);

mongoose.connect(uri, () => {
    console.log("Connected to Mongoose");
});

// app.use('/', express.static('autoDappUI', { redirect: false }));

const server = app.listen(process.env.PORT || 4000);