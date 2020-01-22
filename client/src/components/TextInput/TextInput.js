import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

const TextInput = ({
  style,
  className,
  type,
  error,
  name,
  placeholder,
  value,
  onChange
}) => {
  return (
    <Fragment>
      <input
        type={type}
        style={style}
        className={`form-control form-text ${className ? className : ''}`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <div className="is-invalid">{error} </div>}
    </Fragment>
  );
};
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
TextInput.defaultProps = {
  type: 'text'
};
export default TextInput;
