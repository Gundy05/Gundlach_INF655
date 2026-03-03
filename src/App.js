import React from 'react';
import Greeting from './Greeting';
import UserInfo from './UserInfo';
import TaskComponent from './TaskComponent';
import Counter from './Counter';
import TaskForm from './TaskForm';

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

  function handleAlert() {
    alert('Button clicked from UserInfo component!');
  }

  return (
    <div>
      <Greeting username="Alice" />
      <Greeting username="Bob" />

      <UserInfo handleClick={handleAlert} />

      <TaskComponent task={randomTask} />

      <Counter />

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>

      <TaskForm />
    </div>
  );
}

export default App;
