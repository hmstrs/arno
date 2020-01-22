import React from 'react';
import { Button } from 'react-bootstrap';


import './Profile.css';

const Profile = props => {
  const onSubmit = () => {
    localStorage.removeItem('token')
    window.location.reload(false);
  };

  return (
		<Button
			onClick={onSubmit}
			variant="link"
			size="lg"
			className="button-logout"
		>
			<span className="button-text text-logout">Выйти</span>
		</Button>
  );
};
export default Profile;
