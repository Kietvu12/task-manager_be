import missionModel from "../model/missionModels.js";
import projectModel from "../model/projectModels.js";
import taskModel from "../model/taskModels.js";

export const createMission = async (req, res) => {
    try {
        const {
            missionName,
            description,
            projectId,
            participants,
            estimatedCompletionTime,
            creator,
            image,
        } = req.body;

        if (!missionName || !description || !projectId || !participants || !creator || !creator.userId || !creator.username) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const participantIds = participants.map(participant => participant.userId);
        const projectParticipants = project.participants.map(p => p.userId.toString());

        const isValidParticipants = participantIds.every(id => projectParticipants.includes(id));
        if (!isValidParticipants) {
            return res.status(400).json({ message: "Some participants are not part of the project" });
        }

    
        const newMission = new missionModel({
            missionName,
            description,
            projectId,
            participants,
            estimatedCompletionTime,
            creator,
            image,
        });

        await newMission.save();
        res.status(201).json(newMission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMission = async (req, res) => {
    const { id } = req.params;
    try {
        await taskModel.deleteMany({ missionId: id });
        await missionModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Mission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMission = async (req, res) => {
    const { id } = req.params;
    const { missionName, description, newParticipant, estimatedCompletionTime, image } = req.body;

    try {
        const updateData = {};
        if (missionName) updateData.missionName = missionName;
        if (description) updateData.description = description;
        if (estimatedCompletionTime) updateData.estimatedCompletionTime = estimatedCompletionTime;
        if (image) updateData.image = image;

       
        if (newParticipant) {
            updateData.$addToSet = { participants: newParticipant };
        }

       
        const updatedMission = await missionModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMission) {
            return res.status(404).json({ message: "Mission not found" });
        }

        res.status(200).json(updatedMission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeParticipant = async (req, res) => {
    const { missionId, userId } = req.params;
    try {
        const mission = await missionModel.findById(missionId);
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }
        mission.participants = mission.participants.filter((p) => p.userId.toString() !== userId);
        await mission.save();
        await taskModel.updateMany(
            { missionId, "participants.userId": userId },
            { $pull: { participants: { userId } } }
        );

        res.status(200).json({ message: 'Participant removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
