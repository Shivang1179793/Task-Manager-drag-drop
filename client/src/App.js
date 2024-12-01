import React, { useState } from 'react';
import List from './components/list'; // Correct import for List
import Form from './components/form'; // Correct import for Form

const App = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Edit task handler
  const handleEditTask = (taskId) => {
    setSelectedTaskId(taskId); // Set the taskId for editing
  };

  // Save task handler (for both new and updated tasks)
  const handleSaveTask = (task) => {
    setTasks(prevTasks => {
      if (task._id) {
        // Update existing task
        const updatedTasks = prevTasks.map(t => t._id === task._id ? task : t);
        return updatedTasks;
      } else {
        // Add new task
        return [...prevTasks, task];
      }
    });
    setSelectedTaskId(null); // Clear selected task ID
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <Form taskId={selectedTaskId} onSave={handleSaveTask} />
      <List tasks={tasks} onEditTask={handleEditTask} onUpdateTasks={setTasks} />
    </div>
  );
};

export default App;