import React from 'react';
import './UserMessage.css';

const UserMessage = (message, id) => (
  <div key={id}>
    <p className="main-text user-text">{message}</p>
  </div>
);

export default UserMessage;
