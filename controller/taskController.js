import Project from '../model/projectModels.js';
import Task from '../model/taskModels.js'


export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('participants', 'name email');
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tasks" });
    }
};

export const getTaskParticipants = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId).populate('participants', 'name email');
        console.log(task);
        
        res.json({ success: true, participants: task.participants });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching participants" });
    }
};


export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { name, description, dueDate, status } = req.body;
    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, $or: [{ createdBy: req.body.userId }, { project: req.body.userId }] },
            { name, description, dueDate, status },
            { new: true }
        );
        if (!task) return res.status(403).json({ success: false, message: "Not authorized" });
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task" });
    }
};
export const updateStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.body.userId && req.body.userId.trim() ? req.body.userId : req.user.id;
    const validStatuses = ["Pending", "To do", "Doing", "Done", "Cancel"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }
    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, $or: [{ createdBy: userId }, { project: userId }] },
            { status },
            { new: true, fields: { status: 1 } } 
        );
        console.log(userId, task);
        if (!task) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, status: task.status });
    } catch (error) {
        console.log("Lỗi", error);
        res.status(500).json({ success: false, message: "Error updating task status" });
    }
};

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findOneAndDelete({
            _id: taskId, 
            $or: [{ createdBy: req.body.userId }, { project: req.body.userId }]
        });
        if (!task) return res.status(403).json({ success: false, message: "Not authorized" });
        res.json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting task" });
    }
};

export const addUserToTask = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.body.userId && req.body.userId.trim() ? req.body.userId : req.user.id;
    try {
        const task = await Task.findById(taskId).populate('project');
        if (!task.project.participants.includes(userId)) {
            return res.status(403).json({ success: false, message: "User not in project" });
        }
        if (task.participants.includes(userId)) {
            return res.json({ success: false, message: "User already in task" });
        }
        task.participants.push(userId);
        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding user to task" });
    }
};
export const removeUserFromTask = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.body.userId || req.user._id;
    try {
        const task = await Project.findById(taskId);
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"})
        }
        const index = task.participants.indexOf(userId);
        if (index === -1){
            return res.json({ success: false, message: "User not in task" });
        }
        task.participants.splice(index, 1);
        await project.save();
        req.json({success: true, task});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing user from project" });
    }
}