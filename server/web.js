const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const db = require('./models');
db.sequelize.sync();


app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  saveUninitialized : true, resave : true, secret : process.env.COOKIE_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', require('./routes/users'));
app.use('/uploads', express.static('uploads'));

// require('greenlock-express').init({
//   packageRoot: __dirname,
//   configDir: './greenlock.d',
//   maintainerEmail: 'wooseongham@gmail.com',
// })

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});