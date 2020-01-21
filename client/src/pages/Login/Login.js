import React, { useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import NavLink from '../../components/NavLink/NavLink';
import TextInput from '../../components/TextInput/TextInput';
import './Login.css';

const Login = props => {
  const formSize = {
    width: 295,
    height: 325
  };
  const LoginSize = {
    height: 400
  };
  const inputWidth = 0.8 * formSize.width;
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmit = () => {
    localStorage.setItem('token', 'test');
    window.location.reload(false);
  };

  return (
    <div className="Login">
      <Container fluid={true}>
        <Row>
          <Col lg={8} className="mx-auto">
            <form onSubmit={onSubmit}>
              <div
                style={{
                  height: `${formSize.height}px`,
                  width: `${formSize.width}px`,
                  marginTop: `calc(50vh - ${LoginSize.height / 2}px)`
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
                      type="email"
                      name="email"
                      placeholder="Эл. Почта"
                      value={inputs.email}
                      onChange={onChange}
                    />
                    <TextInput
                      style={{
                        marginTop: '40px'
                      }}
                      className="mx-auto"
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
                    marginTop: '40px'
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
                  <Col>
                    <Button
                      onClick={onSubmit}
                      variant="link"
                      size="lg"
                      className="button-login"
                    >
                      <span className="button-text text-login">Войти</span>
                    </Button>
                  </Col>
                </Row>
              </div>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="button-text text-no-acc">Нет аккаунта?</p>
            <NavLink
              style={{
                width: `${formSize.width}px`
              }}
              className="button-register"
              to="/register"
            >
              <span className="button-text text-register">
                Зарегистрироваться
              </span>
            </NavLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Login;
