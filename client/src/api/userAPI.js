import axios from 'axios';

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