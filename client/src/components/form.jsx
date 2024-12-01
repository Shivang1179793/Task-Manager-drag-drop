import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Form = ({ taskId, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');

  // If editing a task, fetch the task details
  useEffect(() => {
    if (taskId) {
      axios.get(`https://task-manager-drag-drop.onrender.com/${taskId}`)
        .then(response => {
          const task = response.data;
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
        })
        .catch(err => console.error('Error fetching task:', err));
    } else {
      // Reset the form if no taskId is provided (i.e., for creating a new task)
      setTitle('');
      setDescription('');
      setStatus('Open'); }
  }, [taskId]);

  // Handle form submission for creating or updating a task
  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description, status };
    console.log(taskId);
    if (taskId) {
      // Edit task if taskId is provided
      axios.put(`https://task-manager-drag-drop.onrender.com/${taskId}`, taskData)
        .then(response => {
          onSave(response.data); // Update task in the list
        })
        .catch(err => console.error('Error updating task:', err));
    } else {
      // Create new task
      axios.post(`https://task-manager-drag-drop.onrender.com/api/tasks`, taskData)
        .then(response => {
          onSave(response.data); // Add new task to the list
        })
        .catch(err => console.error('Error creating task:', err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="In-progress">In-progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit">{taskId ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default Form; 