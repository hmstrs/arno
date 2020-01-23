import React, { useEffect } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from "graphql-tag";

const GET_SONG = gql`
	query song($id: ID!) {
		song(id: $id) {
			reference
			title
			artist
			listened
			favourited
		}
	}
`;

const Track = () => {
	const { loading, error, data } = useQuery(GET_SONG, {
    variables: {id: useParams().id},
	});

  useEffect(() => {
    if (data) {
      // const { songdata } = data.song;
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const MainContent =
    loading || error ? (
			<Spinner animation="border" />
		) : ('track info');

  return (
    <div className="Page Track">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">Track Info</div>
        </Col>
      </Col>
      {MainContent}
    </div>
  );
};

export default Track
