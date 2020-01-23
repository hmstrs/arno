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
      <p className="card music">{listened}</p>
      <p className="card music">{favourited}</p>
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

  // const MainContent =
  //   loading || error ? (
 //   <Spinner animation="border" />
 //  ) : ('track info');

  return (
    <div className="Page Track">
      <Col xs={12} sm={{ span: 10, offset: 1 }} className="header">
        <Col>
          <div className="text">Track Info</div>
        </Col>
      </Col>
      {/* {MainContent} */}
      <iframe className="frame" scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=600&height=600&color=ff0000&layout=dark&size=big&type=charts&id=user_3401314024&title=%D0%95%D0%B3%D0%BE%D1%80%20%D0%A5%D0%B8%D0%BB%D1%8C%D1%87%D0%B5%D0%BD%D0%BA%D0%BE&app_id=1" width="400" height="400" />
      <div class="buttons">
        <p className="card music" >прослушано</p>
        <p className="card music" >фавориты</p>
      </div>
      
    </div>
  );
};

export default Track