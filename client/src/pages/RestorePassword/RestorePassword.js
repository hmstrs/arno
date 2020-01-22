import React, { useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import NavLink from '../../components/NavLink/NavLink';
import TextInput from '../../components/TextInput/TextInput';
import getDiffpx from '../../tools/getDiffpx';

import './RestorePassword.css';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const RECOVER_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

const RestorePassword = props => {
  const formSize = {
    width: 295,
    height: 207
  };
  const RestorePasswordSize = {
    height: 285
  };
  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    email: ''
  });
  const [recoverPassword] = useMutation(RECOVER_PASSWORD);

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmit = () => {
    recoverPassword({
      variables: inputs
    })
      .then(res => {
        console.log('res', res);
        props.history.push('/login');
      })
      .catch(err => {
        if (err.graphQLErrors.length > 0) {
          const { code, errors } = err.graphQLErrors[0].extensions;
          code === 'BAD_USER_INPUT' && setErrors(errors);
        } else setErrors({ ...errors, email: err.networkError.message });
      });
  };

  return (
    <div className="RestorePassword">
      <Container fluid={true}>
        <Row>
          <Col lg={8} className="mx-auto">
            <form onSubmit={onSubmit}>
              <div
                style={{
                  height: `${formSize.height}px`,
                  width: `${formSize.width}px`,
                  marginTop: `calc(50vh - ${RestorePasswordSize.height / 2}px)`
                }}
                className="form-group mx-auto"
              >
                <Row>
                  <Col>
                    <TextInput
                      style={{
                        marginTop: '34px'
                      }}
                      className="mx-auto"
                      type="email"
                      name="email"
                      error={errors.email}
                      placeholder="Эл. Почта"
                      value={inputs.email}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
                <Row
                  style={{
                    marginTop: `${getDiffpx(errors.email, 40)}px`
                  }}
                >
                  <Col>
                    <Button
                      onClick={onSubmit}
                      variant="link"
                      size="lg"
                      className="button-login"
                    >
                      <span className="button-text text-new-pass">
                        Отправить новый пароль
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
            <p className="mt-3 button-text text-have-acc">Вспомнили пароль?</p>
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
export default RestorePassword;
