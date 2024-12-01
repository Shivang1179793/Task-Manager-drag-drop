import React, { useState } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TaskList = ({ tasks, setTasks }) => {
  const statuses = ["Open", "Work In Progress", "Completed"];

  const updateTaskStatus = async (id, status) => {
    await axios.put(`http://localhost:5001/api/tasks/${id}`, { status });
    setTasks((prev) =>
      prev.map((task) =>
        task._id === id ? { ...task, status: status } : task
      )
    );
  };

  const updateTaskDetails = async (id, updatedTask) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${id}`,
        updatedTask
      );
      const updatedTaskFromServer = response.data;
  
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, ...updatedTaskFromServer } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            updateTaskStatus={updateTaskStatus}
            updateTaskDetails={updateTaskDetails}
          />
        ))}
      </div>
    </DndProvider>
  );
};

const TaskColumn = ({ status, tasks, updateTaskStatus, updateTaskDetails }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => updateTaskStatus(item.id, status),
  });

  return (
    <div
      ref={drop}
      style={{
        width: "30%",
        padding: "10px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
      }}
    >
      <h3>{status}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          updateTaskDetails={updateTaskDetails}
        />
      ))}
    </div>
  );
};

const TaskCard = ({ task, updateTaskDetails }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateTaskDetails(task._id, editedTask);
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      style={{
        margin: "8px 0",
        padding: "10px",
        backgroundColor: isDragging ? "#d3d3d3" : "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleInputChange}
          >
            <option value="Open">Open</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
