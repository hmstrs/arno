import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
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
      <p className="card music">favourited<br/><p className="counter">{favourited}</p></p>
    </div>
  );
};

const createFrame = props => {
  return (
    <iframe {...props} />      
  );
};

const Track = () => {
  const { loading, error, data } = useQuery(GET_SONG, {
    variables: {id: "5e29ae229d95a6c7927da1db" },
  });

  const [song, setSong] = useState({});

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
    src: `https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=playlist&id=${song.reference}&app_id=1`
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
            <p className="trackName">{song.title}</p>
            <p className="artistName">{song.artist}</p>
          </div>
        </Col>
      </Col>
      { createFrame(frameProperties) }
      { createButtons(song.listened, song.favourited) }
    </div>
  );
};

export default Track