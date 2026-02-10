import React from 'react';

function Greeting() {
  const today = new Date().toLocaleDateString();
  const paragraphStyle = {
    color: 'blue',
    fontSize: '18px',
  };

  return (
    <div>
      <h1>Hello, Welcome to React!</h1>
      <p style={paragraphStyle}>
        Today&apos;s date is: {today}
      </p>
    </div>
  );
}

export default Greeting;
