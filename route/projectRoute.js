import express from 'express';
import {
    createProject,
    updateProject,
    deleteProject,
    removeParticipant
} from '../controller/projectController.js';

const projectRouter = express.Router();


projectRouter.post('/add', createProject);

projectRouter.put('/projects/:id', updateProject);

projectRouter.delete('/projects/:id', deleteProject);

projectRouter.delete('/projects/:projectId/participants/:userId', removeParticipant);

export {projectRouter};
