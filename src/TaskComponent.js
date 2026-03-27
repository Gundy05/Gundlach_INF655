import React, { useState } from 'react';

function TaskComponent({ tasks, deleteTask }) {
  const [search, setSearch] = useState('');
  const [sorted, setSorted] = useState(false);

  const filteredTasks = tasks
    .filter((task) => task.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sorted ? a.localeCompare(b) : 0));

  return (
    <div>
      <h2>Tasks</h2>

      <input
        type="text"
        placeholder="Search Tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setSorted(true)}>Sort by Name</button>

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index}>
            {task}
            <button
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  deleteTask(task); // delete by value, not index
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskComponent;
