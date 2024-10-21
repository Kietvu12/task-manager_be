import express from 'express';
import {
    createMission,
    updateMission,
    deleteMission,
    removeParticipant
} from '../controller/missionController.js';

const missionRouter = express.Router();

// Route tạo mới Mission
missionRouter.post('/projects/:projectId/missions', createMission);

// Route cập nhật Mission
missionRouter.put('/missions/:id', updateMission);

// Route xóa Mission (và các Task liên quan)
missionRouter.delete('/missions/:id', deleteMission);

// Route xóa participant khỏi Mission và đồng bộ Task
missionRouter.delete('/missions/:missionId/participants/:userId', removeParticipant);

export {missionRouter};
