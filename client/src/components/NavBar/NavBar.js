import React from 'react';

import { FaRegMap, FaRegHeart, FaPlus, FaRegBell, FaRegUser } from 'react-icons/fa';

import './NavBar.css'

import NavLink from '../NavLink/NavLink';

const NavBar = () => {
  return (
		<div className="NavBar">
			<NavLink to="/" exact>
				<FaRegMap />
			</NavLink>
			<NavLink to="/likes">
				<FaRegHeart />
			</NavLink>
			<NavLink to="/create" className="primary" back>
				<FaPlus />
			</NavLink>
			<NavLink to="/notifications">
				<FaRegBell />
			</NavLink>
			<NavLink to="/profile">
				<FaRegUser />
			</NavLink>
		</div>
	)
}

export default NavBar;
