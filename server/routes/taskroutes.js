// routes/taskRoutes.js
import express from "express";
import {tasks,findd,updated} from "../controllers/taskk.js";
const router = express.Router();

// Create Task
router.post("/tasks", tasks);

// Get All Tasks
router.get("/tasks", findd);

// Update Task
router.put("/tasks/:id",updated);

export default router
