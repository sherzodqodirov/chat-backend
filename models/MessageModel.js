import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
    {
        receiver: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        }
    },
    {timestamps: true,}
)

const MessageModel = mongoose.model("message", MessageSchema);

export default MessageModel
