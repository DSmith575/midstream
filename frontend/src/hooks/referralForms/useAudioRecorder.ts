import { useEffect, useRef, useState } from 'react'

interface UseAudioRecorderOptions {
  onStop: (file: File, formId: string) => void
}

export const useAudioRecorder = ({ onStop }: UseAudioRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingFormId, setRecordingFormId] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Array<Blob>>([])
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState<number>(0)
  const intervalRef = useRef<number | null>(null)

  const startRecording = async (formId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const file = new File(
          [blob],
          `${formId}-recording.${mimeType.includes('webm') ? 'webm' : 'ogg'}`,
          { type: mimeType },
        )
        onStop(file, formId)

        setIsRecording(false)
        setRecordingFormId(null)
        recorder.stream.getTracks().forEach((t) => t.stop())
        mediaRecorderRef.current = null
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setRecordingFormId(formId)
      const now = Date.now()
      setStartedAt(now)
      setElapsedMs(0)
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - now)
      }, 500)
    } catch (err) {
      console.error('Failed to start recording', err)
      alert('Microphone access is required to record audio')
    }
  }

  const stopRecording = () => {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== 'inactive') {
      rec.stop()
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      const rec = mediaRecorderRef.current
      if (rec && rec.state !== 'inactive') rec.stop()
    }
  }, [])

  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const ss = String(totalSec % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const elapsed = formatElapsed(elapsedMs)

  return {
    isRecording,
    recordingFormId,
    startRecording,
    stopRecording,
    elapsed,
  }
}
