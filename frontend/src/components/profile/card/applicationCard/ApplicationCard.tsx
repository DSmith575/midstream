import { useState } from 'react'
import {
  Download,
  ExternalLink,
  FileAudio2,
  FileText,
  FileUp,
  Lock,
  Mail,
  MoreVertical,
  Wand2,
} from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  useHandleFile,
  useCreateReferralNote,
} from '@/hooks/referralForms'
import { useGetReferralForms } from '@/hooks/userProfile/useGetReferralForms'
import { generateReferralPdf } from '@/lib/api/generateReferralPdf'
import { useQueryClient } from '@tanstack/react-query'

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
const GENERATED_REFERRAL_PREFIX = 'generated-referral-'

const ErrorMessage = ({ message }: { message: string }) => (
  <p className="px-6 pt-2 text-sm text-destructive">{message}</p>
)

export const ApplicationCard = ({ userId }: ApplicationCardProps) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [activeGeneratedFileFormId, setActiveGeneratedFileFormId] = useState<
    string | null
  >(null)
  const [generatedFileCache, setGeneratedFileCache] = useState<
    Record<string, { blob: Blob; fileName: string }>
  >({})
  const [isGeneratingFormId, setIsGeneratingFormId] = useState<string | null>(null)
  const { error, isLoading, referralForms } = useGetReferralForms(userId)
  const {
    handleFileChange,
    isPending: filePending,
    error: fileError,
  } = useHandleFile(userId)
  const {
    mutate: createNote,
    isPending: notesPending,
    error: notesError,
  } = useCreateReferralNote(userId)

  const downloadBlob = (blob: Blob, fileName: string) => {
    try {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        link.remove()
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (err) {
      console.error('[downloadBlob] Error:', err)
      throw new Error('Failed to download file')
    }
  }

  const openBlob = (blob: Blob) => {
    try {
      const url = window.URL.createObjectURL(blob)
      const win = window.open(url, '_blank', 'noopener,noreferrer')
      if (!win) {
        throw new Error('Popup blocked - please allow popups for this site')
      }
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 60000)
    } catch (err) {
      console.error('[openBlob] Error:', err)
      throw err
    }
  }

  const openEmailDraft = (fileName: string) => {
    const subject = encodeURIComponent('Referral Form - Ready to Share')
    const body = encodeURIComponent(
      `Please find the referral form attached.

File name: ${fileName}

This is the complete referral form with all collected information.`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    toast.info(`File downloaded. Now attaching "${fileName}" to your email.`)
  }

  const handleGenerateFile = async (formId: string) => {
    try {
      setIsGeneratingFormId(formId)
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      console.log(`[Generate] Starting generation for form ${formId}`)
      const result = await generateReferralPdf(formId, token)
      console.log(`[Generate] Got result:`, result)

      if (!result || !result.blob) {
        throw new Error('No file returned from server')
      }

      // Cache the result
      setGeneratedFileCache((prev) => ({
        ...prev,
        [formId]: result,
      }))
      console.log(
        `[Generate] Cached blob: ${result.fileName}, size: ${result.blob.size} bytes`,
      )

      // Download the file
      downloadBlob(result.blob, result.fileName)
      toast.success(`Generated and downloaded: ${result.fileName}`)

      // Invalidate referral forms to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['referralForms', userId] })
    } catch (error) {
      console.error('[Generate] Error:', error)
      const err = error instanceof Error ? error : new Error('Failed to generate file')
      toast.error(err.message)
    } finally {
      setIsGeneratingFormId(null)
    }
  }

  const handleGeneratedFileAction = async (
    formId: string,
    action: 'open' | 'download' | 'email',
  ) => {
    try {
      setActiveGeneratedFileFormId(formId)
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      console.log(`[FileAction] Starting ${action} for form ${formId}`)

      // Check cache first
      let result = generatedFileCache[formId]
      if (!result) {
        console.log(`[FileAction] Cache miss for ${formId}, fetching from server`)
        result = await generateReferralPdf(formId, token)
        console.log(`[FileAction] Got result:`, result)

        if (!result || !result.blob) {
          throw new Error('No file returned from server')
        }

        if (result.blob.size === 0) {
          throw new Error('Generated file is empty')
        }

        // Cache the result
        setGeneratedFileCache((prev) => ({
          ...prev,
          [formId]: result,
        }))
        console.log(
          `[FileAction] Cached blob: ${result.fileName}, size: ${result.blob.size} bytes`,
        )
      } else {
        console.log(
          `[FileAction] Using cached blob: ${result.fileName}, size: ${result.blob.size} bytes`,
        )
      }

      if (action === 'open') {
        console.log('[FileAction] Opening file in new window')
        openBlob(result.blob)
        return
      }

      console.log(`[FileAction] Downloading: ${result.fileName}`)
      downloadBlob(result.blob, result.fileName)

      if (action === 'email') {
        console.log('[FileAction] Opening email draft with file attachment instructions')
        toast.success(`Downloaded: ${result.fileName}`)
        // Add a small delay to ensure file download completes before opening email
        setTimeout(() => {
          openEmailDraft(result.fileName)
        }, 500)
      } else {
        toast.success(`Downloaded: ${result.fileName}`)
      }
    } catch (error) {
      console.error('[FileAction] Error:', error)
      const err = error instanceof Error ? error : new Error('File action failed')
      toast.error(err.message)
    } finally {
      setActiveGeneratedFileFormId(null)
    }
  }

  if (isGeneratingFormId) {
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
              const generatedFile = form?.documents?.find((doc: any) =>
                String(doc?.name ?? '').startsWith(GENERATED_REFERRAL_PREFIX),
              )
              const hasGeneratedFile = Boolean(generatedFile)
              const actionLocked =
                isGeneratingFormId === formId ||
                activeGeneratedFileFormId === formId ||
                hasGeneratedFile
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
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions
                          </p>
                          {hasGeneratedFile && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              <Lock className="h-3 w-3" />
                              Locked
                            </span>
                          )}
                        </div>
                        {hasGeneratedFile && (
                          <p className="rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-1 text-xs text-emerald-800">
                            This referral file has been generated. Audio and notes
                            are now locked. Use File actions to open, download, or
                            email the generated file.
                          </p>
                        )}
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
                            disabled={filePending || actionLocked}
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
                            disabled={actionLocked}
                          />
                          <AddNotesDialog
                            formId={formId}
                            disabled={notesPending || actionLocked}
                            onSave={(formId, content) =>
                              createNote({ referralId: formId, content })
                            }
                            existingNotes={form?.notes || []}
                          />
                          <Button
                            size="sm"
                            className={GENERATE_BUTTON_CLASS}
                            disabled={actionLocked}
                            onClick={() => handleGenerateFile(formId)}
                          >
                            <FileUp className="h-4 w-4" />
                            {hasGeneratedFile ? 'File generated' : 'Generate file'}
                          </Button>

                          {hasGeneratedFile && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-primary/30"
                                  disabled={
                                    activeGeneratedFileFormId === formId ||
                                    isGeneratingFormId === formId
                                  }
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  File actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleGeneratedFileAction(formId, 'open')
                                  }
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleGeneratedFileAction(formId, 'download')
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleGeneratedFileAction(formId, 'email')
                                  }
                                >
                                  <Mail className="h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
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
                          {/* <ChecklistItem
                            checked={checklistValues.submit}
                            title="Submit or resend"
                            description="Confirm the referral is submitted or resend to your worker."
                            icon={<FileUp className="h-4 w-4 text-primary" />}
                          /> */}
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
