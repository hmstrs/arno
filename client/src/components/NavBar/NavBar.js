import React from 'react';
import Button from 'react-bootstrap/Button';

import {
  FaHistory,
  FaHeart,
  FaCompass,
	FaUser,
	FaPlus
} from 'react-icons/fa';

import './NavBar.css';
import NavLink from '../NavLink/NavLink';

import arno from '../../assets/arno.svg'

const NavBar = ({ gameStarted, gameClickHandler }) => {
  return (
    <div className={`NavBar ${gameStarted ? 'moved' : ''}`}>
      <NavLink to="/" exact>
        <FaHistory />
      </NavLink>
      <NavLink to="/favourites">
        <FaHeart />
      </NavLink>
      <Button
        variant="link"
        onClick={gameClickHandler}
        className={`primary ${gameStarted && 'active'}`}
      >
        {!gameStarted ? <img src={arno} alt=""/> : <FaPlus /> }
      </Button>
      <NavLink to="/explore">
        <FaCompass />
      </NavLink>
      <NavLink to="/profile">
        <FaUser />
      </NavLink>
    </div>
  );
};

export default NavBar;
