import React, { useState, useEffect } from 'react';
import ArnoMessage from './ArnoMessage/ArnoMessage';
import UserMessage from './UserMessage/UserMessage';
import PlaySongMessage from './PlaySongMessage/PlaySongMessage';
import recordAudio from './recordAudio';
import './ArnoChat.css';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const compareObjs = (obj1, obj2) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

const defaultSong = [
  {
    title: '',
    artist: ''
  }
];

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
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({
    message: '',
    recording: false
  });
  const [recorder, setRecoder] = useState(null);
  const [tries, setTries] = useState(0);
  const [win, setWin] = useState(false);
  const [existBadUserInput, setExistBadUserInput] = useState(false);
  const [firstStep, setFirstStep] = useState('');
  const [rowGames, setRowGames] = useState(0);
  const [songInfo, setSongInfo] = useState(defaultSong);
  const [deezerID, setDeezerID] = useState(0);

  const didTry = tries > 0;
  const isAudio = firstStep === 'audio';
  const isTyping = firstStep === 'typing';

  const clearInputMessage = async () => setMessage({ ...message, message: '' });

  const endGameQueryHelper = ({ win, song, tries, offered }) => {
    console.log('---------------------');

    console.log('win', win);
    console.log('song', song);
    console.log('tries', tries);
    console.log('offered', offered);
    console.log('---------------------');
  };

  const incCountTries = async () => setTries(tries + 1);
  const endGameWithoutWin = async Try => {
    setIndex(0);
    setWin(false);
    messages.push(
      ArnoMessage(
        messages.length,
        { result: true },
        {
          win: false,
          tries: Try,
          songInfo,
          rowGames: rowGames,
          startNewGame
        }
      )
    );
    setMessages([...messages]);
    endGameQueryHelper({
      win: false,
      song: {
        reference: 0,
        title: 'Бот проиграл',
        artist: ' '
      },
      tries: Try,
      offered: songInfo
    });
  };
  const endGameWithWin = async () => {
    setIndex(0);

    setRowGames(rowGames + 1);
    setWin(true);
    await messages.push(
      ArnoMessage(
        messages.length,
        { result: true },
        {
          win: true,
          tries,
          songInfo,
          rowGames: rowGames + 1,
          startNewGame
        }
      )
    );
    setMessages([...messages]);
    endGameQueryHelper({
      win: true,
      song: {
        reference: deezerID,
        title: songInfo[songInfo.length - 1].title,
        artist: songInfo[songInfo.length - 1].artist
      },
      tries,
      offered: songInfo
    });
  };

  const sendUserMessage = async msg => {
    messages.push(UserMessage(msg, messages.length));
    setMessages([...messages]);
  };

  const sendWrongMessage = async () => {
    messages.push(ArnoMessage(messages.length, { success: false }));
    setMessages([...messages]);
  };

  const sendGreetingMessage = async () => {
    messages.push(ArnoMessage(messages.length, { greeting: true }));
    setMessages([...messages]);
  };

  const sendDeezerMessage = async id => {
    messages.push(PlaySongMessage(messages.length, id));
    setMessages([...messages]);
  };

  const sendChoiceMessage = async () => {
    messages.push(
      ArnoMessage(
        messages.length,
        { success: true },
        songInfo[isAudio ? index : tries - 1],
        agreeWithSong,
        nextTry
      )
    );
    setMessages([...messages]);
  };

  const [fetchAudio] = useLazyQuery(FETCH_AUDIO, {
    onCompleted: data => {
      const Try = tries + 1;
      // console.log('tries on complite', Try);
      existBadUserInput && setExistBadUserInput(false);

      !didTry || compareObjs(songInfo, defaultSong)
        ? setSongInfo(data.recogniseByBase64)
        : setSongInfo([...songInfo, ...data.recogniseByBase64]);

      // setSongInfo([...songInfo, ...data.recogniseByBase64]);

      Try <= 5 ? incCountTries() : endGameWithoutWin(Try);
    },

    onError: err => {
      if (err.graphQLErrors.length > 0) {
        const { code } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          const Try = tries + 1;
          // console.log('tries on errro', Try);

          setExistBadUserInput(true);
          Try < 5 ? incCountTries() : endGameWithoutWin(Try);
        }
      } else console.log(err);
    }
  });
  const [fetchLyrics] = useLazyQuery(FETCH_LYRICS, {
    onCompleted: data => {
      setSongInfo(data.recogniseByLyrics);
      setTries(1);
    },
    onError: err => {
      if (err.graphQLErrors.length > 0) {
        const { code, errors } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          sendWrongMessage();
        }
      } else console.log(err);
    }
  });
  const [fetchDeezerID] = useLazyQuery(GET_DEEZER_ID, {
    onCompleted: data => {
      const id = data.getTrackID ? data.getTrackID : 0;
      sendDeezerMessage(id);
      setDeezerID(id);
    },
    onError: err => {
      if (err.graphQLErrors.length > 0) {
        const { code } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          sendWrongMessage();
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

  const fetchDeezerHelper = async () => {
    await fetchDeezerID({
      variables: {
        artist: songInfo[isAudio ? index : tries - 1].artist,
        track: songInfo[isAudio ? index : tries - 1].title
      }
    });
  };

  useEffect(() => {
    didTry
      ? tries <= 5
        ? existBadUserInput
          ? sendWrongMessage()
          : sendChoiceMessage()
        : endGameWithoutWin(tries)
      : sendGreetingMessage();
  }, [tries]);

  useEffect(() => {
    if (gameStarted) {
      (async () => setRecoder(await recordAudio()))();
      sendGreetingMessage();
    } else {
      setIndex(0);
      setMessages([]);
      setMessage('');
      setRecoder(null);
      setTries(0);
      setWin(false);
      setExistBadUserInput(false);
      setFirstStep('');
      setRowGames(0);
      setSongInfo(defaultSong);
      setDeezerID(0);
    }
  }, [gameStarted]);

  const startNewGame = async () => {
    setWin(false);
    setTries(0);
    setSongInfo(defaultSong);
    setFirstStep('');
    setDeezerID(0);
    setExistBadUserInput(false);
  };
  const agreeWithSong = async () => {
    await fetchDeezerHelper();
    endGameWithWin();
  };
  const nextTry = async () => {
    if (isTyping) {
      if (tries < 5) {
        songInfo.length === 1 ? sendWrongMessage() : incCountTries();
      } else endGameWithoutWin(tries);
    } else {
      // console.log('tries in nextTry', tries);

      if (tries < 5) {
        setIndex(index + 1);
        // console.log('index in nextTry', index.get());

        sendWrongMessage();
        // songInfo.length === 1 ? sendWrongMessage() : incCountTries();
      } else endGameWithoutWin(tries);
    }
  };

  const onSubmit = async () => {
    if (message.message) {
      setFirstStep('typing');
      sendUserMessage(message.message);
      await fetchLyricsHelper(message.message);
      clearInputMessage();
    }
  };

  const onChange = e =>
    setMessage({ ...message, [e.target.name]: e.target.value });

  const onKeyPress = e => (e.key === 'Enter' ? onSubmit() : null);

  const onMouseUpHandler = async () => {
    if (recorder && message.recording) {
      setFirstStep('audio');
      setMessage({ ...message, recording: false });
      const audio = await recorder.stop();
      sendUserMessage('Ваше аудио записно, ждите результата');
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
          className={`input ${isTyping ? 'width-step-typing' : ''} ${
            isAudio ? 'width-step-audio' : ''
          }`}
          value={message.message}
          name="message"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        {(firstStep === '' || isAudio) && (
          <button
            className="audio"
            onMouseDown={onMouseDownHandler}
            onMouseUp={onMouseUpHandler}
          />
        )}
      </div>
    </div>
  );
};

export default ArnoChat;
