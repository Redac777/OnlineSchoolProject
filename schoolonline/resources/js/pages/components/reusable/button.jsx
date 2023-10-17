import React from 'react';

const Button = ({ svgContent, buttonText, onClick, type,variableClassName,...rest }) => {
    return (
      <button
        onClick={onClick}
        type={type}
        className={`relative inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none ${variableClassName}`}
        {...rest}
      >
        {svgContent}
        <span className="button-text">{buttonText}</span>
      </button>
    );
  };    

  export default Button;
