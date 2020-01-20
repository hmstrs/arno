import React, { useState } from 'react';
import Main from '../Main/Main';
import ArnoChat from '../ArnoChat/ArnoChat';
import './Layout.css';

const Layout = ({ children }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const gameClickHandler = () => setGameStarted(!gameStarted);
  return (
    <div className="App">
      {gameStarted && <ArnoChat />}
      <Main
        gameClickHandler={gameClickHandler}
        gameStarted={gameStarted}
        children={children}
      />
    </div>
  );
};

export default Layout;
