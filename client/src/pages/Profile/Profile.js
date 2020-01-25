import React, { useState, useEffect, Fragment } from 'react';
import { Col, Button } from 'react-bootstrap';
import Navlink from '../../components/NavLink/NavLink';
import jwt_decode from 'jwt-decode';
import logout from '../../assets/icon-logout.svg';
import './Profile.css';
import Spinner from '../../components/Spinner/Spinner';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      name
      games {
				win
      }
			favourites {
				title
			}
    }
  }
`;

const Profile = props => {
  const [user, setUser] = useState({
    name: '',
    games: 0,
    favourites: 0
  });

  const getID = () => {
    const token = localStorage.getItem('token');
    const { id } = jwt_decode(token);
    return id;
  };
  const prepareUser = (game, favourites) => ({
    games: game.length,
    favourites: favourites.length,
  });
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      id: getID()
    }
  });

  useEffect(() => {
    if (data) {
      const { name, games, favourites } = data.user;
      setUser({ name, ...prepareUser(games, favourites) });
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const onSubmit = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };

  const MainContent =
    loading || error ? (
      <Spinner />
    ) : (
      <Fragment>
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
                  <span className="history">{user.games}</span>
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
                  <span className="history">{user.favourites}</span>
                  <br />
                  <span className="sub-text">favourites</span>
                </div>
              </Navlink>
            </div>
          </div>
        </Col>
      </Fragment>
    );

  return (
    <div className="Page Profile">
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
      {MainContent}
    </div>
  );
};
export default Profile;
