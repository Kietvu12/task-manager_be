import express from 'express';
import {
    createProject,
    updateProject,
    deleteProject,
    removeParticipant,
    getTasksByProject
} from '../controller/projectController.js';
import authMiddleware from '../middleware/auth.js';

const projectRouter = express.Router();


projectRouter.post('/add', authMiddleware, createProject);

projectRouter.put('/projects/:id', authMiddleware, updateProject);

projectRouter.delete('/projects/:id',authMiddleware, deleteProject);

projectRouter.delete('/projects/:projectId/participants/:userId', authMiddleware, removeParticipant);

projectRouter.get('/projects/:projectId/tasks', authMiddleware, getTasksByProject);



export {projectRouter};
