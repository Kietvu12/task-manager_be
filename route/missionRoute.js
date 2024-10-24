import express from 'express';
import {
    createMission,
    updateMission,
    deleteMission,
    removeParticipant
} from '../controller/missionController.js';
import authMiddleware from '../middleware/auth.js';

const missionRouter = express.Router();

missionRouter.post('/projects/:projectId/missions',authMiddleware, createMission);

missionRouter.put('/missions/:id', authMiddleware, updateMission);

missionRouter.delete('/missions/:id', authMiddleware, deleteMission);

missionRouter.delete('/missions/:missionId/participants/:userId', authMiddleware, removeParticipant);



export {missionRouter};
