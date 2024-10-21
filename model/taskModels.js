import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            username: { type: String, required: true },
            commentDate: { type: Date, default: Date.now },
            content: { type: String, required: true }
        }
    ],
    status: { type: String, enum: ['todo', 'doing', 'done', 'pending'], required: true },
    creationTime: { type: Date, default: Date.now },
    estimatedCompletionTime: { type: Date },
    actualCompletionTime: { type: Date, default: null },
    assignedMembers: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            username: { type: String, required: true }
        }
    ],
    creator: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        username: { type: String, required: true }
    }
}, { minimize: false });

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);
export default taskModel;
