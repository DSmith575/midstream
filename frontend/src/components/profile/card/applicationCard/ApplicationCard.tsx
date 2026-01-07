import { FileAudio2, FileText, FileUp, Wand2 } from 'lucide-react'

import { ChecklistItem } from './ChecklistItem'
import { RecordAudioButton } from './RecordAudioButton'
import { ApplicationCardHeader } from './ApplicationCardHeader'
import { AddNotesDialog } from './AddNotesDialog'
import { UserReferralFormView } from '@/components/referralForms/UserReferralFormView'
import { Spinner } from '@/components/spinner/Spinner'
import { UploadSpinner } from '@/components/spinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useGenerateReferralPdf,
  useHandleFile,
  useCreateReferralNote,
} from '@/hooks/referralForms'
import { useGetReferralForms } from '@/hooks/userProfile/useGetReferralForms'

interface ApplicationCardProps {
  userId: string
}

const STATUS_STYLES = {
  submitted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
} as const

const BUTTON_GRADIENT_CLASS =
  'border border-primary/20 hover:text-white bg-gradient-to-b from-primary/5 to-primary/10 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15 transition-all duration-200'
const GENERATE_BUTTON_CLASS =
  'border border-primary/15 hover:text-white bg-gradient-to-b from-primary/10 to-primary/5 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/15 hover:to-primary/10 transition-all duration-200'

const ErrorMessage = ({ message }: { message: string }) => (
  <p className="px-6 pt-2 text-sm text-destructive">{message}</p>
)

export const ApplicationCard = ({ userId }: ApplicationCardProps) => {
  const { error, isLoading, referralForms } = useGetReferralForms(userId)
  const {
    handleFileChange,
    isPending: filePending,
    error: fileError,
  } = useHandleFile(userId)
  const {
    mutate: generateReferralPdf,
    isPending: generatePending,
    error: generateError,
  } = useGenerateReferralPdf()
  const {
    mutate: createNote,
    isPending: notesPending,
    error: notesError,
  } = useCreateReferralNote(userId)

  if (generatePending) {
    return (
      <div className="flex justify-center py-10">
        <UploadSpinner text="Generating referral PDF..." />
      </div>
    )
  }

  return (
    <article className="relative col-span-1 w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10">
      <ApplicationCardHeader userId={userId} />

      {filePending && (
        <div className="px-6 pt-4">
          <UploadSpinner text="Processing audio..." />
        </div>
      )}
      {fileError && <ErrorMessage message={fileError.message} />}
      {generateError && <ErrorMessage message={generateError.message} />}
      {notesError && <ErrorMessage message={notesError.message} />}

      <div className="space-y-3 px-6 py-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/80 p-8 text-center">
            <p className="font-semibold text-destructive">
              An error has occurred.
            </p>
            <p className="text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        ) : referralForms?.length ? (
          <Accordion
            type="multiple"
            className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card/80 shadow-sm"
          >
            {referralForms.map((form: any, idx: number) => {
              const formId = String(form?.id ?? idx)
              const statusClass =
                form?.status === 'SUBMITTED'
                  ? STATUS_STYLES.submitted
                  : STATUS_STYLES.pending
              const checklistValues = {
                audio: Boolean(form?.checklistAudioComplete),
                notes: Boolean(form?.checklistNotesComplete),
                review: Boolean(form?.checklistReviewComplete),
                submit: Boolean(form?.checklistSubmitComplete),
              }

              return (
                <AccordionItem
                  key={formId}
                  value={formId}
                  className="border-border/70"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex flex-1 flex-col gap-2 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Form {idx + 1}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {form?.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {`Referred by ${form?.referrer?.firstName ?? '—'} ${form?.referrer?.lastName ?? ''} for ${form?.disability?.disabilityType ?? '—'}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {form?.disability?.disabilityReasonForReferral ??
                          'Add reason'}
                      </p>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-5">
                    <div className="grid gap-4 sm:grid-cols-5">
                      <div className="sm:col-span-2 space-y-3 rounded-lg border border-border/60 bg-background/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <UserReferralFormView
                            disabled={filePending}
                            referralForm={form}
                            userId={userId}
                          />
                          <Input
                            id={`audio-${formId}`}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileChange(e, formId)}
                            className="hidden"
                          />
                          <Button
                            disabled={filePending}
                            asChild
                            size="sm"
                            className={BUTTON_GRADIENT_CLASS}
                          >
                            <label
                              htmlFor={`audio-${formId}`}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <FileAudio2 className="h-4 w-4" />
                              Upload audio
                            </label>
                          </Button>
                          <RecordAudioButton
                            formId={formId}
                            userId={userId}
                            disabled={generatePending}
                          />
                          <AddNotesDialog
                            formId={formId}
                            disabled={notesPending || generatePending}
                            onSave={(formId, content) =>
                              createNote({ referralId: formId, content })
                            }
                            existingNotes={form?.notes || []}
                          />
                          <Button
                            size="sm"
                            className={GENERATE_BUTTON_CLASS}
                            disabled={generatePending}
                            onClick={() => generateReferralPdf(formId)}
                          >
                            <FileUp className="h-4 w-4" />
                            Generate file
                          </Button>
                        </div>
                      </div>

                      <div className="sm:col-span-3 space-y-3 rounded-lg border border-border/60 bg-background/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Post-creation checklist
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Complete these steps to finalize the referral form.
                          The more information you provide, the better the
                          support worker can assist.
                        </span>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <ChecklistItem
                            checked={checklistValues.audio}
                            title="Add audio notes"
                            description="Upload call recordings or voice notes tied to this form."
                            icon={
                              <FileAudio2 className="h-4 w-4 text-primary" />
                            }
                          />
                          <ChecklistItem
                            checked={checklistValues.notes}
                            title="Add additional text"
                            description="Capture extra context before you submit the referral."
                            icon={<FileText className="h-4 w-4 text-primary" />}
                          />
                          <ChecklistItem
                            checked={checklistValues.review}
                            title="Review generated file"
                            description="Open the PDF to verify details are accurate."
                            icon={<Wand2 className="h-4 w-4 text-primary" />}
                          />
                          <ChecklistItem
                            checked={checklistValues.submit}
                            title="Submit or resend"
                            description="Confirm the referral is submitted or resend to your worker."
                            icon={<FileUp className="h-4 w-4 text-primary" />}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/70 p-6 text-center text-sm text-muted-foreground">
            No referral forms yet. Create one to start the checklist.
          </div>
        )}
      </div>
    </article>
  )
}
