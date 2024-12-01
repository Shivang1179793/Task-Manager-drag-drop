import express from 'express';
import {tasks,findd,editt} from "../controllers/taskk.js";
const router = express.Router();
// Create Task
router.post('/tasks', tasks);
// Get all tasks
router.get('/tasks',findd);
// Edit Task
router.put('/tasks/:id',editt);
export default router;