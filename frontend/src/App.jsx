import { useState } from "react"
import axios from "axios"
import "./style/form.scss"

function App() {
  const api = axios.create({
    baseURL: "http://localhost:3000/api/v1"
  })

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [song, setSong] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url) return

    setLoading(true)

    try {
      const response = await api.get("/info", {
        params: { url }
      })
      // console.log(response)
      setSong(response.data.data)
    }
    catch (err) {
      console.log(err)
      throw err
    }
    finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setLoading(true)
      const response = await api.post("/download",
        { url },
        {
          responseType: "blob"
        }
      )

      const blob = new Blob([response.data], {
        type: "audio/mpeg"
      });

      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `${song.title}.mp3`
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <main>
      <div className="form-container">
        <h1>Download songs for free</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="yt-link">Paste Link:</label>
            <input
              type="text"
              id="yt-link"
              name="yt-link"
              placeholder="eg: https://www.youtube.com/watch?v=..."
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
          </div>
          <button className="button primary-button">Submit</button>
        </form>

        {loading && <p>Loading....</p>}

        {song && (
          <div className="song-card-container">
            <div className="song-card-inside">
              <img src={song.thumbnail} alt="thumbnail" />
              <h3>{song.title}</h3>
            </div>

            <button
              className="button primary-button"
              onClick={handleDownload}
              disabled={loading}
            >
              Download MP3
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
