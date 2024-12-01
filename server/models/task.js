import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In-progress', 'Completed'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{ timestamps: true });
const Task = mongoose.model("Task", taskSchema);
export default Task;