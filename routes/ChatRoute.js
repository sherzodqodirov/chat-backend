import express from "express";
import {createChat, getMessages, UploadMessages} from "../controllers/ChatController.js";
import multer from "multer";
import path from "path";

const router=express.Router();

const storage = multer.diskStorage({
    destination: './fileMessages',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage }).single('content');


router.post("/",createChat)
router.post("/upload",upload,UploadMessages)
router.get("/",getMessages)
export default router