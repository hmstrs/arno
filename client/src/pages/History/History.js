import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Col, Spinner, Button } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import gql from 'graphql-tag';

import { FaTrophy } from 'react-icons/fa';

import clear from '../../assets/icon-clear.svg';

import './History.css';

const GET_GAMES = gql`
  query user($id: ID!) {
    user(id: $id) {
      name
      games {
        win
        song {
          _id
          title
          artist
          reference
        }
        tries
      }
    }
  }
`;

const CLEAR_HISTORY = gql`
  mutation {
    clearGameHistory {
      name
    }
  }
`;

const History = () => {
  const [games, setGames] = useState([]);

  const getID = () => {
    const token = localStorage.getItem('token');
    const { id } = jwt_decode(token);
    return id;
  };

  const { loading, error, data } = useQuery(GET_GAMES, {
    variables: { id: getID() }
  });

  useEffect(() => {
    if (data) {
      setGames(data.user.games.reverse());
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const [clearHistory] = useMutation(CLEAR_HISTORY);
  const onSubmit = () => {
    clearHistory()
      .then(() => window.location.reload(false))
      .catch(e => console.log(e));
  };

  const MainContent =
    loading || error ? (
      <Spinner animation="border" />
    ) : !games.length ? (
      <center>
        <p className="fav">
          Хм, мне кажется вы так и не играли с нашим ботом :( <br />
          Сыграйте сейчас :)
        </p>
      </center>
    ) : (
      games.map(({ win, song: { title, artist, _id }, tries }) => (
        <a
          key={Math.random()}
          className="link-to-player"
          href={`/track/${_id}`}
        >
          <div className="card card-history">
            <div className="win">
              <FaTrophy
                style={{
                  color: win ? '#f96900' : '#fff',
                  fontSize: '56px'
                }}
              />{' '}
              tries: {tries}
            </div>
            <div>
              {title}
              <br />
              {win ? `by ${artist}` : ``}
            </div>
          </div>
        </a>
      ))
    );

  return (
    <div className="Page">
      <div className=" History">
        <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
          <Col>
            <div className="text">История</div>
          </Col>
          <Col>
            <Button
              onClick={onSubmit}
              variant="link"
              className="px-0 float-right"
            >
              <img src={clear} alt="" />
            </Button>
          </Col>
        </Col>
        {MainContent}
      </div>
    </div>
  );
};

export default History;
