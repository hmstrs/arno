import React from 'react';
import NavBar from '../NavBar/NavBar';
import './Main.css';

const Main = ({ gameStarted, gameClickHandler, children }) => {
  return (
    <div className={`Main ${gameStarted ? 'moved' : ''}`}>
      {children}
      <NavBar gameStarted={gameStarted} gameClickHandler={gameClickHandler} />
    </div>
  );
};

export default Main;
