import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserReferralFormView } from '@/components/referralForms/UserReferralFormView'
import { useGetReferralForms } from '@/hooks/userProfile/useGetReferralForms'
import { Spinner } from '@/components/spinner/Spinner'
import { FileAudio2 } from 'lucide-react'
import { useRef } from 'react'
import { useHandleFile } from '@/hooks/referralForms'
import { UploadSpinner } from '@/components/spinner'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

interface ApplicationCardProps {
  userId: string
}

const sendReferralToPythonService = async (formId: string) => {
  // send to node backend which sends to python backend
  try {
    const response = await fetch(`${apiKey}referralForms/generateFullReferralForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referralFormId: formId }),
    });

if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const blob = await response.blob(); // convert response to blob
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${formId}-referral.pdf`; // filename
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // clean up
  } catch (error) {
    console.error("Error sending referral to Python service:", error);
    throw error;
  }
};

export const ApplicationCard = ({ userId }: ApplicationCardProps) => {
  const { error, isLoading, referralForms } = useGetReferralForms(userId)
  const {
    handleFileChange,
    isPending: filePending,
    error: fileError,
  } = useHandleFile(userId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="max-h-[300px] col-span-1 flex flex-col rounded-2xl bg-white p-6 shadow-lg md:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Applications</h2>
        <Button asChild className={'bg-green-500 hover:bg-[#59b5e1]'}>
          <Link to="/dashboard/referral/$userId" params={{ userId }}>
            New Form
          </Link>
        </Button>
      </div>
      <div>{filePending && <UploadSpinner />}</div>
      <>
        {fileError && (
          <p style={{ color: 'red' }}>{(fileError as Error).message}</p>
        )}
      </>
      <hr className="border-gray-200" style={{ marginTop: '1rem' }} />
      <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-red-500">An error has occurred.</p>
            <p className="text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        ) : (
          referralForms?.map((form: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <section className={'flex items-center gap-2'}>
                <UserReferralFormView
                  disabled={filePending}
                  referralForm={form}
                  userId={userId}
                />
                <Input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    handleFileChange(e, form.id)
                  }}
                  className="hidden"
                />


                <Button
                  disabled={filePending}
                  type={'button'}
                  variant={'outline'}
                  size="lg"
                  className={'bg-green-500 hover:bg-[#59b5e1] text-white'}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileAudio2 className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => sendReferralToPythonService(form.id)}
                >
                  Generate File
                </Button>
              </section>
              <div>
                {`Referred by ${form.referrer.firstName} ${form.referrer.lastName}
                   for ${form.disability.disabilityType} -
                   ${form.disability.disabilityReasonForReferral}`}
              </div>
              <p
                className={`rounded-full px-3 py-1 ${
                  form.status === 'SUBMITTED' ? 'bg-[#84e984]' : 'bg-red-100'
                }`}
              >
                {form.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
