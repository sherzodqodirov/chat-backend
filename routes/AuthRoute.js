import { Router } from 'express';
import {allUsers, loginUser, oneUser, registerUser} from '../controllers/AuthControllers.js';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: './assets',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage }).single('profilePicture');

router.post('/register', upload, registerUser);
router.post('/login', loginUser);
router.get('/users/:id',allUsers)
router.get('/user/:id',oneUser)
export default router;
