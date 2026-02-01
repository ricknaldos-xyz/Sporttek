/**
 * Client-side video compression using browser Canvas API.
 * Falls back to original file if compression is not supported or fails.
 */

const COMPRESSION_THRESHOLD = 20 * 1024 * 1024 // Only compress videos > 20MB
const TARGET_MAX_WIDTH = 1280
const TARGET_MAX_HEIGHT = 720

export async function compressVideoIfNeeded(file: File): Promise<File> {
  // Skip if not a video or under threshold
  if (!file.type.startsWith('video/') || file.size <= COMPRESSION_THRESHOLD) {
    return file
  }

  // Check if MediaRecorder is available (not on all browsers)
  if (typeof MediaRecorder === 'undefined') {
    return file
  }

  // Check for supported MIME types
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : null

  if (!mimeType) {
    return file
  }

  try {
    const compressed = await reencodeVideo(file, mimeType)

    // Only use compressed if it's actually smaller
    if (compressed.size < file.size * 0.85) {
      return compressed
    }
    return file
  } catch {
    // Compression failed, return original
    return file
  }
}

function reencodeVideo(file: File, mimeType: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      // Calculate target dimensions
      let { videoWidth: w, videoHeight: h } = video
      const scale = Math.min(
        TARGET_MAX_WIDTH / w,
        TARGET_MAX_HEIGHT / h,
        1 // Don't upscale
      )
      w = Math.round(w * scale)
      h = Math.round(h * scale)

      // Ensure even dimensions (required by some codecs)
      w = w % 2 === 0 ? w : w + 1
      h = h % 2 === 0 ? h : h + 1

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Canvas not supported'))
        return
      }

      // Target bitrate: ~2Mbps for 720p
      const videoBitsPerSecond = Math.min(2_000_000, file.size * 8 / video.duration * 0.6)
      const stream = canvas.captureStream(30)
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond,
      })

      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        URL.revokeObjectURL(objectUrl)
        const blob = new Blob(chunks, { type: mimeType })
        const ext = mimeType.includes('webm') ? 'webm' : 'mp4'
        const compressedName = file.name.replace(/\.[^.]+$/, `-compressed.${ext}`)
        const compressedFile = new File([blob], compressedName, {
          type: mimeType,
          lastModified: Date.now(),
        })
        resolve(compressedFile)
      }

      recorder.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('MediaRecorder error'))
      }

      // Timeout safety: max 60 seconds of processing
      const timeout = setTimeout(() => {
        try { recorder.stop() } catch { /* ignore */ }
        try { video.pause() } catch { /* ignore */ }
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Compression timeout'))
      }, 60_000)

      recorder.start()

      video.onended = () => {
        clearTimeout(timeout)
        recorder.stop()
      }

      const drawFrame = () => {
        if (video.ended || video.paused) return
        ctx.drawImage(video, 0, 0, w, h)
        requestAnimationFrame(drawFrame)
      }

      video.play().then(drawFrame).catch(() => {
        clearTimeout(timeout)
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Video playback failed'))
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Video load failed'))
    }
  })
}
