import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FileAudio2, FileText, FileUp, Wand2 } from 'lucide-react'

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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useHandleFile } from '@/hooks/referralForms'
import { useGenerateReferralPdf } from '@/hooks/referralForms'
import { useGetReferralForms } from '@/hooks/userProfile/useGetReferralForms'

interface ApplicationCardProps {
  userId: string
}

type ChecklistItem = 'audio' | 'notes' | 'review' | 'submit'
type ChecklistState = Record<string, Record<ChecklistItem, boolean>>

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
  const [checklist, setChecklist] = useState<ChecklistState>({})

  useEffect(() => {
    if (!referralForms) return

    setChecklist((prev) => {
      const next = { ...prev }
      referralForms.forEach((form: any) => {
        if (!next[form.id]) {
          next[form.id] = {
            audio: false,
            notes: false,
            review: false,
            submit: false,
          }
        }
      })

      const ids = new Set(referralForms.map((form: any) => form.id))
      Object.keys(next).forEach((id) => {
        if (!ids.has(id)) delete next[id]
      })

      return next
    })
  }, [referralForms])

  const toggleChecklist = (formId: string, key: ChecklistItem) => {
    setChecklist((prev) => {
      const current =
        prev[formId] ?? ({ audio: false, notes: false, review: false, submit: false } as Record<ChecklistItem, boolean>)

      return {
        ...prev,
        [formId]: { ...current, [key]: !current[key] },
      }
    })
  }

  const statusTone = useMemo(
    () => ({
      submitted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      pending: 'border-amber-200 bg-amber-50 text-amber-800',
    }),
    [],
  )

  if (generatePending) {
    return (
      <div className="flex justify-center py-10">
        <UploadSpinner text="Generating referral PDF..." />
      </div>
    )
  }

  return (
    <article className="col-span-1 flex flex-col rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 px-6 py-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Referral workflow
          </p>
          <h2 className="text-xl font-semibold text-foreground">Forms and follow-ups</h2>
          <p className="text-sm text-muted-foreground">
            Create, upload audio, and finish your checklist for each referral.
          </p>
        </div>
        <Button
          asChild
          className="border-primary/30 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Link to="/dashboard/referral/$userId" params={{ userId }}>
            New form
          </Link>
        </Button>
      </div>

      {filePending && (
        <div className="px-6 pt-4">
          <UploadSpinner text="Processing audio..." />
        </div>
      )}
      {fileError && (
        <p className="px-6 pt-2 text-sm text-destructive">{(fileError as Error).message}</p>
      )}
      {generateError && (
        <p className="px-6 pt-2 text-sm text-destructive">{(generateError as Error).message}</p>
      )}

      <div className="space-y-3 px-6 py-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/80 p-8 text-center">
            <p className="text-destructive font-semibold">An error has occurred.</p>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        ) : referralForms?.length ? (
          <Accordion type="multiple" className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card/80 shadow-sm">
            {referralForms.map((form: any, idx: number) => {
              const formId = String(form?.id ?? idx)
              const statusClass =
                form?.status === 'SUBMITTED'
                  ? statusTone.submitted
                  : statusTone.pending

              return (
                <AccordionItem key={formId} value={formId} className="border-border/70">
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
                        {form?.disability?.disabilityReasonForReferral ?? 'Add reason'}
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
                            className="border border-primary/20 hover:text-white bg-gradient-to-b from-primary/5 to-primary/10 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
                          >
                            <label htmlFor={`audio-${formId}`} className="flex cursor-pointer items-center gap-2">
                              <FileAudio2 className="h-4 w-4" />
                              Upload audio
                            </label>
                          </Button>
                          <Button
                            size="sm"
                            className="border border-primary/15 hover:text-white bg-gradient-to-b from-primary/10 to-primary/5 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/15 hover:to-primary/10 transition-all duration-200"
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
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/80 p-3">
                            <Checkbox
                              checked={checklist[formId]?.audio || false}
                              onCheckedChange={() => toggleChecklist(formId, 'audio')}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <FileAudio2 className="h-4 w-4 text-primary" /> Add audio notes
                              </div>
                              <p className="text-muted-foreground text-xs">
                                Upload call recordings or voice notes tied to this form.
                              </p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/80 p-3">
                            <Checkbox
                              checked={checklist[formId]?.notes || false}
                              onCheckedChange={() => toggleChecklist(formId, 'notes')}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <FileText className="h-4 w-4 text-primary" /> Add additional text
                              </div>
                              <p className="text-muted-foreground text-xs">
                                Capture extra context before you submit the referral.
                              </p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/80 p-3">
                            <Checkbox
                              checked={checklist[formId]?.review || false}
                              onCheckedChange={() => toggleChecklist(formId, 'review')}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <Wand2 className="h-4 w-4 text-primary" /> Review generated file
                              </div>
                              <p className="text-muted-foreground text-xs">
                                Open the PDF to verify details are accurate.
                              </p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/80 p-3">
                            <Checkbox
                              checked={checklist[formId]?.submit || false}
                              onCheckedChange={() => toggleChecklist(formId, 'submit')}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <FileUp className="h-4 w-4 text-primary" /> Submit or resend
                              </div>
                              <p className="text-muted-foreground text-xs">
                                Confirm the referral is submitted or resend to your worker.
                              </p>
                            </div>
                          </label>
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
