import React from 'react';
import Greeting from './Greeting';
import UserInfo from './UserInfo';
import TaskComponent from './TaskComponent';

function App() {
  const tasks = [
    'Complete React assignment',
    'Review JSX concepts',
    'Practice class components',
    'Build a new React feature',
    'Refactor existing components',
  ];

  function getRandomTask() {
    const index = Math.floor(Math.random() * tasks.length);
    return tasks[index];
  }

  const randomTask = getRandomTask();

  return (
    <div>
      <Greeting />
      <UserInfo />
      <TaskComponent task={randomTask} />
    </div>
  );
}

export default App;
