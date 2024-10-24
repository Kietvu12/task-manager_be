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

        // Kiểm tra các trường bắt buộc
        if (!missionName || !description || !projectId || !participants || !creator || !creator.userId || !creator.username) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Tìm project bằng projectId
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Kiểm tra tính hợp lệ của participants
        const participantIds = participants.map(participant => participant.userId.toString());
        const projectParticipants = project.participants.map(p => p.userId.toString());
        const isValidParticipants = participantIds.every(id => projectParticipants.includes(id));

        if (!isValidParticipants) {
            return res.status(400).json({ message: "Some participants are not part of the project" });
        }

        // Tạo mission mới
        const newMission = new missionModel({
            missionName,
            description,
            participants,
            estimatedCompletionTime,
            creator,
            image,
        });

        // Lưu mission mới vào cơ sở dữ liệu
        await newMission.save();

        // Thêm mission vào dự án cha
        project.missions.push(newMission._id);
        await project.save();

        // Trả về thông tin mission mới đã tạo
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
