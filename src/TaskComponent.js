import React from 'react';

function TaskComponent({ task }) {
  return (
    <div>
      <h2>Random Task</h2>
      <h3>{task}</h3>
    </div>
  );
}

export default TaskComponent;
