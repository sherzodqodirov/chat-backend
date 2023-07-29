import express from "express";
import {createChat, getMessages, UploadMessages} from "../controllers/ChatController.js";
import multer from "multer";
import path from "path";
import {GridFsStorage} from "multer-gridfs-storage";

const router=express.Router();

/*const storage = multer.diskStorage({
    destination: './fileMessages',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});*/
const url=process.env.DB_URL
const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
        return {
            filename: 'file_' + Date.now()
        };
    }
});
const upload = multer({ storage })


router.post("/",createChat)
router.post("/upload",upload,UploadMessages)
router.get("/",getMessages)
export default router