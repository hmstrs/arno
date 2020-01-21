import React, { useState } from 'react';
import NavLink from '../../components/NavLink/NavLink';
import { Container, Col, Row, Button } from 'react-bootstrap';
import './Register.css';

const Register = props => {
  const formSize = {
    width: 295,
    height: 390
  };
  const RegisterSize = {
    height: 510
  };
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: ''
  });
  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmit = () => alert('submit');
  return (
    <div className="Register">
      <Container
        style={{
          height: `${RegisterSize.height}px`
        }}
        fluid={true}
      >
        <Row>
          <Col lg={8} className="mx-auto">
            <form onSubmit={onSubmit}>
              <div
                style={{
                  height: `${formSize.height}px`,
                  width: `${formSize.width}px`,
                  marginTop: `calc(50vh - ${RegisterSize.height / 2}px)`
                }}
                className="form-group mx-auto"
              >
                <Row>
                  <Col>
                    <input
                      style={{
                        marginTop: '40px'
                      }}
                      className="form-control form-text mx-auto"
                      type="text"
                      name="name"
                      placeholder="Имя пользователя"
                      value={inputs.name}
                      onChange={onChange}
                    />
                    <input
                      style={{
                        marginTop: '40px'
                      }}
                      className="form-control form-text mx-auto"
                      type="email"
                      name="email"
                      placeholder="Эл. Почта"
                      value={inputs.email}
                      onChange={onChange}
                    />
                    <input
                      style={{
                        marginTop: '40px'
                      }}
                      className="form-control form-text mx-auto"
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
                    marginTop: '40px'
                  }}
                >
                  <Col>
                    <Button
                      onClick={onSubmit}
                      variant="link"
                      className="button button-login"
                    >
                      <span className="button-text text-login">
                        Зарегистрироваться
                      </span>
                    </Button>
                  </Col>
                </Row>
              </div>
            </form>
          </Col>
        </Row>
        <Row
          className="mx-auto"
          style={{
            width: `${formSize.width}px`
          }}
        >
          <Col className="px-0">
            <p className="mt-3 button-text text-no-acc">Уже есть аккаунт?</p>
          </Col>
          <Col className="px-0">
            <NavLink
              style={{
                width: `${formSize.width / 2}px`
              }}
              className="button-register"
              to="/login"
            >
              <span className="button-text text-register">Войти</span>
            </NavLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
