import missionModel from "../model/missionModels.js";
import projectModel from "../model/projectModels.js";
import taskModel from "../model/taskModels.js";
import userModel from "../model/userModels.js";


export const createProject = async (req, res) => {
    try {
        const { projectName, description, image, participants, estimatedCompletionTime, creator } = req.body;
        if (!projectName || !description || !participants || !creator || !creator.userId || !creator.username) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const participantIds = participants.map(participant => participant.userId);
        const existingUsers = await userModel.find({ _id: { $in: participantIds } });
        
        if (existingUsers.length !== participantIds.length) {
            return res.status(400).json({ message: "Some participants do not exist" });
        }


        const creatorExists = await userModel.findById(creator.userId);
        if (!creatorExists) {
            return res.status(400).json({ message: "Creator does not exist" });
        }

        const newProject = new projectModel({
            projectName,
            description,
            image,
            participants,
            estimatedCompletionTime,
            creator
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { projectName, description, image, participants, estimatedCompletionTime } = req.body;

    try {
        const updatedProject = await projectModel.findByIdAndUpdate(
            id,
            {
                projectName,
                description,
                image,
                participants,
                estimatedCompletionTime
            },
            { new: true }
        );

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {

        await missionModel.deleteMany({ projectId: id });
        await taskModel.deleteMany({ projectId: id });

        await projectModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeParticipant = async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.participants = project.participants.filter((p) => p.userId.toString() !== userId);
        await project.save();

        await missionModel.updateMany(
            { projectId, "participants.userId": userId },
            { $pull: { participants: { userId } } }
        );
        await taskModel.updateMany(
            { projectId, "participants.userId": userId },
            { $pull: { participants: { userId } } }
        );

        res.status(200).json({ message: "Participant removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
