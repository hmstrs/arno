import React, { useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import NavLink from '../../components/NavLink/NavLink';
import TextInput from '../../components/TextInput/TextInput';
import './RestorePassword.css';

const RestorePassword = props => {
  const formSize = {
    width: 295,
    height: 207
  };
  const RestorePasswordSize = {
    height: 285
  };
  const [inputs, setInputs] = useState({
    email: ''
  });
  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmit = () => alert('submit');

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
                      placeholder="Эл. Почта"
                      value={inputs.email}
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
