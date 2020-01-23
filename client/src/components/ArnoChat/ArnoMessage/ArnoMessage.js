import React from 'react';
import Logo from './logo.svg';
import './ArnoMessage.css';

const ArnoMessage = (id, success, data, playSong, tryAgain) =>
  id === 0 ? (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <p className="main-text arno-text">
        {
          'Привет, я - Арно,\n отгадаю любую песню. \n Запиши мне аудио трека или отправь пару фраз.'
        }
      </p>
    </div>
  ) : !success ? (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <p className="main-text arno-text">хм, что-то с апи</p>
    </div>
  ) : (
    <div key={id}>
      <img src={Logo} alt="" className="arno-logo" />
      <div className="main-text arno-text">
        Я думаю это:
        <div className="text offered-song">{data.offeredSong}</div>
        <div className="text artist">by {data.artist}</div>
        <div className="text-center">
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

export default ArnoMessage;
