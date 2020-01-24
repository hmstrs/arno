import React from 'react';
import Logo from './logo.svg';
import './ArnoMessage.css';
const GREETING =
  'Привет, я - Арно,\n отгадаю любую песню. \n Запиши мне аудио трека или отправь пару фраз песни.';
const SOMETHING_WRONG = 'Хм, Попробуй еще раз';

const ArnoMessage = (id, state, data, playSong, tryAgain) => {
  const isMultipleTracks =
    data &&
    data.songInfo &&
    data.songInfo.length >= 1 &&
    data.songInfo[0].title !== '';

  const thinkingTracks = isMultipleTracks
    ? data.songInfo.map(
        (obj, index) =>
          index + 1 <= data.tries && (
            <div key={index}>
              <div className="text offered-song">{obj.title}</div>
              <div className="text artist">by {obj.artist}</div>
            </div>
          )
      )
    : null;

  return state && state.result ? (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />

      <div className="main-text arno-text">
        <div className="win-result">
          {data.win
            ? 'О, даа, я выиграл эту битву:)'
            : 'Эта битва за тобой, я ухожу на покой'}{' '}
        </div>
        Количество попыток: <b>{data.tries}</b> <br />
        Количество побед: <b>{data.rowGames}</b> <br />
        {isMultipleTracks && 'Я думал об этих треках:'}
        {thinkingTracks}
        <div className="text-center">
          <button className="btn-true float-center" onClick={data.startNewGame}>
            Начать новую игру?
          </button>
        </div>
      </div>
    </div>
  ) : state && (state.greeting || !state.success) ? (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <p className="main-text arno-text">
        {state.greeting ? GREETING : SOMETHING_WRONG}
      </p>
    </div>
  ) : (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <div className="main-text arno-text">
        Я думаю это:
        <div className="text offered-song">{data.title}</div>
        <div className="text artist">by {data.artist}</div>
        <div className="h text-center">
          <div className="pb-3 pt-3">
            <button className="btn-true float-left" onClick={playSong}>
              Да, так и есть
            </button>
            <button className="btn-false float-right" onClick={tryAgain}>
              Еще, попытка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArnoMessage;
