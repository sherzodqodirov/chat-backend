import MessageModel from "../models/MessageModel.js";

export const createChat = async (req, res, next) => {

    try {
        const {sender, receiver, content} = req.body
        const errors = {};

        if (!sender) {
            errors.sender = {message: 'sender is required'};
        }
        if (!receiver) {
            errors.receiver = {message: 'receiver is required'};
        }
        if (!content) {
            errors.content = {message: 'content is required'};
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }


        const chatDataText= await MessageModel.create({
            sender,
            receiver,
            content,
            contentType:"text"
        })
        res.status(201).json({message:"ok"});

    } catch (err) {
        res.status(500).json(err);
    }
}
export const UploadMessages = async (req, res, next) => {

    try {
        const {sender, receiver} = req.body
        const errors = {};

        if (!sender) {
            errors.sender = {message: 'sender is required'};
        }
        if (!receiver) {
            errors.receiver = {message: 'receiver is required'};
        }
        if (!req.file) {
            errors.file = {message: 'Image file is required'};
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }


        const chatDataFile= await MessageModel.create({
            sender,
            receiver,
            content:`http://localhost:${process.env.PORT}/static/${req.file.filename}`,
            contentType:"file"
        })
        res.status(201).json({message: "ok"});
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getMessages =async (req, res) =>{
    try {
        const {senderId,receiverId}=req.query

        const errors={}
        if (!senderId || !receiverId) {
            errors.message ="sender or receiver id error"
        }
        if (errors.message){
            return res.status(400).json(errors);
        }



        const messages = await MessageModel.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        return res.status(200).json(messages)
    }
    catch (e) {
        res.status(500).json({ error: "An error occurred while fetching messages." });
    }
}