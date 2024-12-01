import express from 'express';
import Task from '../models/task.js';
export const tasks=async(req,res) => {
    const { title, description, status } = req.body;
    
    try {
      const task = new Task({
        title,
        description,
        status,
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}
export const findd=async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}
export const editt=async (req, res) => {
    const { title, description, status } = req.body;
  
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status },
        { new: true }
      );
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}