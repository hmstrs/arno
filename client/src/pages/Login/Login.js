import React, { useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import NavLink from '../../components/NavLink/NavLink';
import TextInput from '../../components/TextInput/TextInput';
import getDiffpx from '../../tools/getDiffpx';

import './Login.css';

import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const LOGIN_USER = gql`
  query login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
    }
  }
`;

const Login = props => {
  const formSize = {
    width: 295,
    height: 325
  };
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const inputWidth = 0.8 * formSize.width;
  const [loginUser] = useLazyQuery(LOGIN_USER, {
    onCompleted: data => {
      if (data) {
        const { token } = data.login;
        localStorage.setItem('token', token);
        window.location.reload(false);
      }
    },
    onError: err => {
      if (err.graphQLErrors.length > 0) {
        const { code, errors } = err.graphQLErrors[0].extensions;
        code === 'BAD_USER_INPUT' && setErrors(errors);
      } else setErrors({ ...errors, password: err.networkError.message });
    }
  });

  const loginUserHelper = async () => {
    await loginUser({
      variables: inputs
    });
  };
  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmit = () => {
    loginUserHelper();
  };

  return (
    <div className="Login">
      <div>
        <form onSubmit={onSubmit}>
          <div
            style={{
              height: `${formSize.height}px`,
              width: `${formSize.width}px`
            }}
            className="form-group mx-auto"
          >
            <Row>
              <Col>
                <TextInput
                  style={{
                    marginTop: '60px'
                  }}
                  className="mx-auto"
                  error={errors.email}
                  type="email"
                  name="email"
                  placeholder="Эл. Почта"
                  value={inputs.email}
                  onChange={onChange}
                />
                <TextInput
                  style={{
                    marginTop: `${getDiffpx(errors.email, 40)}px`
                  }}
                  className="mx-auto"
                  error={errors.password}
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={inputs.password}
                  onChange={onChange}
                />
              </Col>
            </Row>
            <Row
              style={{
                width: `${inputWidth}px`,
                marginTop: `${getDiffpx(errors.password, 40)}px`
              }}
              className="mx-auto"
            >
              <Col
                style={{
                  width: `${inputWidth / 2}px`
                }}
                className="px-0"
              >
                <NavLink
                  style={{
                    marginTop: '-7px'
                  }}
                  to="/restore-password"
                >
                  <span className="button-text text-restore">
                    Восстановить <br /> пароль
                  </span>
                </NavLink>
              </Col>
              <Button
                onClick={onSubmit}
                variant="link"
                size="lg"
                className="button-login"
              >
                <span className="button-text text-login">Войти</span>
              </Button>
            </Row>
          </div>
        </form>
      </div>
      <div>
        <p className="button-text text-no-acc">Нет аккаунта?</p>
        <NavLink
          style={{
            width: `${formSize.width}px`
          }}
          className="button-register"
          to="/register"
        >
          <span className="button-text text-register">Зарегистрироваться</span>
        </NavLink>
      </div>
    </div>
  );
};
export default Login;
