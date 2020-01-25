import React, { useEffect, useState} from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import gql from "graphql-tag";

import {
	FaTrash
} from 'react-icons/fa'

import './Favourites.css'

const GET_GAMES = gql`
	query song($id: ID!) {
		user(id: $id) {
			favourites {
				_id
				title
				artist
			}
		}
	}
`;

const DELETE_FAVOURITE = gql`
	mutation {
		deleteFavourites(id: "5e29ae229d95a6c7927da1db") {
			favourites {
				title
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
			setSongs(data.user.favourites)
		}
		//eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    error && console.log(error);
	}, [error]);

	const [deleteFavourite] = useMutation(DELETE_FAVOURITE)
	const onSubmit = id => {
		deleteFavourite({id: id})
			.then(() => window.location.reload(false))
			.catch(e => console.log(e))
  };

  const MainContent =
    loading || error ? (
			<Spinner animation="border" />
    ) : !songs.length ? (
      <center>
        <p className="fav">
          It seems like you don't have music yet :( <br/> Check our <a href="/explore">daily top</a>.
        </p>
      </center>
    ) : (
			songs.map(({title, artist, _id}) => (
				<div className="card card-favourite" key={Math.random()}>
					<div className="delete">
						<button onClick={() => onSubmit(_id)}>
							<FaTrash />
						</button>
					</div>
					<div>{title}<br/>by {artist}</div>
				</div>
			))
		);

  return (
    <div className="Page">
			<div className="Favourites">
				<Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
					<Col>
						<div className="text">Favourites</div>
					</Col>
				</Col>
				{MainContent}
			</div>
    </div>
  );
};

export default AllUsers
