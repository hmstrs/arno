import React from 'react';
import './PlaySongMessage.css';
import Logo from '../ArnoMessage/logo.svg';
const SONG_NOT_EXIST_IN_DEEZER =
  'К сожелению данный трек не выйдет проиграть, так как его нет в Deezer';
const PlaySongMessage = (id, deezer_id) => {
  return deezer_id === '0' ? (
    <div id={id} key={id}>
      <p className="main-text arno-text">{SONG_NOT_EXIST_IN_DEEZER}</p>
    </div>
  ) : (
    <div id={id} key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <div className="frame arno-text mg-five">
        <iframe
          title={id}
          scrolling="no"
          frameBorder="0"
          allowtransparency="true"
          src={`https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=150&height=150&color=ff8300&layout=dark&size=medium&type=tracks&id=${deezer_id}&app_id=1`}
          width="200"
          height="200"
        ></iframe>
      </div>
    </div>
  );
};

export default PlaySongMessage;
