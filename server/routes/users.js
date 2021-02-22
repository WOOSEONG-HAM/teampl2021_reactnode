const express = require('express');
const router = express.Router();
const { USER } = require("../models");
const bcrypt = require('bcrypt');
const { smtpTransport } = require('../config/email');
const jwt = require('jsonwebtoken');
const { auth } = require("../middleware/auth");
const passport = require('passport');

//=================================
//             User
//=================================

/* 회원가입 API */

router.post('/register', async (req, res, next) => {
    const { password, name, email } = req.body;
    const hash = await bcrypt.hash(password, 12);
  
    try {
        const userCheck = await USER.findOne({ where: { email } });
        if (userCheck) {
            // req.flash('registerError', '이미 존재하는 계정입니다.');
            return res.status(401).json({
                result: 'FAILURE',
                message: '이미 존재하는 회원입니다.',
            });
        } else {

            const ranStr = Math.random().toString(36).substr(7, 10);
            console.log('email', email, process.env.USER);
            const mailOptions = {
                from: process.env.USER,
                to: email,
                subject: '[관리자 가입] 이메일 인증 입니다.]',
                // text: `이메일 코드는 우측에 있습니다. [${ranStr}]`,
                html: `
                <div style="margin: auto; width: 80%; text-align: center;">
                    <h1>${name}님, 안녕하세요!</h1>
                    <p style="color:red">OOO쇼핑몰에 가입해 주셔서 감사합니다.</p>
                    <p>아래 코드를 회원가입 화면에 입력하여 가입을 완료하여 주십시오.</p>
                    <p>아래의 코드가 유효하지 않을 경우, 재발송을 하여 새로운 코드를 입력해 주십시오.</p>
                    <div style="padding: 25px 0; background-color: #eee;">${ranStr}</div>
                    <p>기타 궁금하신 사항이 있으시면 고객센터 전화(02-0000-0000)로 문의해주세요.</p>
                    <p>더욱 좋은 품질과 서비스를 제공하도록 노력하겠습니다.</p>
                </div>
                `
            };
        
             smtpTransport.sendMail(mailOptions, (error, responses) => {
                if (error) {
                res.json({ msg: 'err' });
                } else {
                     USER.create({
                        name,
                        password: hash,
                        email,
                        state: 'stop',
                        code: ranStr,
                    });
                    // return res.redirect('/login');
                    return res.status(200).json({
                        success: 'SUCCESS',
                        message: '임시로 가입정보를 저장하였습니다.',
                        email,
                    });
                }
                smtpTransport.close();
            });
        }
    } catch (error) {
        return next(error);
    }
  });

  
router.post("/emailCheck", async (req, res, next) => {
    
    try {
        const codeCheck = await USER.findOne({ where: { email: req.body.email } });
        if (codeCheck) {
            console.log('2', codeCheck.code);
            if(codeCheck.code === req.body.code){
                return res.status(200).json({
                    success: 'SUCCESS',
                    message: '성공적으로 회원가입 되었습니다.',
                });
            } else {
                req.flash('err', '인증코드가 일치하지 않습니다.');
                return res.status(401).json({
                    result: 'FAILURE',
                    message: '인증코드가 일치하지 않습니다.',
                });
            }
        } else {
            req.flash('err', 'ERROR');
            return res.status(401).json({
                result: 'FAILURE',
                message: '등록된 이메일이 없습니다.',
            });
        }
    } catch (error) {
        return next(error);
    }

});

router.get("/auth", auth, (req, res) => {
    
    return res.status(200).json({
        code: 200,
        message: "토큰인증 성공",
        isAuth: true,
    });
    // res.status(200).json({
    //     _id: req.user._id,
    //     isAdmin: req.user.role === 0 ? false : true,
    //     isAuth: true,
    //     email: req.user.email,
    //     name: req.user.name,
    //     lastname: req.user.lastname,
    //     role: req.user.role,
    //     image: req.user.image,
    //     cart: req.user.cart,
    //     history: req.user.history
    // });
});

router.post("/login", async (req, res) => {

    const emailCheck = await USER.findOne({ where: { email: req.body.email } });
    if (!emailCheck)
        return res.status(200).json({
            loginSuccess: false,
            message: "emailError"
        });

        const result = await bcrypt.compare(req.body.password, emailCheck.password);
        if (result) {
            const token = jwt.sign({
                email: emailCheck.email,
                name: emailCheck.name,
            }, process.env.JWTSECRET, {
                expiresIn: '1m',
                issuer: 'reactnode',
            });
            return res.status(200).json({
                loginSuccess: true,
                message: "success",
                userId: req.body.email,
                token,
            });
        }
        return res.status(200).json({
            loginSuccess: false,
            message: "passwordError"
        });
});

router.get("/logout", auth, (req, res) => {
    return res.status(200).json({
        success: true
    });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
