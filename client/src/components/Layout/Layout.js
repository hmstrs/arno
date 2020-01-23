import React, { useState, Fragment } from 'react';
import Main from '../Main/Main';
import ArnoChat from '../ArnoChat/ArnoChat';
// import './Layout.css';

const Layout = ({ children }) => {
  const isMobile = () => window.innerWidth < 576;
  const [gameStarted, setGameStarted] = useState(false);
  const gameClickHandler = () => setGameStarted(!gameStarted);
  return (
    <Fragment>
      <ArnoChat
        gameStarted={gameStarted}
        isMobile={isMobile}
        className={gameStarted ? 'active' : ''}
      />
      <Main
        gameClickHandler={gameClickHandler}
        gameStarted={gameStarted}
        children={children}
      />
    </Fragment>
  );
};

export default Layout;
