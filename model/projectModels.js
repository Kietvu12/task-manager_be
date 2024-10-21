import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            role: { type: String, required: true }
        }
    ],
    creationTime: { type: Date, default: Date.now },
    estimatedCompletionTime: { type: Date },
    actualCompletionTime: { type: Date, default: null },
    creator: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        username: { type: String, required: true }
    },
    missions: [{ type: mongoose.Schema.Types.ObjectId, ref: "mission" }]
}, { minimize: false });

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;
