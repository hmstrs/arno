import React from 'react';
import './ArnoChat.css';
import Logo from './logo.svg';

const ArnoChat = ({className}) => {
  return (
    <div className={"ArnoChat " + className}>
      <img src={Logo} />
      <p className="main-text arno-text">тут говорит арно</p>
      <p className="main-text user-text">тут говорит юзер</p>
    </div>
  );
};

export default ArnoChat;
