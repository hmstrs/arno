import React, { useEffect } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from "graphql-tag";

import './Track.css';

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

const createButtons = (listened, favourited) => {
  return (
    <div class="buttons">
      <p className="card music">listened<br/><p className="counter">{listened}</p></p>
      <p className="card music">favourited<br/><p className="counter">{listened}</p></p>
    </div>
  );
};

const createFrame = () => {
  return (
    <div>
      <iframe className="frame" scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=600&height=600&color=ff0000&layout=dark&size=big&type=charts&id=30595446&title=%D0%95%D0%B3%D0%BE%D1%80%20%D0%A5%D0%B8%D0%BB%D1%8C%D1%87%D0%B5%D0%BD%D0%BA%D0%BE&app_id=1" width="400" height="400" />
    </div>
  );
};

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

  const frameProperties = {
    className: "frame",
    scrolling: "no",
    frameborder: "0",
    allowTransparency: "true",
    width: "400",
    height: "400",
    src: "https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=playlist&id=30595444&app_id=1"
  };

  // Прикрутить как-то?
  const MainContent =
    loading || error ? (
    <Spinner animation="border" />
   ) : ('track info');

  return (
    <div className="Page Track">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text track-info">
            <p className="trackName">Track</p>
            <p className="artistName">Artist</p>
          </div>
        </Col>
      </Col>
      <iframe {...frameProperties} />      
      { createButtons() }
    </div>
  );
};

export default Track