import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const DraggableTask = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const DroppableColumn = ({ id, children, style }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const List = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios.get(`https://task-manager-drag-drop.onrender.com/api/tasks`)
      .then(response => setTasks(response.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, [tasks]);

  const groupedTasks = {
    Open: tasks.filter(task => task.status === 'Open'),
    'In-progress': tasks.filter(task => task.status === 'In-progress'),
    Completed: tasks.filter(task => task.status === 'Completed'),
  };

  const handleDragStart = (event) => {
    const taskId = event.active.id;
    setActiveTask(tasks.find(task => task._id === taskId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const sourceStatus = activeTask.status;
    const targetStatus = over.id;

    if (sourceStatus !== targetStatus) {
      // Update the task status in the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === active.id ? { ...task, status: targetStatus } : task
        )
      );

      // Update the task status on the backend
      axios
        .put(`https://task-manager-drag-drop.onrender.com/api/tasks/${active.id}`, { status: targetStatus })
        .catch((err) => console.error('Error updating task:', err));
    }

    setActiveTask(null);
  };

  // Editing logic for task title and description
  const handleEditChange = (e, taskId, field) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, [field]: e.target.value } : task
      )
    );
  };
  const handleSaveEdit = (taskId) => {
    const taskToUpdate = tasks.find(task => task._id === taskId);
    axios
      .put(`https://task-manager-drag-drop.onrender.com/api/tasks/${taskId}`, taskToUpdate)
      .catch((err) => console.error('Error saving task:', err));
  };

  useEffect(() => {
    console.log('Component re-rendered due to editing:', editing);
  }, [editing]);
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h2 style={{ textAlign: 'center' }}>Task List</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Loop through status categories */}
        {['Open', 'In-progress', 'Completed'].map((status) => (
          <DroppableColumn
            key={status}
            id={status}
            style={{
              width: '30%',
              minHeight: '300px',
              backgroundColor: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{status}</h3>
            {/* Map through tasks of the respective status */}
            {groupedTasks[status]?.map((task) => (
              <DraggableTask key={task._id} id={task._id}>
                <div
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                  }}
                >
                  {/* Editable title */}
                  <input type="text" value={task.title || ''} // Ensure a fallback for undefined
                    onFocus={() => setEditing((prev) => !prev)}
                    onChange={(e) => handleEditChange(e, task._id, 'title')} style={{ width: '100%', padding: '5px', marginBottom: '5px', border: '1px solid #ddd', borderRadius: '5px' }} />
                  <textarea
                    value={task.description || ''}
                    onFocus={() => setEditing((prev) => !prev)}
                    onChange={(e) => handleEditChange(e, task._id, 'description')}
                    rows="4"
                    style={{ width: '100%', padding: '5px', marginBottom: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                  <p>Status: {task.status}</p>
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Save Edit
                  </button>
                </div>
              </DraggableTask>
            ))}
          </DroppableColumn>
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4>{activeTask.title}</h4>
            <p>{activeTask.description}</p>
            <p>Status: {activeTask.status}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default List;