import React from 'react';

import './Landing.css';

import arno from '../../assets/arno.svg'
import phone from '../../assets/phone.png'

const Landing = props => {
  return (<div className='landing'>
		<header>
			<img src={arno} alt=""/>
			<a className='btn' href="/login">ВОЙТИ</a>
		</header>
		<div className='hero'>
			<div>
				<h1>
					Привет, я – arno,<br/> отгадаю любую песню!
				</h1>
				<h4>
					Напой свои любимые строки и я попытаюсь определить <br/> какой композиции они пренадлежат!
				</h4>
				<a className='btn' href="/login">ВОЙТИ</a>
			</div>
			<img className='phone' src={phone} alt=""/>
		</div>
  </div>);
};

export default Landing;
