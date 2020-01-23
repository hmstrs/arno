import React, { useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import NavLink from '../../components/NavLink/NavLink';
import TextInput from '../../components/TextInput/TextInput';
import getDiffpx from '../../tools/getDiffpx';

import './Register.css';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const POST_USER = gql`
  mutation createUser($name: String!, $password: String!, $email: String!) {
    createUser(name: $name, password: $password, email: $email) {
      name
      id
    }
  }
`;

const Register = props => {
  const formSize = {
    width: 295,
    height: 389
  };
  const RegisterSize = {
    height: 510
  };
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: ''
  });
  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const [postUser] = useMutation(POST_USER);
  const onSubmit = () => {
    postUser({
      variables: inputs
    })
      .then(res => {
        // console.log('res', res);
        props.history.push('/login');
      })
      .catch(err => {
        // console.log(err);
        if (err.graphQLErrors.length > 0) {
          const { code, errors } = err.graphQLErrors[0].extensions;
          code === 'BAD_USER_INPUT' && setErrors(errors);
        } else setErrors({ ...errors, password: err.networkError.message });
      });
  };

  return (
    <div className="Register">
      <Container fluid={true}>
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
                    <TextInput
                      style={{
                        marginTop: '40px'
                      }}
                      className="mx-auto"
                      type="text"
                      error={errors.name}
                      name="name"
                      placeholder="Имя пользователя"
                      value={inputs.name}
                      onChange={onChange}
                    />

                    <TextInput
                      style={{
                        marginTop: `${getDiffpx(errors.name, 40)}px`
                      }}
                      error={errors.email}
                      className="mx-auto"
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
                    marginTop: `${getDiffpx(errors.password, 30)}px`
                  }}
                >
                  <Col>
                    <Button
                      onClick={onSubmit}
                      variant="link"
                      size="lg"
                      className="button-login"
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
            marginTop: '20px',
            width: `${formSize.width}px`
          }}
        >
          <Col className="px-0">
            <p className="mt-3 button-text text-have-acc">Уже есть аккаунт?</p>
          </Col>
          <Col className="px-0">
            <NavLink
              style={{
                width: `${formSize.width / 2}px`
              }}
              className="button-register"
              to="/login"
            >
              <span className="button-text text-login">Войти</span>
            </NavLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
