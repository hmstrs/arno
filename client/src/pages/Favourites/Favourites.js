import React, { useEffect, useState} from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import gql from "graphql-tag";

const GET_GAMES = gql`
	query song($id: ID!) {
		user(id: $id) {
			name
			games {
        favourites
      }
		}
	}
`;

const AllUsers = () => {
	const [songs, setSongs] = useState([])

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
			data.user.games.map(({favourites}) => setSongs([...songs, favourites]))
		}
		//eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const MainContent =
    loading || error ? (
			<Spinner animation="border" />
    ) : (
			songs.map((x) => x)
		);

  return (
    <div className="Page Favourites">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">Favourites</div>
        </Col>
      </Col>
      {MainContent}
    </div>
  );
};

export default AllUsers
