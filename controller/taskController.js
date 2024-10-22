import taskModel from "../model/taskModels.js";
import missionModel from "../model/missionModels.js";

export const createTask = async (req, res) => {
    try {
        const { taskName, description, missionId, status, assignedMembers, creator } = req.body;
        if (!taskName || !description || !missionId || !status || !assignedMembers || !creator) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const mission = await missionModel.findById(missionId);
        if (!mission) {
            return res.status(404).json({ message: "Mission not found" });
        }
        const participantIds = mission.participants.map(p => p.userId.toString());
        const assignedMemberIds = assignedMembers.map(member => member.userId);

        for (const memberId of assignedMemberIds) {
            if (!participantIds.includes(memberId)) {
                return res.status(400).json({ message: `User ${memberId} is not a participant of the mission` });
            }
        }

        const newTask = new taskModel({
            taskName,
            description,
            missionId,
            status,
            assignedMembers,
            creator
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { taskName, description, newAssignedMember, status } = req.body;

    try {
        const updateData = {};
        if (taskName) updateData.taskName = taskName;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (newAssignedMember) {
            updateData.$addToSet = { assignedMembers: newAssignedMember };
        }
        const updatedTask = await taskModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeParticipant = async (req, res) => {
    const { taskId, userId } = req.params;
    try {
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.assignedMembers = task.assignedMembers.filter((p) => p.userId.toString() !== userId);
        await task.save();

        res.status(200).json({ message: 'Participant removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
