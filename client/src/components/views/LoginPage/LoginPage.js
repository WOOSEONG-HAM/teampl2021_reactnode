import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Checkbox, Typography, message } from 'antd';
import { useDispatch } from "react-redux";
import './LoginPage.css';
import { kakaoLogin } from '../../../api/userAPI';
import AppleLogin from 'react-apple-login'
import KaKaoLogin from 'react-kakao-login';

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  const responseKaKao = (res) => {
    let option = {
      snsId: String(res.profile.id),
      email: res.profile.kakao_account.email ? res.profile.kakao_account.email : '',
      name: res.profile.properties.nickname,
    }

    kakaoLogin(option, function(response){
      if(response.loginSuccess){
        window.localStorage.setItem('email', response.userId);
        window.sessionStorage.setItem('token', response.token);
        props.history.push("/");
      }
    });
  };

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('이메일형식이 불일치합니다.')
          .required('이메일을 입력해주세요.'),
        password: Yup.string()
          .min(6, '6자리 이상입력해주세요.')
          .required('비밀번호를 입력해주세요.'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess && response.payload.emailCheck) {
                message.success('로그인에 성공하였습니다.');
                window.localStorage.setItem('email', response.payload.email);
                window.sessionStorage.setItem('token', response.payload.token);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.email);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");
              } else if(response.payload.loginSuccess && !response.payload.emailCheck) {
                props.history.push({
                  pathname: "/emailCheck",
                  state: {email: response.payload.email}
                });
              } else if(!response.payload.emailCheck && response.payload.code === '401'){
                message.warning('인증되지 않은 이메일입니다. 이메일 인증을 진행해주세요.');
                props.history.push({
                  pathname: "/emailCheck",
                  state: {email: response.payload.email}
                });
              } else {
                setFormErrorMessage('이메일 및 비밀번호를 다시 확인해주세요.');
              }
            })
            .catch(err => {
              setFormErrorMessage('이메일 및 비밀번호를 다시 확인해주세요.');
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">

            <Title level={2}>로그인</Title>
            <form onSubmit={handleSubmit} style={{ width: '350px' }}>

              <Form.Item required>
                <Input
                  id="email"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="이메일을 입력해주세요."
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required>
                <Input
                  id="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="비밀번호를 입력해주세요."
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              {formErrorMessage && (
                <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
              )}

              <Form.Item>
                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >아이디 저장</Checkbox>
                <a className="login-form-forgot" href="/reset_user" style={{ float: 'right' }}>
                  비밀번호 찾기
                  </a>
                <div>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%', height: '46px' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                    로그인
                  </Button>
                </div>
                {/* <div onClick={kakaoLoginCall} >
                  <img src="./img/logo/kakao.png" style={{marginTop: '10px', width:'100%', height:'46px', cursor:'pointer'}}/>
                </div> */}
                <KaKaoLogin jsKey={'7578f064e9e8b2ef07713c0465a566e0'} buttonText='카카오 계정으로 로그인' onSuccess={responseKaKao} getProfile={true} style={{marginTop: '10px', width:'100%', backgroundColor:'#FEE500', border: '1px solid #FEE500', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}/>
                <div>
                  <a id="apple-login-btn"><img src="./img/logo/logo.svg"/>Apple 로그인</a>
                </div>
                <AppleLogin clientId="com.study.reactnode" redirectURI="http://teampartner.cafe24app.com" designProp={{width:350, height:46}} />
                아직 회원이 아니라면 <a href="/register">회원가입</a>
              </Form.Item>
            </form>
          </div>
        );
      }}
    </Formik>
  );
};

export default withRouter(LoginPage);


