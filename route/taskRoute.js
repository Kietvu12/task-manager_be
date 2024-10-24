import express from 'express';
import {
    createTask,
    updateTask,
    deleteTask,
    removeParticipant
} from '../controller/taskController.js';
import authMiddleware from '../middleware/auth.js';

const taskRouter = express.Router();
taskRouter.post('/missions/:missionId/tasks', authMiddleware, createTask);
taskRouter.put('/tasks/:id', authMiddleware, updateTask);
taskRouter.delete('/tasks/:id', authMiddleware, deleteTask);
taskRouter.delete('/tasks/:taskId/participants/:userId', authMiddleware, removeParticipant);

export {taskRouter}
