import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, CalendarClock, CircleAlert, Mic, RefreshCw, Square } from 'lucide-react'
import { Spinner } from '@/components/spinner/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUpcomingSupport } from '@/hooks/userProfile'

type SpeechRecognitionResultLike = {
    [index: number]: {
        transcript: string
    }
    isFinal?: boolean
}

type SpeechRecognitionEventLike = {
    resultIndex: number
    results: {
        [index: number]: SpeechRecognitionResultLike
        length: number
        item: (index: number) => SpeechRecognitionResultLike
    }
}

type SpeechRecognitionLike = {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: ((event: SpeechRecognitionEventLike) => void) | null
    onerror: (() => void) | null
    onend: (() => void) | null
    start: () => void
    stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructorLike | null => {
    if (typeof window === 'undefined') return null

    const maybeWindow = window as Window & {
        SpeechRecognition?: SpeechRecognitionConstructorLike
        webkitSpeechRecognition?: SpeechRecognitionConstructorLike
    }

    return maybeWindow.SpeechRecognition || maybeWindow.webkitSpeechRecognition || null
}

const emptyStateClassName = 'rounded-xl border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground'

const urgencyStyles: Record<'LOW' | 'MEDIUM' | 'HIGH', string> = {
    LOW: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    HIGH: 'bg-red-500/10 text-red-700 border-red-500/30',
}

const formatDueDateTime = (value: string | null) => {
    if (!value) return 'Date not specified'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Date not specified'

    const dateText = date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })

    const hasMeaningfulTime = date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0
    if (!hasMeaningfulTime) {
        return dateText
    }

    const timeText = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    })

    return `${dateText} at ${timeText} UTC`
}

const toLocalDateTimeValue = (value: string | null) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const offsetMs = date.getTimezoneOffset() * 60 * 1000
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

const EmptyState = ({ text }: { text: string }) => <div className={emptyStateClassName}>{text}</div>

const StatsBadge = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
        {icon}
        {text}
    </span>
)

