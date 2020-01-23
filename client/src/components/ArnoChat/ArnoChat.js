import React, { useState, useEffect } from 'react';
import ArnoMessage from './ArnoMessage/ArnoMessage';
import UserMessage from './UserMessage/UserMessage';
import PlaySongMessage from './PlaySongMessage/PlaySongMessage';
import recordAudio from './RecordAudio';
import './ArnoChat.css';

const ArnoChat = ({ className, gameStarted }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({
    message: '',
    recording: false
  });
  const [recorder, setRecoder] = useState(null);
  const [userAudio, setUserAudio] = useState(null);

  useEffect(() => {
    if (gameStarted) {
      (async () => setRecoder(await recordAudio()))();
      setMessages([ArnoMessage(0)]);
    } else {
      setRecoder(null);
      setMessages([]);
      setUserAudio(null);
    }
  }, [gameStarted]);
  const simulateQueryHelper = async () => ({
    offeredSong: 'Sugar',
    artist: 'Maroon 5',
    deezer_id: '100004590'
  });

  const playSong = () => {
    messages.push(PlaySongMessage(messages.length, 100004590));

    setMessages([...messages]);
  };
  const simulateQuery = async () => {
    const data = await simulateQueryHelper();
    messages.push(ArnoMessage(messages.length, true, data, playSong));
    setMessages([...messages]);
  };

  const onSubmit = async () => {
    if (message.message) {
      userAudio && userAudio.play();
      messages.push(UserMessage(message.message, messages.length));
      setMessages([...messages]);

      setMessage({ ...message, message: '' });
      simulateQuery();
    }
    // send async request here
  };

  const onChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const onKeyPress = e => (e.key === 'Enter' ? onSubmit() : null);

  const onMouseUpHandler = async () => {
    if (recorder && message.recording) {
      setMessage({ ...message, recording: false });
      setUserAudio(await recorder.stop());
    }
  };
  const onMouseDownHandler = async () => {
    await recorder.start();

    setMessage({ ...message, recording: true });
  };

  return (
    <div className={'ArnoChat ' + className}>
      <div className="chat-wrapper">{messages}</div>

      <div className="bottom">
        <input
          type="text"
          className="input"
          value={message.message}
          name="message"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        <button
          className="audio"
          onMouseDown={onMouseDownHandler}
          onMouseUp={onMouseUpHandler}
        />
      </div>
    </div>
  );
};

export default ArnoChat;
