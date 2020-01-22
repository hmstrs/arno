import React from 'react';
import './ArnoChat.css';
import Logo from './logo.svg';

const ArnoChat = ({ className }) => {
  return (
    <div className={"ArnoChat " + className}>
      <img src={Logo} className="arno-logo"/>
      <p className="main-text arno-text">тут говорит арно</p>
      <p className="main-text user-text">тут говорит юзер</p>
      <img src={Logo} className="arno-logo"/>
      <p className="main-text arno-text">тут говорит арно уже больше слов, проверяю размер рамки</p>
    </div>
  );
};

export default ArnoChat;
