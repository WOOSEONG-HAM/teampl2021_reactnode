import axios from 'axios';

export const reSendEmailAPI = function (option, callback) {
  console.log('이메일 재전송 옵션', option);
  axios({
    method: 'post',
    url: `http://localhost:5000/api/users/sendEmail`,
    data: option,
  })
    .then(function (response) {
      console.log('이메일 재전송 결과: ', response);
      callback(response.data);
    })
    .catch(err => {
    console.log("🚀 ~ file: userAPI.js ~ line 15 ~ emailCheckAPI ~ err", err)
      callback(err);
    });
};

export const emailCheckAPI = function (option, callback) {
  console.log('🚀이메일인증 옵션', option);
  axios({
    method: 'post',
    url: `http://localhost:5000/api/users/emailCheck`,
    data: option,
  })
    .then(function (response) {
      console.log('이메일인증: ', response);
      callback(response.data);
    })
    .catch(err => {
    console.log("🚀 ~ file: userAPI.js ~ line 15 ~ emailCheckAPI ~ err", err)
      callback(err);
    });
};

export const kakaoLogin = function (option, callback) {
  console.log('🚀카카오 로그인 옵션', option);
  axios({
    method: 'post',
    url: `http://localhost:5000/api/users/kakao`,
    data: option
  })
    .then(function (response) {
      console.log('카카오 로그인 결과: ', response);
      callback(response.data);
    })
    .catch(err => {
    console.log("🚀 카카오 에러", err)
    });
};