import { Router } from "express";
import { getInfo, downloadAudio } from "../controller/ytDownload.js";


const router = Router()

router.get("/info", getInfo)

router.post("/download", downloadAudio)

export { router }