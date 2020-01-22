import React from 'react';
import { Col, Button } from 'react-bootstrap';
import Navlink from '../../components/NavLink/NavLink';
import jwt_decode from 'jwt-decode';
import logout from '../../assets/icon-logout.svg';
import './Profile.css';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const Profile = props => {
  //while not provided api query
  const user = {
    name: 'st_tikhon',
    games: {
      count: 16
    }
  };
  const onSubmit = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  const token = localStorage.getItem('token');
  const id = jwt_decode(token);

  return (
    <div className="Profile">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">Profile</div>
        </Col>
        <Col>
          <Button
            onClick={onSubmit}
            variant="link"
            className="px-0 float-right"
          >
            <img src={logout} alt="" />
          </Button>
        </Col>
      </Col>
      <Col xs={12} sm={{ span: 10, offset: 1 }}>
        <div className="avatar-block">
          <div className="avatar mx-auto">
            <img
              src={`https://avatars.dicebear.com/v2/human/${user.name}.svg`}
              alt=""
            />
          </div>
          <div className="text user-name">{user.name}</div>
        </div>
      </Col>
      <Col xs={12} sm={{ span: 10, offset: 1 }}>
        <div className="game-block">
          <div className="card mx-auto">
            <Navlink className="card-link" to="/history">
              <div className="text">
                <span className="history">{user.games.count}</span>
                <br />
                <span className="sub-text">games</span>
              </div>
            </Navlink>
          </div>
          <div
            style={{
              marginTop: '49px'
            }}
            className="card mx-auto"
          >
            <Navlink className="card-link" to="/favourites">
              <div className="text">
                <span className="history">{user.games.count}</span>
                <br />
                <span className="sub-text">favourites</span>
              </div>
            </Navlink>
          </div>
        </div>
      </Col>
    </div>
  );
};
export default Profile;
