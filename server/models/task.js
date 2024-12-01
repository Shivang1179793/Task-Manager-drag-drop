// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Work In Progress", "Completed"],
      default: "Open",
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
