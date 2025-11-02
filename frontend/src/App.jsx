import React, { useState, useRef } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/convert'

function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed right-6 top-6 bg-white shadow-lg rounded px-4 py-2 border">
      <div className="flex items-center space-x-3">
        <div className="text-green-600 font-semibold">Success</div>
        <div className="text-sm text-gray-700">{message}</div>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">✕</button>
      </div>
    </div>
  )
}

export default function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [format, setFormat] = useState('png')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState('')
  const downloadRef = useRef(null)

  const onFileChange = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) onFileChange(f)
  }

  const onDragOver = (e) => { e.preventDefault() }

  const handleConvert = async () => {
    if (!file) return alert('Please upload an image')
    setLoading(true)
    setProgress(0)
    const fd = new FormData()
    fd.append('image', file)
    fd.append('format', format)

    try {
      const res = await axios.post(API_URL, fd, {
        responseType: 'blob',
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded / p.total) * 100))
        }
      })
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      if (downloadRef.current) {
        downloadRef.current.href = url
        downloadRef.current.download = `converted.${format}`
        downloadRef.current.click()
      }
      setToast('Image converted — download should start automatically.')
    } catch (err) {
      console.error(err)
      alert('Conversion failed: ' + (err?.response?.data?.error || err.message))
    } finally {
      setLoading(false)
      setProgress(0)
      setTimeout(() => setToast(''), 4000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Image Converter</h1>
          <nav className="text-sm text-gray-600">
            <a href="#" className="mr-4 hover:underline">Home</a>
            <a href="#" className="mr-4 hover:underline">Formats</a>
            <a href="#" className="hover:underline">Privacy</a>
          </nav>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <div
              className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input id="file-input" type="file" accept="image/*" className="hidden"
                onChange={(e) => onFileChange(e.target.files[0])} />
              <div className="text-gray-500 mb-4">Drag & drop an image here, or click to browse</div>
              <div className="flex items-center justify-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-full border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m10 12V4M3 20h18" /></svg>
                </div>
                <div className="text-sm text-gray-600">PNG, JPG, WEBP, TIFF, AVIF</div>
              </div>
            </div>

            {preview && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Preview</div>
                <img src={preview} alt="preview" className="w-full h-52 object-contain rounded" />
              </div>
            )}
          </section>

          <aside className="flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4">
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
                <option value="tiff">TIFF</option>
                <option value="avif">AVIF</option>
              </select>

              <div className="text-sm text-gray-600 mb-2">Options</div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Resize</div>
                  <div className="text-xs text-gray-400">Coming soon</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Background removal</div>
                  <div className="text-xs text-gray-400">Coming soon</div>
                </div>
              </div>

              <button onClick={handleConvert} disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Converting...' : 'Convert & Download'}
              </button>

              {loading && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Uploading... {progress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div style={{width: progress + '%'}} className="h-2 rounded-full bg-blue-500 transition-all"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Files are processed locally on the server. Max file size: 10 MB.
            </div>
          </aside>
        </main>

        <a ref={downloadRef => (downloadRef = downloadRef)} className="hidden" />

      </div>

      <Toast message={toast} onClose={() => setToast('')} />
      {/* hidden anchor for download triggered programmatically */}
      <a ref={downloadRef} style={{display:'none'}} />
    </div>
  )
}
