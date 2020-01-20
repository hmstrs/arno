import React from 'react';
import Button from 'react-bootstrap/Button';

import {
  FaRegMap,
  FaRegHeart,
  FaPlus,
  FaRegBell,
  FaRegUser
} from 'react-icons/fa';

import './NavBar.css';
import NavLink from '../NavLink/NavLink';

const NavBar = ({ gameStarted, gameClickHandler }) => {
  return (
    <div className={`NavBar ${gameStarted ? 'moved' : ''}`}>
      <NavLink to="/" exact>
        <FaRegMap />
      </NavLink>
      <NavLink to="/likes">
        <FaRegHeart />
      </NavLink>
      <Button
        variant="link"
        onClick={gameClickHandler}
        className={`primary ${gameStarted && 'active'}`}
      >
        <FaPlus />
      </Button>
      <NavLink to="/notifications">
        <FaRegBell />
      </NavLink>
      <NavLink to="/profile">
        <FaRegUser />
      </NavLink>
    </div>
  );
};

export default NavBar;
