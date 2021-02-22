// const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { USER } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { 
        done(null, user.email); 
    }); 
    passport.deserializeUser((email, done) => {
        USER.findOne({ where: { email }}) 
    .then(user => done(null, user)) 
    .catch(err => done(err)); 
    });

    kakao(passport);
};