import React, { useState } from 'react';

function TaskComponent({ tasks, deleteTask }) {
  const [search, setSearch] = useState('');
  const [sorted, setSorted] = useState(false);

  const filteredTasks = tasks
    .filter((task) =>
      (task.taskName + ' ' + task.taskDescription)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => (sorted ? a.taskName.localeCompare(b.taskName) : 0));

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
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.taskName}</strong> — {task.taskDescription}
            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: '8px' }}
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
