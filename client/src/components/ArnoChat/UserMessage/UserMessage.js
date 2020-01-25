import React from 'react';
import './UserMessage.css';

const UserMessage = (message, id) => (
  <div id={id} key={id}>
    <p className="main-text user-text">{message}</p>
  </div>
);

export default UserMessage;
