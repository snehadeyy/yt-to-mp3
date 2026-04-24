import fs from 'fs';
import { spawn } from "child_process";
import { YtDlp } from 'ytdlp-nodejs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ytdlp = new YtDlp();

/**
 * @name getInfo
 * @description takes the youtube song url and sends the details of the music video
 */

const getInfo = async (req, res) => {
    try {
        const { url } = req.query

        if (!url) {
            return res.status(400).json({
                message: "URL is required"
            })
        }

        //Basic checking whether youtube url or not
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return res.status(400).json({
                message: "Invalid youtube url"
            })
        }

        const metadata = await ytdlp.getInfoAsync(url)
        // console.log(metadata)

        return res.status(200).json({
            message: "Video details fetched",
            data: {
                title: metadata.title,
                thumbnail: metadata.thumbnail,
                uploader: metadata.uploader
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error fetching video info"
        })
    }
}

/**
 * @name downloadAudio
 * @description it converts the music video into mp3 and downloads it
 */

const downloadAudio = async (req, res) => {
    try {
        const { url } = req.body
        const metadata = await ytdlp.getInfoAsync(url)

        if (!url) {
            res.status(400).json({
                message: "URL is required"
            })
        }

        //Basic checking whether youtube url or not
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return res.status(400).json({
                message: "Invalid youtube url"
            })
        }
        // 2. Create unique filename
        const fileName = `${metadata.title}.mp3`;
        const outputPath = path.join(__dirname, `../../downloads/${fileName}`);

        // ✅ 3. Run yt-dlp
        const ytDlpProcess = spawn("yt-dlp", [
            url,
            "-x",
            "--audio-format", "mp3",
            "-o", outputPath
        ]);

        // Optional: see logs (debugging)
        ytDlpProcess.stderr.on("data", (data) => {
            console.log(`yt-dlp: ${data}`);
        });

        // ✅ 4. When download completes
        ytDlpProcess.on("close", (code) => {
            if (code !== 0) {
                return res.status(500).json({
                    message: "Download failed",
                });
            }

            // ✅ 5. Send file to user
            res.download(outputPath, fileName, (err) => {
                if (err) {
                    console.error(err);
                }

                // ✅ 6. Delete file after sending
                fs.unlink(outputPath, () => { });
            });
        });

        ytDlpProcess.on("error", (err) => {
            console.error(err);
            return res.status(500).json({
                message: "Error starting download",
            });
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        });
    }
}

export { getInfo, downloadAudio }