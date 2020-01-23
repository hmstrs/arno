import React, { useEffect } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import gql from "graphql-tag";

import './Explore.css';

const GET_GAMES = gql`
	query song($id: ID!) {
		user(id: $id) {
			name
			games {
				song
			}
		}
	}
`;

const Explore = () => {
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
      // const { games } = data.user;
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const MainContent =
    loading || error ? (
			<Spinner animation="border" />
    ) : ('explore');

  return (
    <div className="Page Explore">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">Explore</div>
        </Col>
      </Col>
      {MainContent}
    </div>
  );
};

export default Explore
