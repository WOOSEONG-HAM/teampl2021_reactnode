const KakaoStrategy = require('passport-kakao').Strategy;

const { USER } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: 'http://localhost:5000/api/users/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await USER.find({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        console.log('sns 이미 가입한 계정일 경우');
        done(null, exUser);
      } else {
          console.log('sns 로그인 성공', profile);
        const newUser = await USER.create({
          email: profile._json && profile._json.kaccount_email,
          name: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};