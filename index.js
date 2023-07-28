import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { Server } from "socket.io";
// Routes
import AuthRoute from './routes/AuthRoute.js';
import ChatRoute from "./routes/ChatRoute.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.set('strictQuery', false);


// Serve static images from the assets folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'fileMessages')));

app.get('/', (req, res) => res.status(200).json({ message: 'MERN Chat server' }));

app.use('/auth', AuthRoute);
app.use('/chat', ChatRoute);

startServer();

async function startServer() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const server=app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});


//socket io
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
       io.emit('res',data)
    });
    socket.on("disconnect", () => {
        console.log(socket.id,"disconnect")
    })
});