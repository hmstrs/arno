import React, { useState } from 'react';
import './ArnoChat.css';
import Logo from './logo.svg';

const ArnoChat = ({ className }) => {
  const [message, setMessage] = useState('hello');

  return (
    <div className={"ArnoChat " + className}>
      <div className="chat-wrapper">
        <img src={Logo} className="arno-logo"/>
        <p className="main-text arno-text">тут говорит арно</p>
        <p className="main-text user-text">тут говорит юзер</p>
        <img src={Logo} className="arno-logo"/>
        <p className="main-text arno-text">тут говорит арно уже больше слов, проверяю размер рамки</p>
        <img src={Logo} className="arno-logo"/>
        <p className="main-text arno-text">тут говорит арно</p>
        <p className="main-text user-text">тут говорит юзер</p>
        <img src={Logo} className="arno-logo"/>
        <p className="main-text arno-text">тут говорит арно уже больше слов, проверяю размер рамки</p>
      </div>
      
      <div className="bottom">
        <input type="text" className="input" value={message} name="chat" onChange={setMessage}/>
        <button className="audio"/>
      </div>
    </div>
  );
};

export default ArnoChat;
