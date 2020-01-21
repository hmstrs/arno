import React from 'react';
import './ArnoChat.css';

const ArnoChat = ({className}) => {
  return (
    <div className={"ArnoChat " + className}>
      <p className="main-text">тут чат с арно</p>
    </div>
  );
};

export default ArnoChat;
