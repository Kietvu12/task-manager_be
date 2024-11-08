import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    getProjects, getProjectParticipants, addProject, updateProject, deleteProject, 
    addUserToProject, addTaskToProject, removeUserFromProject
} from '../controller/projectController.js';

const projectRouter = express.Router();

projectRouter.get('/projects', authMiddleware, getProjects);
projectRouter.get('/projects/:projectId/participants', authMiddleware, getProjectParticipants);
projectRouter.post('/projects', authMiddleware, addProject);
projectRouter.put('/projects/:projectId', authMiddleware, updateProject);
projectRouter.delete('/projects/:projectId', authMiddleware, deleteProject);
projectRouter.post('/projects/:projectId/addUser', authMiddleware, addUserToProject);
projectRouter.post('/projects/:projectId/addTask', authMiddleware, addTaskToProject);
projectRouter.delete('/projects/:projectId/removeUser', authMiddleware, removeUserFromProject);
export {projectRouter}
