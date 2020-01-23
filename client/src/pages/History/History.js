import React, { useEffect, useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Col, Spinner, Button } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import gql from "graphql-tag";

import { FaTrophy } from 'react-icons/fa';

import clear from '../../assets/icon-clear.svg';

const GET_GAMES = gql`
	query user($id: ID!) {
		user(id: $id) {
			name
			games {
				win
				song {
					title
					artist
				}
				tries
			}
		}
	}
`;

const History = () => {
	const [games, setGames] = useState([])

	const getID = () => {
    const token = localStorage.getItem('token');
    const { id } = jwt_decode(token);
    return id;
	};

	const { loading, error, data } = useQuery(GET_GAMES, {
    variables: {id: getID()},
	});

  useEffect(() => {
    if (data) {
			setGames(data.user.games)
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

	const onSubmit = () => alert('clear history');

  const MainContent =
    loading || error ? (
			<Spinner animation="border" />
		) : (
			games.map(({win, song: { title, artist }, tries}) => (
				<div className="card" >
					<div>
						<FaTrophy style={{
							color: win ? '#f96900' : '#fff',
							fontSize: '64px'
						}}/> {tries}
					</div>
					<div>{title}<br/>by {artist}</div>
				</div>
			))
		);

  return (
    <div className="Page History">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">History</div>
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
  );
};

export default History
