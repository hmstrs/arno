import React from 'react';

import NavBar from '../NavBar/NavBar';

import './Layout.css';

const Layout = ({children}) => (
	<div className="App">
		{children}
		<NavBar />
	</div>
);

export default Layout;
