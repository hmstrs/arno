import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import './NavLink.css';

function NavLink({ back, location, to, children, className = '', ...props }) {
  const active = location.pathname === to;
  return (
    <LinkContainer
      to={{
        pathname: back && active ? location.state.from.pathname : to,
        state: {
          from: location
        }
      }}
      {...props}
    >
      <Button variant="link" className={`${className} ${active ? 'active' : ''}`}>
        {children}
      </Button>
    </LinkContainer>
  );
}

export default withRouter(NavLink);
