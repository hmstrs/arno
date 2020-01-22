import React, { useState } from 'react';
import './UserMessage.css';

const UserMessage = (text, id) => {
  return (
    <div key={id}>
      <p className="main-text user-text">{text}</p>
    </div>
  );
}

export default UserMessage;

