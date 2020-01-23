import React, { useState, useEffect } from 'react';
import ArnoMessage from './ArnoMessage/ArnoMessage';
import UserMessage from './UserMessage/UserMessage';
import PlaySongMessage from './PlaySongMessage/PlaySongMessage';
import recordAudio from './recordAudio';
import './ArnoChat.css';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const defaultSong = {
  offeredSong: '',
  artist: ''
};

const FETCH_AUDIO = gql`
  query recogniseByBase64($audio: String!) {
    recogniseByBase64(audio: $audio) {
      artist
      title
    }
  }
`;

const GET_DEEZER_ID = gql`
  query getTrackID($artist: String!, $track: String!) {
    getTrackID(artist: $artist, track: $track)
  }
`;

const FETCH_LYRICS = gql`
  query recogniseByLyrics($lyrics: String!) {
    recogniseByLyrics(lyrics: $lyrics) {
      artist
      title
    }
  }
`;

const ArnoChat = ({ className, gameStarted }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({
    message: '',
    recording: false
  });
  const [recorder, setRecoder] = useState(null);

  const [songInfo, setSongInfo] = useState(defaultSong);
  const [deezerID, setDeezerID] = useState(0);
  const [fetchAudio] = useLazyQuery(FETCH_AUDIO, {
    onCompleted: data => {
      const { title, artist } = data.recogniseByBase64;
      setSongInfo({ offeredSong: title, artist });
    },
    onError: err => {
      console.log(err);

      if (err.graphQLErrors.length > 0) {
        const { code, errors } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          messages.push(ArnoMessage(messages.length, false));
          setMessages([...messages]);
        }
      } else console.log(err);
    }
  });
  const [fetchLyrics] = useLazyQuery(FETCH_LYRICS, {
    onCompleted: data => {
      const { title, artist } = data.recogniseByLyrics;
      setSongInfo({ offeredSong: title, artist });
    },
    onError: err => {
      const { graphQLErrors } = err;
      console.dir({ graphQLErrors });

      if (err.graphQLErrors.length > 0) {
        const { code, errors } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          messages.push(ArnoMessage(messages.length, false));
          setMessages([...messages]);
        }
      } else console.log(err);
    }
  });
  const [getDeezerID] = useLazyQuery(GET_DEEZER_ID, {
    onCompleted: data => {
      const id = data.getTrackID ? data.getTrackID : 0;

      messages.push(PlaySongMessage(messages.length, id));

      setMessages([...messages]);
      setDeezerID({ id });
    },
    onError: err => {
      const { graphQLErrors } = err;
      console.dir({ graphQLErrors });

      if (err.graphQLErrors.length > 0) {
        const { code, errors } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          messages.push(ArnoMessage(messages.length, false));
          setMessages([...messages]);
        }
      } else console.log(err);
    }
  });

  const fetchAudioHelper = async base64 => {
    await fetchAudio({
      variables: {
        audio: base64
      }
    });
  };
  const fetchLyricsHelper = async lyrics => {
    await fetchLyrics({
      variables: {
        lyrics
      }
    });
  };
  const pushMessageWithSong = async () => {
    messages.push(ArnoMessage(messages.length, true, songInfo, playSong));
    setMessages([...messages]);
  };

  useEffect(() => {
    if (JSON.stringify(songInfo) !== JSON.stringify(defaultSong)) {
      pushMessageWithSong();
    }
  }, [songInfo]);

  useEffect(() => {
    if (gameStarted) {
      (async () => setRecoder(await recordAudio()))();
      setMessages([ArnoMessage(0)]);
    } else {
      setRecoder(null);
      setMessages([]);
      setSongInfo(defaultSong);
      setDeezerID(0);
    }
  }, [gameStarted]);

  const playSong = async () => {
    await getDeezerID({
      variables: {
        artist: songInfo.artist,
        track: songInfo.offeredSong
      }
    });
  };

  const onSubmit = async () => {
    if (message.message) {
      messages.push(UserMessage(message.message, messages.length));
      setMessages([...messages]);
      await fetchLyricsHelper(message.message);
      setMessage({ ...message, message: '' });
    }
  };

  const onChange = e => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const onKeyPress = e => (e.key === 'Enter' ? onSubmit() : null);

  const onMouseUpHandler = async () => {
    if (recorder && message.recording) {
      setMessage({ ...message, recording: false });
      const audio = await recorder.stop();
      await fetchAudioHelper(audio.base64);
    }
  };
  const onMouseDownHandler = async () => {
    await recorder.start();
    setMessage({ ...message, recording: true });
  };
  return (
    <div className={`ArnoChat ${className}`}>
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
