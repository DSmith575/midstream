import { useEffect, useRef, useState } from 'react'
import { Mic, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AudioRecordingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (file: File) => void
  formId: string
}

export const AudioRecordingModal = ({
  open,
  onOpenChange,
  onComplete,
  formId,
}: AudioRecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [elapsedMs, setElapsedMs] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Array<Blob>>([])
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const recordedFileRef = useRef<File | null>(null)

  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const ss = String(totalSec % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  const startRecording = async () => {
    try {
      // Request audio with specific constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      })

      // Prefer audio/webm with opus codec for better quality
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/ogg;codecs=opus'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/ogg'
          }
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // 128 kbps for good quality
      })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const extension = mimeType.includes('webm') ? 'webm' : 'ogg'
        const file = new File([blob], `${formId}-recording.${extension}`, {
          type: mimeType,
        })
        recordedFileRef.current = file
        setHasRecording(true)
        setIsRecording(false)
        recorder.stream.getTracks().forEach((t) => t.stop())
      }

      // Start recording with 1000ms timeslice to ensure data is collected regularly
      recorder.start(1000)
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setHasRecording(false)
      const now = Date.now()
      startTimeRef.current = now
      setElapsedMs(0)
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - now)
      }, 100)
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
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleComplete = () => {
    if (recordedFileRef.current) {
      onComplete(recordedFileRef.current)
      handleClose()
    }
  }

  const handleClose = () => {
    // Clean up any active recording
    if (isRecording) {
      stopRecording()
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
    }
    // Reset state
    setIsRecording(false)
    setHasRecording(false)
    setElapsedMs(0)
    chunksRef.current = []
    recordedFileRef.current = null
    onOpenChange(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      const rec = mediaRecorderRef.current
      if (rec && rec.state !== 'inactive') rec.stop()
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Audio</DialogTitle>
          <DialogDescription>
            Click start to begin recording your audio message. Click stop when
            you're finished.
          </DialogDescription>
        </DialogHeader>

        {/* Helpful prompts */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-medium text-muted-foreground mb-3">
            Some helpful prompts to guide your recording:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>What's been hardest for you or your whānau lately?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>What would you like to change or make easier?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>What does a good outcome look like for you?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Is there anything urgent or time-sensitive we should know about?
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Recording indicator */}
          <div className="relative">
            <div
              className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-100 dark:bg-red-950'
                  : hasRecording
                    ? 'bg-green-100 dark:bg-green-950'
                    : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {isRecording ? (
                <>
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                  <Mic className="h-12 w-12 text-red-600 dark:text-red-400 relative z-10" />
                </>
              ) : hasRecording ? (
                <Square className="h-12 w-12 text-green-600 dark:text-green-400 fill-current" />
              ) : (
                <Mic className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              )}
            </div>
          </div>

          {/* Timer */}
          <div className="text-3xl font-mono font-semibold tabular-nums">
            {formatElapsed(elapsedMs)}
          </div>

          {/* Status text */}
          <div className="text-sm text-muted-foreground">
            {isRecording
              ? 'Recording in progress...'
              : hasRecording
                ? 'Recording complete'
                : 'Ready to record'}
          </div>

          {/* Control buttons */}
          <div className="flex gap-3">
            {!isRecording && !hasRecording && (
              <Button onClick={startRecording} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {hasRecording && (
              <>
                <Button
                  onClick={() => {
                    setHasRecording(false)
                    setElapsedMs(0)
                    recordedFileRef.current = null
                  }}
                  variant="outline"
                  size="lg"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Record Again
                </Button>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {hasRecording && (
            <Button onClick={handleComplete}>Save Recording</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
