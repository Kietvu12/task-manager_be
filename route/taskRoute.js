import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    getTasks, getTaskParticipants, updateTask, deleteTask, addUserToTask, updateStatus, removeUserFromTask
} from '../controller/taskController.js';

const taskRouter = express.Router();

taskRouter.get('/tasks', authMiddleware, getTasks);
taskRouter.get('/tasks/:taskId/participants', authMiddleware, getTaskParticipants);
taskRouter.put('/tasks/:taskId', authMiddleware, updateTask);
taskRouter.delete('/tasks/:taskId', authMiddleware, deleteTask);
taskRouter.post('/tasks/:taskId/addUser', authMiddleware, addUserToTask);
taskRouter.put('/tasks/:taskId/status', authMiddleware, updateStatus);
taskRouter.delete('/tasks/:taskId/removeUser', removeUserFromTask)


export {taskRouter}
