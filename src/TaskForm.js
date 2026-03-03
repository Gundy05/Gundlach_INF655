import React, { useState } from 'react';

function TaskForm() {
  const [task, setTask] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('New Task:', task);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Task Name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
