import express from 'express';
import {
    createMission,
    updateMission,
    deleteMission,
    removeParticipant
} from '../controller/missionController.js';

const missionRouter = express.Router();

missionRouter.post('/projects/:projectId/missions', createMission);

missionRouter.put('/missions/:id', updateMission);

missionRouter.delete('/missions/:id', deleteMission);

missionRouter.delete('/missions/:missionId/participants/:userId', removeParticipant);

export {missionRouter};
