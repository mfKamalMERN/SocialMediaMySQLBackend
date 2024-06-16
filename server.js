import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { userRouter } from './ConnectDB/Routes/UserRoute.js'
import { postRouter } from './ConnectDB/Routes/PostRoute.js'

const app = express()
app.use(express.json())
app.use(express.static('Public'))

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3000/home", "http://localhost:3000/editpost/:postid"],

    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.json())

app.use('/', userRouter)
app.use('/', postRouter)

const port = 8700

app.listen(port, () => console.log(`Server running at port ${port}`))