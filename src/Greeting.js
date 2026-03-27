import React, { useState } from 'react';

function Greeting({ username }) {
  const [greeting, setGreeting] = useState(`Hello, ${username}!`);
  const today = new Date().toLocaleDateString();

  function changeGreeting() {
    setGreeting(`Welcome, ${username}!`);
  }

  return (
    <div>
      <h1>{greeting}</h1>
      <p style={{ color: 'blue', fontSize: '18px' }}>
        Today's date: {today}
      </p>
      <button onClick={changeGreeting}>Change Greeting</button>
    </div>
  );
}

export default Greeting;
