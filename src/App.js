import React, { useState } from 'react';
import Greeting from './Greeting';
import UserInfo from './UserInfo';
import TaskComponent from './TaskComponent';
import Counter from './Counter';
import TaskForm from './TaskForm';

function App() {
  const [tasks, setTasks] = useState([
    'Complete React assignment',
    'Review JSX concepts',
    'Practice class components',
    'Build a new React feature',
    'Refactor existing components',
  ]);

  function addTask(newTask) {
    setTasks([...tasks, `${newTask.name} — ${newTask.desc}`]);
  }

  function deleteTask(taskToDelete) {
    setTasks(tasks.filter((task) => task !== taskToDelete));
  }

  function handleAlert() {
    alert('Button clicked from UserInfo component!');
  }

  return (
    <div>
      <Greeting username="Alice" />
      <Greeting username="Bob" />

      <UserInfo handleClick={handleAlert} />

      <TaskComponent tasks={tasks} deleteTask={deleteTask} />

      <Counter />

      <TaskForm addTask={addTask} />
    </div>
  );
}

export default App;
