import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from "graphql-tag";

import './Track.css';

const frameProperties = {
  className: "frame",
  scrolling: "no",
  frameBorder: "0",
  allowtransparency: "true",
  width: "400",
  height: "400"
};

const GET_SONG = gql`
 query song($id: ID!) {
  getSong(id: $id) {
    id
    reference
    title
    artist
    listened
    favourited
  }
  checkInFavourites(id: $id) 
 }
`;

const ADD_TO_FAVOURITE = gql`
  mutation favourite($id: ID!) {
    addFavourites(id: $id) {
      name
    }
  }
`;

const createId = id => `https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=400&height=400&color=ff0000&layout=dark&size=medium&type=playlist&id=${id}&app_id=1`;

const createFrame = (props, src) => <iframe {...props} src={src}/>;

const Track = () => {
  const [song, setSong] = useState({});
  const [favourite, setFavourite] = useState({});
  const [addToFavourites] = useMutation(ADD_TO_FAVOURITE);
  const id = useParams().id;

  const { loading, error, data } = useQuery(GET_SONG, { variables: { id } });

  const addToUserFavourites = async () => {
    try {
      await addToFavourites({ variables: { id } });
    } catch (error) {
      alert('error');
      console.error(error);
    }
    // добавить юзеру плюс одну песню в фавориты
    // поменять кнопочку
    setFavourite(true);
  };
  
  const createButtons = (listened, favourited) => {
    return (
      <div className="buttons">
        <p className="card music">listened<br/><p className="counter">{listened}</p></p>
        <p className="card music" onClick={e => !favourite ? addToUserFavourites() : null}>{favourite ? "favourited" : "add to favourite"}<br/><p className="counter">{favourited}</p></p>
      </div>
    );
  };

  useEffect(() => {
    if (data) {
      setSong(data.getSong);
      setFavourite(data.checkInFavourites)
    }
    console.log(data);
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);
  return loading ? (
    <Spinner animation="border" />
  ) : (error && id === "0") ? <p className="text track-info" margin-top="3%" >Sorry deezer can't play your song</p> :
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