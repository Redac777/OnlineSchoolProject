import React from 'react';

const Input = ({variableClassName,type,name, value, onChange,...rest }) => {
  const inputClassName = `bg-main-bg border-0 border-b border-gray-400 text-gray-900 focus:outline-none text-sm w-72 ${variableClassName}`;
  return (
    <input
      type={type}
      name={name}
      className={inputClassName}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
