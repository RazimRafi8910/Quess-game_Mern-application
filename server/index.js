import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import appRoutes from './routes/appRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import DBconnection from './utils/DBconnection.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import errorHandler from './middleware/errorHandler.js'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import { createServer } from 'http'
import { Lobby } from './game/Lobby.js'
import { Server } from 'socket.io'
import { initializeSocket } from './socket/socketManager.js'

const app = express()
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ["GET", "POST", "DELETE"],
    }
});

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 60,
    message: "too many request from this IP"
});

app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(limiter);
app.use(morgan(':remote-addr [:date[web]] :remote-user :method :url :status :response-time ms',))
// app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
    methods: ["GET", "POST","DELETE"],
}))

//connect mongodb database
DBconnection()

//routs
app.use('/', appRoutes)
app.use('/admin', adminRoutes)
app.use('/game', gameRoutes)

//initailze game lobby
const game = new Lobby(io);
app.set('lobby', game);

//initailze socket
initializeSocket(io, game);

//io.on('connection',(socket)=>{ socket.leave })

//404
app.all('*', (req, res) => {
    console.log(`[invalid url] from ${req.ip}`);
    res.status(404).json({ message: "incvalid Url path" });
})

//error handler
app.use(errorHandler);

httpServer.listen(3001, () => {
    console.log("server started at 3001")
});