import { useState } from 'react'
import { Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreateUserReferralAudio } from '@/hooks/userProfile/useCreateUserReferralAudio'
import { AudioRecordingModal } from '@/components/modal/AudioRecordingModal'

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

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border border-primary/20 text-primary hover:text-white bg-gradient-to-b from-primary/5 to-primary/10 font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15"
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
