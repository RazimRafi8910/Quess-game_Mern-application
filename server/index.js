import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import appRoutes from './routes/appRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import DBconnection from './utils/DBconnection.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler.js'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(cookieParser())
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

//error handler
app.use(errorHandler);

app.listen(3001, () => {
    console.log("server started at 3001")
})

//ws.on("connection",(conection,request)=>{wsOnConnection(conection,request)})
// httpServer.listen(3001, () => {
//     console.log("server started")
// })
