import { useCreateUserReferralAudio } from '../userProfile'

export const useHandleFile = (refId: string, successCallBack?: () => void) => {
  const { mutate, isPending, isSuccess, error, isError } = useCreateUserReferralAudio(refId, () => {
    successCallBack?.()
  })

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    referralId: string,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      alert('Please select a file to upload')
      return
    }

    mutate({ file, referralId })
  }

  return { handleFileChange, isPending, isSuccess, isError, error }
}
