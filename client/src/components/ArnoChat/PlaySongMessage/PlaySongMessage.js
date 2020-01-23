import React from 'react';
import './PlaySongMessage.css';
import Logo from '../ArnoMessage/logo.svg';

const PlaySongMessage = (id, deezer_id) => {
  return (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <div className="frame arno-text vvv">
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
