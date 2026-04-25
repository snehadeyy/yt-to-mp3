import express, { urlencoded } from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(cors({
    origin: "http://localhost:5173"
}))


import { router } from "./routes/download.routes.js"

app.use("/api/v1", router)

export default app