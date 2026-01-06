import { useState } from 'react'
import { Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreateUserReferralAudio } from '@/hooks/userProfile/useCreateUserReferralAudio'
import { AudioRecordingModal } from '@/components/modal/AudioRecordingModal'
import { UploadSpinner } from '@/components/spinner'

interface Props {
  formId: string
  userId: string
  disabled?: boolean
}

export const RecordAudioButton = ({ formId, userId, disabled }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { mutate: uploadRecordedAudio, isPending } =
    useCreateUserReferralAudio(userId)

  const handleComplete = (file: File) => {
    uploadRecordedAudio({ file, referralId: formId })
  }

  if (isPending) {
    return (
      <UploadSpinner text="Uploading your audio recording..." />
    )
  }

  return (
    <>
      <Button
        size="sm"
        className="order border-primary/15 hover:text-white bg-gradient-to-b from-primary/10 to-primary/5 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/15 hover:to-primary/10 transition-all duration-200"
        disabled={disabled || isPending}
        onClick={() => setIsModalOpen(true)}
        title="Record audio"
      >
        <span className="inline-flex items-center gap-2">
          <Mic className="h-4 w-4" />
          {isPending ? 'Uploading…' : 'Record audio'}
        </span>
      </Button>

      <AudioRecordingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onComplete={handleComplete}
        formId={formId}
      />
    </>
  )
}
