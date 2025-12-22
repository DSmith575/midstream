import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreateUserReferralAudio } from '@/hooks/userProfile/useCreateUserReferralAudio'
import { useAudioRecorder } from '@/hooks/referralForms/useAudioRecorder'

interface Props {
  formId: string
  userId: string
  disabled?: boolean
}

export const RecordAudioButton = ({ formId, userId, disabled }: Props) => {
  const { mutate: uploadRecordedAudio, isPending } =
    useCreateUserReferralAudio(userId)
  const {
    isRecording,
    recordingFormId,
    startRecording,
    stopRecording,
    elapsed,
  } = useAudioRecorder({
    onStop: (file, id) => uploadRecordedAudio({ file, referralId: id }),
  })

  const isActive = isRecording && recordingFormId === formId

  return (
    <Button
      size="sm"
      variant={isActive ? 'default' : 'outline'}
      className={
        isActive
          ? 'bg-red-600 text-white hover:bg-red-700 border-red-700 shadow-sm'
          : 'border border-primary/20 text-primary hover:text-white bg-gradient-to-b from-primary/5 to-primary/10 font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15'
      }
      disabled={disabled || isPending}
      onClick={() => (isActive ? stopRecording() : startRecording(formId))}
      aria-pressed={isActive}
      aria-live="polite"
      title={isActive ? 'Stop recording' : 'Record audio'}
    >
      {isActive ? (
        <span className="inline-flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <Square className="h-4 w-4" />
          <span>Recording {elapsed}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Mic className="h-4 w-4" />{' '}
          {isPending ? 'Uploading…' : 'Record audio'}
        </span>
      )}
    </Button>
  )
}
