const express = require('express');
const router = express.Router();
const { USER } = require("../models");
const bcrypt = require('bcrypt');
const { smtpTransport } = require('../config/email');
const jwt = require('jsonwebtoken');
const { auth } = require("../middleware/auth");

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

            const ranStr = Math.random().toString(36).substr(5, 10);
        
            const mailOptions = {
                from: process.env.USER,
                to: email,
                subject: '[관리자 가입] 이메일 인증 입니다.]',
                text: `이메일 코드는 우측에 있습니다. [${ranStr}]`,
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
            console.log('성공')
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
        console.log('실패2');
        return res.status(200).json({
            loginSuccess: false,
            message: "passwordError"
        });
});

// router.get("/logout", auth, (req, res) => {
//     User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).send({
//             success: true
//         });
//     });
// });


// router.get('/addToCart', auth, (req, res) => {

//     User.findOne({ _id: req.user._id }, (err, userInfo) => {
//         let duplicate = false;

//         console.log(userInfo)

//         userInfo.cart.forEach((item) => {
//             if (item.id == req.query.productId) {
//                 duplicate = true;
//             }
//         })


//         if (duplicate) {
//             User.findOneAndUpdate(
//                 { _id: req.user._id, "cart.id": req.query.productId },
//                 { $inc: { "cart.$.quantity": 1 } },
//                 { new: true },
//                 (err, userInfo) => {
//                     if (err) return res.json({ success: false, err });
//                     res.status(200).json(userInfo.cart)
//                 }
//             )
//         } else {
//             User.findOneAndUpdate(
//                 { _id: req.user._id },
//                 {
//                     $push: {
//                         cart: {
//                             id: req.query.productId,
//                             quantity: 1,
//                             date: Date.now()
//                         }
//                     }
//                 },
//                 { new: true },
//                 (err, userInfo) => {
//                     if (err) return res.json({ success: false, err });
//                     res.status(200).json(userInfo.cart)
//                 }
//             )
//         }
//     })
// });


// router.get('/removeFromCart', auth, (req, res) => {

//     User.findOneAndUpdate(
//         { _id: req.user._id },
//         {
//             "$pull":
//                 { "cart": { "id": req.query._id } }
//         },
//         { new: true },
//         (err, userInfo) => {
//             let cart = userInfo.cart;
//             let array = cart.map(item => {
//                 return item.id
//             })

//             Product.find({ '_id': { $in: array } })
//                 .populate('writer')
//                 .exec((err, cartDetail) => {
//                     return res.status(200).json({
//                         cartDetail,
//                         cart
//                     })
//                 })
//         }
//     )
// })


// router.get('/userCartInfo', auth, (req, res) => {
//     User.findOne(
//         { _id: req.user._id },
//         (err, userInfo) => {
//             let cart = userInfo.cart;
//             let array = cart.map(item => {
//                 return item.id
//             })


//             Product.find({ '_id': { $in: array } })
//                 .populate('writer')
//                 .exec((err, cartDetail) => {
//                     if (err) return res.status(400).send(err);
//                     return res.status(200).json({ success: true, cartDetail, cart })
//                 })

//         }
//     )
// })




// router.post('/successBuy', auth, (req, res) => {
//     let history = [];
//     let transactionData = {};

//     //1.Put brief Payment Information inside User Collection 
//     req.body.cartDetail.forEach((item) => {
//         history.push({
//             dateOfPurchase: Date.now(),
//             name: item.title,
//             id: item._id,
//             price: item.price,
//             quantity: item.quantity,
//             paymentId: req.body.paymentData.paymentID
//         })
//     })

//     //2.Put Payment Information that come from Paypal into Payment Collection 
//     transactionData.user = {
//         id: req.user._id,
//         name: req.user.name,
//         lastname: req.user.lastname,
//         email: req.user.email
//     }

//     transactionData.data = req.body.paymentData;
//     transactionData.product = history


//     User.findOneAndUpdate(
//         { _id: req.user._id },
//         { $push: { history: history }, $set: { cart: [] } },
//         { new: true },
//         (err, user) => {
//             if (err) return res.json({ success: false, err });


//             const payment = new Payment(transactionData)
//             payment.save((err, doc) => {
//                 if (err) return res.json({ success: false, err });

//                 //3. Increase the amount of number for the sold information 

//                 //first We need to know how many product were sold in this transaction for 
//                 // each of products

//                 let products = [];
//                 doc.product.forEach(item => {
//                     products.push({ id: item.id, quantity: item.quantity })
//                 })

//                 // first Item    quantity 2
//                 // second Item  quantity 3

//                 async.eachSeries(products, (item, callback) => {
//                     Product.update(
//                         { _id: item.id },
//                         {
//                             $inc: {
//                                 "sold": item.quantity
//                             }
//                         },
//                         { new: false },
//                         callback
//                     )
//                 }, (err) => {
//                     if (err) return res.json({ success: false, err })
//                     res.status(200).json({
//                         success: true,
//                         cart: user.cart,
//                         cartDetail: []
//                     })
//                 })

//             })
//         }
//     )
// })


// router.get('/getHistory', auth, (req, res) => {
//     User.findOne(
//         { _id: req.user._id },
//         (err, doc) => {
//             let history = doc.history;
//             if (err) return res.status(400).send(err)
//             return res.status(200).json({ success: true, history })
//         }
//     )
// })

module.exports = router;
