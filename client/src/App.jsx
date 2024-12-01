import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskList from "./TaskList";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Open",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5001/api/tasks");
    setTasks(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/tasks", newTask);
      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: "", description: "", status: "Open" }); // Reset form
    } catch (err) {
      console.error("Error creating task:", err.message);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Form for Creating Task */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Enter Title"
          required
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Enter Description"
          required
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleInputChange}
        >
          <option value="Open">Open</option>
          <option value="Work In Progress">Work In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Display Task List */}
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default App;