export const UpcomingSupportCard = ({ userId }: { userId: string }) => {
    const {
        data,
        isLoading,
        isFetching,
        error,
        refreshScan,
        refreshScanPending,
        setReadStatus,
        readStatusPending,
        setDismissStatus,
        dismissStatusPending,
        moveToUpcoming,
        moveToUpcomingPending,
        setDueDate,
        dueDatePending,
        createVoiceAppointment,
        createVoiceAppointmentPending,
    } = useUpcomingSupport(userId)
    const notifications = data?.data || []
    const pastNotifications = data?.pastData || []
    const actionPending = readStatusPending || dismissStatusPending || moveToUpcomingPending || dueDatePending
    const voiceSupported = !!getSpeechRecognitionConstructor()
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
    const voiceCaptureBaseRef = useRef('')
    const [isListening, setIsListening] = useState(false)
    const [voiceDraft, setVoiceDraft] = useState('')
    const [voiceSaveSuccess, setVoiceSaveSuccess] = useState(false)
    const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null)
    const [editedDateValue, setEditedDateValue] = useState('')

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
                recognitionRef.current = null
            }
        }
    }, [])

    const startEditDueDate = (notificationId: string, currentDueDateISO: string | null) => {
        setEditingNotificationId(notificationId)
        setEditedDateValue(toLocalDateTimeValue(currentDueDateISO))
    }

    const cancelEditDueDate = () => {
        setEditingNotificationId(null)
        setEditedDateValue('')
    }

    const saveDueDate = (notificationId: string) => {
        if (!editedDateValue.trim()) return
        const dueDateISO = new Date(editedDateValue).toISOString()
        setDueDate({ notificationId, dueDateISO })
        setEditingNotificationId(null)
        setEditedDateValue('')
    }

    const stopVoiceCapture = () => {
        if (!recognitionRef.current) return
        recognitionRef.current.stop()
    }

    const startVoiceCapture = () => {
        const SpeechRecognitionCtor = getSpeechRecognitionConstructor()
        if (!SpeechRecognitionCtor) return

        voiceCaptureBaseRef.current = voiceDraft.trim()
        setVoiceSaveSuccess(false)

        const recognition = new SpeechRecognitionCtor()
        recognitionRef.current = recognition
        recognition.lang = 'en-NZ'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = 0; i < event.results.length; i += 1) {
                const segment = event.results[i]?.[0]?.transcript?.trim()
                if (!segment) continue
                if (event.results[i].isFinal) {
                    finalTranscript = `${finalTranscript} ${segment}`.trim()
                } else {
                    interimTranscript = `${interimTranscript} ${segment}`.trim()
                }
            }

            const capturedText = `${finalTranscript} ${interimTranscript}`.trim()
            const baseText = voiceCaptureBaseRef.current
            setVoiceDraft(`${baseText} ${capturedText}`.trim())
        }

        recognition.onerror = () => {
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
            recognitionRef.current = null
        }

        setIsListening(true)
        recognition.start()
    }

    const createAppointmentFromVoice = () => {
        if (!voiceDraft.trim()) return
        setVoiceSaveSuccess(false)
        createVoiceAppointment(
            { transcript: voiceDraft.trim() },
            {
                onSuccess: () => {
                    setVoiceDraft('')
                    setVoiceSaveSuccess(true)
                },
            },
        )
    }

    const renderNotificationItem = (
        item: (typeof notifications)[number],
        index: number,
        isPast: boolean,
    ) => (
        <li
            key={`${item.sourceItemId}-${item.dueDateISO || 'unknown'}-${index}`}
            className="rounded-xl border border-border/60 bg-background/40 p-4"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${urgencyStyles[item.urgency] || urgencyStyles.MEDIUM}`}
                >
                    {item.urgency}
                </span>
            </div>

            <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                <p>Due: {formatDueDateTime(item.dueDateISO)}</p>
                <p>Source: {item.sourceItemName || 'Support folder item'}</p>
                <p>Confidence: {Math.round((item.confidence || 0) * 100)}%</p>
                <p>Status: {item.isRead ? 'Read' : 'Unread'}</p>
                {item.reason ? (
                    <p className="inline-flex items-start gap-1">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                        {item.reason}
                    </p>
                ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={actionPending}
                    onClick={() =>
                        setReadStatus({
                            notificationId: item.id,
                            isRead: !item.isRead,
                        })
                    }
                >
                    {item.isRead ? 'Mark unread' : 'Mark read'}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={actionPending}
                    onClick={() =>
                        setDismissStatus({
                            notificationId: item.id,
                            isDismissed: true,
                        })
                    }
                >
                    Dismiss
                </Button>
                {isPast ? (
                    <>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={actionPending}
                            onClick={() => startEditDueDate(item.id, item.dueDateISO)}
                        >
                            Edit date
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={actionPending}
                            onClick={() =>
                                moveToUpcoming({
                                    notificationId: item.id,
                                })
                            }
                        >
                            Move to upcoming
                        </Button>
                    </>
                ) : null}
            </div>

            {isPast && editingNotificationId === item.id ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
                    <Input
                        type="datetime-local"
                        value={editedDateValue}
                        onChange={(event) => setEditedDateValue(event.target.value)}
                        className="w-full sm:w-auto"
                    />
                    <Button
                        type="button"
                        size="sm"
                        disabled={actionPending || !editedDateValue}
                        onClick={() => saveDueDate(item.id)}
                    >
                        Save date
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={actionPending}
                        onClick={cancelEditDueDate}
                    >
                        Cancel
                    </Button>
                </div>
            ) : null}
        </li>
    )

    return (
        <article className="col-span-1 w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10">
            <header className="border-b border-border/70 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">Upcoming Support</h3>
                        <p className="text-sm text-muted-foreground">
                            AI scans your support correspondence and highlights upcoming deadlines and tasks.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => refreshScan()}
                        disabled={isFetching || refreshScanPending}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {isFetching || refreshScanPending ? 'Scanning...' : 'Refresh scan'}
                    </Button>
                </div>
            </header>

            <div className="space-y-4 px-6 py-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <StatsBadge icon={<CalendarClock className="h-3.5 w-3.5" />} text={`${data?.scannedItems ?? 0} scanned`} />
                    <StatsBadge icon={<CircleAlert className="h-3.5 w-3.5" />} text={`${data?.skippedItems ?? 0} skipped`} />
                    <StatsBadge text={`${data?.persistedCount ?? 0} saved`} />
                    {isLoading && <Spinner />}
                </div>

                <section className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">Create appointment from voice</p>
                        {voiceSupported ? (
                            <Button
                                type="button"
                                size="sm"
                                variant={isListening ? 'destructive' : 'outline'}
                                onClick={isListening ? stopVoiceCapture : startVoiceCapture}
                                disabled={createVoiceAppointmentPending || refreshScanPending}
                            >
                                {isListening ? (
                                    <>
                                        <Square className="mr-2 h-4 w-4" />
                                        Stop listening
                                    </>
                                ) : (
                                    <>
                                        <Mic className="mr-2 h-4 w-4" />
                                        Start voice capture
                                    </>
                                )}
                            </Button>
                        ) : (
                            <p className="text-xs text-muted-foreground">Voice capture is not supported in this browser. You can still type your appointment note below.</p>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Speak details like appointment date, time, provider, and location. We save this directly as an upcoming support notification.
                    </p>
                    <Textarea
                        className="mt-3"
                        placeholder="Example: Appointment with Dr Smith on 14 April at 2:30 PM at Auckland City Hospital."
                        value={voiceDraft}
                        onChange={(event) => {
                            setVoiceDraft(event.target.value)
                            setVoiceSaveSuccess(false)
                        }}
                    />
                    <div className="mt-3 flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            onClick={createAppointmentFromVoice}
                            disabled={!voiceDraft.trim() || createVoiceAppointmentPending || refreshScanPending}
                        >
                            {createVoiceAppointmentPending || refreshScanPending ? 'Creating appointment...' : 'Create appointment from voice note'}
                        </Button>
                    </div>
                    {voiceSaveSuccess ? (
                        <p className="mt-2 text-xs font-medium text-emerald-700">
                            Saved directly to Upcoming Support notifications.
                        </p>
                    ) : null}
                </section>

                {error ? (
                    <p className="text-sm text-destructive">
                        Could not generate upcoming support notifications right now.
                    </p>
                ) : notifications.length === 0 && pastNotifications.length === 0 ? (
                    <EmptyState text="No upcoming reminders found yet. Add letters or notes in your support folder and run a refresh scan." />
                ) : (
                    <div className="space-y-5">
                        <section>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Upcoming
                            </p>
                            {notifications.length === 0 ? (
                                <EmptyState text="No upcoming reminders." />
                            ) : (
                                <ul className="space-y-3">{notifications.map((item, index) => renderNotificationItem(item, index, false))}</ul>
                            )}
                        </section>

                        <section>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Completed / Past
                            </p>
                            {pastNotifications.length === 0 ? (
                                <EmptyState text="No past reminders." />
                            ) : (
                                <ul className="space-y-3">{pastNotifications.map((item, index) => renderNotificationItem(item, index, true))}</ul>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </article>
    )
}