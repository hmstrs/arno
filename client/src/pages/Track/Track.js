import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from "graphql-tag";

import './Track.css';

const GET_SONG = gql`
 query song($id: ID!) {
  getSong(id: $id) {
   reference
   title
   artist
   listened
   favourited
  }
 }
`;

const createId = id => `https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=400&height=400&color=ff0000&layout=dark&size=medium&type=playlist&id=${id}&app_id=1`;

const createButtons = (listened, favourited) => {
  return (
    <div className="buttons">
      <p className="card music">listened<br/><p className="counter">{listened}</p></p>
      <p className="card music">favourited<br/><p className="counter">{favourited}</p></p>
    </div>
  );
};

const createFrame = (props, src) => {
  return (
    <iframe {...props} src={src}/>      
  );
};

const Track = () => {
  const { loading, error, data } = useQuery(GET_SONG, {
    variables: {id: useParams().id },
  });

  const [song, setSong] = useState({});

  useEffect(() => {
    if (data) {
      setSong(data.getSong);
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  const frameProperties = {
    className: "frame",
    scrolling: "no",
    frameBorder: "0",
    allowtransparency: "true",
    width: "400",
    height: "400"
  };
  
  return loading || error ? (
    <Spinner animation="border" />
  ) : 
  (
    <div className="Page Track">
      <div className="text track-info">
        <p className="trackName">{song.title}</p>
        <p className="artistName">{song.artist}</p>
      </div>
      { createFrame(frameProperties, createId(parseInt(song.reference))) }
      { createButtons(song.listened, song.favourited) }
    </div>  
  );
};

export default Track