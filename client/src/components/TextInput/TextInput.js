import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

const TextInput = ({
  style,
  className,
  type,
  name,
  placeholder,
  value,
  onChange
}) => (
  <input
    type={type}
    style={style}
    className={`form-control form-text ${className ? className : ''}`}
    placeholder={placeholder}
    name={name}
    value={value}
    onChange={onChange}
  />
);
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
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
