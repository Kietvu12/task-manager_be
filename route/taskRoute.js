import express from 'express';
import {
    createTask,
    updateTask,
    deleteTask,
    removeParticipant
} from '../controller/taskController.js';

const taskRouter = express.Router();
taskRouter.post('/missions/:missionId/tasks', createTask);
taskRouter.put('/tasks/:id', updateTask);
taskRouter.delete('/tasks/:id', deleteTask);
taskRouter.delete('/tasks/:taskId/participants/:userId', removeParticipant);

export {taskRouter}
