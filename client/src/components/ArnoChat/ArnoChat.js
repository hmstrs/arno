import React, { useState, useEffect } from 'react';
import ArnoMessage from './ArnoMessage/ArnoMessage';
import UserMessage from './UserMessage/UserMessage';
import PlaySongMessage from './PlaySongMessage/PlaySongMessage';
import recordAudio from './recordAudio';
import { compareObjs, offeredWithoutSong } from '../../tools/objectOperations';
import './ArnoChat.css';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const defaultSong = [
  {
    title: '',
    artist: '',
    reference: '0'
  }
];

const ADD_GAME = gql`
  mutation addGame(
    $win: Boolean!
    $song: OfferedSongInput!
    $tries: Int!
    $offered: [OfferedSongInput!]!
  ) {
    addGame(win: $win, song: $song, tries: $tries, offered: $offered) {
      name
      id
    }
  }
`;

const FETCH_AUDIO = gql`
  query recogniseByBase64($audio: String!) {
    recogniseByBase64(audio: $audio) {
      artist
      title
      reference
    }
  }
`;

const FETCH_LYRICS = gql`
  query recogniseByLyrics($lyrics: String!) {
    recogniseByLyrics(lyrics: $lyrics) {
      artist
      title
      reference
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
  const [tries, setTries] = useState(0);
  const [index, setIndex] = useState(0);
  const [win, setWin] = useState(false);
  const [existBadUserInput, setExistBadUserInput] = useState(false);
  const [firstStep, setFirstStep] = useState('');
  const [rowGames, setRowGames] = useState(0);
  const [songInfo, setSongInfo] = useState(defaultSong);
  const [deezerID, setDeezerID] = useState('0');

  const didTry = tries > 0;
  const isAudio = firstStep === 'audio';
  const isTyping = firstStep === 'typing';
  const isAudioOrEmpty = firstStep === '' || isAudio;
  const isFinish = firstStep === 'finish';

  const clearInputMessage = async () => setMessage({ ...message, message: '' });

  const endGameQueryHelper = ({ win, song, tries, offered }) => {
    const arrayOfferedSong = compareObjs(offered, defaultSong)
      ? []
      : offeredWithoutSong(offered, song);
    delete song.__typename;
    addGame({
      variables: {
        win,
        song,
        tries,
        offered: arrayOfferedSong
      }
    })
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.dir(err.networkError);
      });

    console.log('---------------------');
    console.log('win', win);
    console.log('song', song);
    console.log('tries', tries);
    console.log('offered', arrayOfferedSong);
    console.log('---------------------');
  };

  const clearChatContext = async () => {
    setIndex(0);
    setMessages([]);
    setMessage({ message: '', recording: false });
    setRecoder(null);
    setTries(0);
    setWin(false);
    setExistBadUserInput(false);
    setFirstStep('');
    setRowGames(0);
    setSongInfo(defaultSong);
    setDeezerID('0');
  };

  const incCountTries = async () => setTries(tries + 1);
  const endGameWithoutWin = async Try => {
    setIndex(0);
    setWin(false);
    setFirstStep('finish');

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
        reference: '0',
        title: 'Бот проиграл',
        artist: ' '
      },
      tries: Try,
      offered: songInfo
    });
  };
  const endGameWithWin = async () => {
    setIndex(0);
    setFirstStep('finish');

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
        artist: isAudio ? songInfo[index].artist : songInfo[tries - 1].artist,
        title: isAudio ? songInfo[index].title : songInfo[tries - 1].title,
        reference: isAudio
          ? songInfo[index].reference
          : songInfo[tries - 1].reference
      },
      tries,
      offered: isAudio ? songInfo : songInfo.slice(0, tries)
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

  const sendAudioWrittenMessage = async () => {
    messages.push(ArnoMessage(messages.length, { audio_written: true }));
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
  const [addGame] = useMutation(ADD_GAME);

  const [fetchAudio] = useLazyQuery(FETCH_AUDIO, {
    onCompleted: data => {
      const Try = tries + 1;
      existBadUserInput && setExistBadUserInput(false);

      !didTry || compareObjs(songInfo, defaultSong)
        ? setSongInfo(data.recogniseByBase64)
        : setSongInfo([...songInfo, ...data.recogniseByBase64]);

      Try <= 5 ? incCountTries() : endGameWithoutWin(Try);
    },

    onError: err => {
      if (err.graphQLErrors.length > 0) {
        const { code } = err.graphQLErrors[0].extensions;
        if (code === 'BAD_USER_INPUT') {
          const Try = tries + 1;
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
    const id = isAudio
      ? songInfo[index].reference
      : songInfo[tries - 1].reference;
    sendDeezerMessage(id);
    setDeezerID(id);
  };

  useEffect(() => {
    const scrollToLast = window.document.getElementById('scroll-to-last');
    scrollToLast && scrollToLast.click();
  }, [messages]);

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
      messages.length === 0 && sendGreetingMessage();
    } else clearChatContext();
  }, [gameStarted]);

  const startNewGame = async () => {
    setWin(false);
    setTries(0);
    setSongInfo(defaultSong);
    setFirstStep('');
    setDeezerID('0');
    setExistBadUserInput(false);
  };
  const agreeWithSong = async () => {
    await fetchDeezerHelper();
    endGameWithWin();
  };
  const nextTry = async () => {
    if (tries < 5) {
      if (isTyping) {
        songInfo.length === 1 ? sendWrongMessage() : incCountTries();
      } else {
        setIndex(index + 1);
        sendWrongMessage();
      }
    } else endGameWithoutWin(tries);
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
      sendAudioWrittenMessage();
      await fetchAudioHelper(audio.base64);
    }
  };
  const onMouseDownHandler = async () => {
    if (recorder) {
      await recorder.start();
      setMessage({ ...message, recording: true });
    } else {
      alert('Вы не предоставили доступ на запись микрофона');
    }
  };
  return (
    <div className={`ArnoChat ${className}`}>
      <a id="scroll-to-last" href={`#${messages.length - 1}`}>
        {' '}
      </a>
      <div className="chat-wrapper">{messages}</div>

      <div className="bottom">
        {isFinish ? (
          <button className="btn-new-game" onClick={startNewGame}>
            Начать новую игру
          </button>
        ) : (
          <div>
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

            {isAudioOrEmpty && (
              <button
                className="audio"
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArnoChat;
