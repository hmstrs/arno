import React from 'react';
import spinner from '../../assets/spinner.gif';
export default () => (
  <div>
    <img
      src={spinner}
      style={{ width: '50px', margin: 'auto', display: 'block' }}
      alt="Loading"
    />
  </div>
);
