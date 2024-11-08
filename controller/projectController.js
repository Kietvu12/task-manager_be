import Project from '../model/projectModels.js'
import Task from '../model/taskModels.js'
import userModel from '../model/userModels.js'

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching projects" });
    }
};

export const getProjectParticipants = async (req, res) => {
    const { projectId } = req.params;
    console.log(projectId);
    
    try {
        const project = await Project.findById(projectId).populate('participants', 'name email');
        res.json({ success: true, participants: project.participants });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching participants" });
    }
};

export const addProject = async (req, res) => {
    const { name, description, dueDate, createdBy, participantIds } = req.body;

    try {
        const creator = await userModel.findById(createdBy);
        console.log(req.body);
        if (!creator) {
            console.log("Creator Not Found");
            return res.status(404).json({ success: false, message: "Creator not found" });
        }
        
        const participants = await userModel.find({ _id: { $in: participantIds } });
        const participantIdsSet = new Set(participants.map(user => user._id.toString()));
        const newProject = new Project({
            name,
            description,
            dueDate,
            createdBy,
            participants: [createdBy, ...Array.from(participantIdsSet)] 
        });

        await newProject.save();
        res.json({ success: true, project: newProject });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating project" });
    }
};
export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, description, dueDate, status } = req.body; // Không lấy participants từ req.body
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (name) project.name = name;
        if (description) project.description = description;
        if (dueDate) project.dueDate = dueDate;
        if (status) project.status = status;

        await project.save();
        res.json({ success: true, project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating project" });
    }
};


export const deleteProject = async (req, res) => {
    const { projectId } = req.params; 
    console.log("Deleting project ID:", projectId);
    
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" }); // Nếu không tìm thấy dự án
        }
        await Task.deleteMany({ project: projectId });

        await Project.findByIdAndDelete(projectId);

        res.json({ success: true, message: "Project and associated tasks deleted" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ success: false, message: "Error deleting project" }); // Nếu có lỗi
    }
};

export const addUserToProject = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.body.userId && req.body.userId.trim() ? req.body.userId : req.user.id; 
    console.log("UserId:", userId);
    
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        
        if (project.participants.includes(userId)) {
            return res.json({ success: false, message: "User already in project" });
        }
        
        project.participants.push(userId);
        await project.save();
        res.json({ success: true, project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding user to project" });
    }
};


export const removeUserFromProject = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.body.userId || req.user._id; 
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const index = project.participants.indexOf(userId);
        if (index === -1) {
            return res.json({ success: false, message: "User not in project" });
        }
        project.participants.splice(index, 1);
        await project.save();
        res.json({ success: true, project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing user from project" });
    }
};
export const addTaskToProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, description, dueDate, createdBy, participantIds } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const participants = await userModel.find({ _id: { $in: participantIds } });
        const participantIdsSet = new Set(participants.map(user => user._id.toString()));
        const newTask = new Task({
            name,
            description,
            dueDate,
            createdBy,
            project: projectId,
            participants: [createdBy, ...participantIdsSet]
        });

        await newTask.save();
        project.tasks.push(newTask._id);
        await project.save();

        res.json({ success: true, task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating task" });
    }
};
