import React, { useEffect, useState, Fragment } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';

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

const Track = () => {
  const [song, setSong] = useState({});
  const [favourite, setFavourite] = useState({});
  const [addToFavourites] = useMutation(ADD_TO_FAVOURITE);
  const id = useParams().id;

  const isMobile = window.innerWidth <= 600;

  const createId = id => {
    return `https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=${
      isMobile ? 325 : 400
    }&height=${
      isMobile ? 325 : 400
    }&color=ff8300&layout=dark&size=medium&type=tracks&id=${id}&app_id=1`;
  };

  const createFrame = src => (
    <div className="frame-track mx-auto">
      <iframe
        scrolling="no"
        frameBorder="0"
        allowtransparency="true"
        width={`${isMobile ? 325 : 400}`}
        height={`${isMobile ? 325 : 400}`}
        src={src}
      />
      ;
    </div>
  );

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
        <div className="card-track music">
          <div className="counter">{listened}</div>
          <div className="lis">listened</div>
        </div>
        <div
          className="card-track music"
          onClick={e => (!favourite ? addToUserFavourites() : null)}
        >
          <div className="counter">{favourited}</div>
          <div className="lis">
            {favourite ? 'favourited' : 'add to favourite'}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (data) {
      setSong(data.getSong);
      setFavourite(data.checkInFavourites);
    }
  }, [data]);

  useEffect(() => {
    error && console.log(error);
  }, [error]);
  return loading ? (
    <Spinner animation="border" />
  ) : error || (song && song.reference === '0') ? (
    <Fragment>
      <div
        style={{
          paddingTop: '3%'
        }}
        className="text track-info"
      >
        К сожелению данный трек не выйдет проиграть, так как его нет в Deezer
      </div>
    </Fragment>
  ) : (
    <div className="Page Track">
      <div className="text track-info">
        <p className="trackName">{song.title}</p>
        <p className="artistName">{song.artist}</p>
      </div>
      {song && song.reference && createFrame(createId(song.reference))}

      {createButtons(song.listened, song.favourited)}
    </div>
  );
};

export default Track;
