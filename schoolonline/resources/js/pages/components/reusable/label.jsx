import React from 'react';

const Label = ({variableClassName,forName,labelText }) => {
  const inputClassName = `block mb-2 text-sm font-medium text-gray-700 dark:text-white ${variableClassName}`;
  return (
    <label
      for = {forName} className = {inputClassName}>
      {labelText}
    </label>
  );
};

export default Label;
