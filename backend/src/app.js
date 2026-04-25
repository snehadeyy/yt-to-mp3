import express, { urlencoded } from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const allowewdOrigins = [
    "http://localhost:5173",
    "https://yt-to-mp3-frontend.onrender.com"
]

app.use(cors({
    origin: function (origin, cb) {
        if (!origin || allowewdOrigins.includes(origin)) {
            cb(null, true)
        }
        else {
            cb(new Error("CORS blocked"))
        }
    }
}))


import { router } from "./routes/download.routes.js"

app.use("/api/v1", router)

export default app