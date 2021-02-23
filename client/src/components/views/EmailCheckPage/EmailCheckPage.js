import React, { useState } from 'react';
import { useLocation } from "react-router";
import { Button, message } from 'antd';
import './EmailCheckPage.css';

import { emailCheckAPI, reSendEmailAPI } from '../../../api/userAPI';

function EmailCheck(props){
  const location = useLocation();
  const email = location.state.email;
  const [code, setCode] = useState('');

  const onChange = (e) => {
    setCode(e.target.value);
  };

  const onClick = () => {
    let option = {
      email,
      code
    };
    emailCheckAPI(option, function(res){
      if(res.success === "SUCCESS"){
        message.success('회원가입이 완료되었습니다.');
        props.history.push('/login');
      }
    })
  };

  const reSendEmail = () => {
    let option = {
      email
    };
    reSendEmailAPI(option, function(res){
      console.log('이메일 재전송 결과', res);
    });
  }

  return(
    <>
      <div id="emailCheck-container">
        <div id="emailCheck-box">
          <div id="emailCheck-top">
            <h2 id="emailCheck-title">이메일 인증</h2>
            <p id="emailCheck-sub-title">이메일 인증을 위해 다음 인증을 완료해주시기 바랍니다.</p>
          </div>
          <div id="emailCheck-code-box">
            <p>이메일 인증 코드</p>
            <div>
              <input type="text" id="emailCheck-code-input" onChange={onChange}/>
              <Button id="emailCheck-resend-btn" size={'large'} onClick={reSendEmail}>코드 재전송</Button>
            </div>
            <div id="emailCheck-codeM-box">
              <p>{email}로 전송된 6자리 코드를 입력해주세요.</p>
            </div>
          </div>
          <div id="emailCheck-footer">
            <Button type="primary" id="emailCheck-sign-btn" size={'large'} onClick={onClick}>인증하기</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailCheck;