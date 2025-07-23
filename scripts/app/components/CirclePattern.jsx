import React from 'react';
const CirclePattern = () => {
    return (<svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" stroke="currentColor" className="opacity-20 select-none pointer-events-none">
      <circle cx="400" cy="400" r="200" fill="none" strokeWidth="2"/>
      <circle cx="400" cy="400" r="300" fill="none" strokeWidth="2"/>
      <circle cx="400" cy="400" r="400" fill="none" strokeWidth="2"/>
      <circle cx="400" cy="400" r="100" fill="none" strokeWidth="2"/>
      <circle cx="200" cy="200" r="50" fill="none" strokeWidth="2"/>
      <circle cx="600" cy="200" r="50" fill="none" strokeWidth="2"/>
      <circle cx="200" cy="600" r="50" fill="none" strokeWidth="2"/>
      <circle cx="600" cy="600" r="50" fill="none" strokeWidth="2"/>
    </svg>);
};
export default CirclePattern;
