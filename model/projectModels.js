import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['In Progress', 'Done', 'Warning'],
        default: 'In Progress',
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    tasks: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }]
}, { minimize: false });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
