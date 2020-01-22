import React, { useState } from 'react';
import Logo from './logo.svg';
import './ArnoMessage.css';

const ArnoMessage = (text, id) => {
  return (
    <div key={id}>
      <img src={Logo} className="arno-logo"/>
      <p className="main-text arno-text">{text}</p>
    </div>
  );
}

export default ArnoMessage;

