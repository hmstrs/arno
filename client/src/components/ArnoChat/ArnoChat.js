import React, { useState } from 'react';
import ArnoMessage from './ArnoMessage/ArnoMessage';
import UserMessage from './UserMessage/UserMessage';
import recordAudio from './RecordAudio';
import './ArnoChat.css';

const ArnoChat = ({ className }) => {
  // Refactor this into three states
  const [message, setMessage] = useState({ message: 'hello', messages: [], recording: false });

  const onSubmit = async () => {
    message.messages.push(UserMessage(message.message, message.messages.length));
    setMessage({ message: '', messages: message.messages, recording: message.recording });
    // send async request here
  };

  const onChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const onKeyPress = e => e.key === 'Enter' ? onSubmit() : null;

  const onRecord = async () => {
    const recorder = await recordAudio();
    if (message.recording) {
      const audio = await recorder.stop();
      // send audio or something else logic
      return;
    }
    setMessage({ message: message.message, messages: message.messages, recording: true });
    recorder.start();
  };

  return (
    <div className={"ArnoChat " + className}>
      <div className="chat-wrapper">
        {message.messages}
      </div>
      
      <div className="bottom">
        <input 
          type="text" 
          className="input" 
          value={message.message}
          name="message" 
          onChange={onChange} 
          onKeyPress={onKeyPress}
        />
        <button className="audio" onClick={onRecord}/>
      </div>
    </div>
  );
};

export default ArnoChat;
