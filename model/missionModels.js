import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
    missionName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    creationTime: { type: Date, default: Date.now },
    estimatedCompletionTime: { type: Date },
    actualCompletionTime: { type: Date, default: null },
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            role: { type: String, required: true }
        }
    ],
    creator: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        username: { type: String, required: true }
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
}, { minimize: false });

const missionModel = mongoose.models.mission || mongoose.model("mission", missionSchema);
export default missionModel;
