import { useState } from 'react'
import { AlertTriangle, CalendarClock, CircleAlert, RefreshCw } from 'lucide-react'
import { Spinner } from '@/components/spinner/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpcomingSupport } from '@/hooks/userProfile'

const urgencyStyles: Record<'LOW' | 'MEDIUM' | 'HIGH', string> = {
    LOW: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    HIGH: 'bg-red-500/10 text-red-700 border-red-500/30',
}

const formatDate = (value: string | null) => {
    if (!value) return 'Date not specified'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Date not specified'
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })
}

const toLocalDateTimeValue = (value: string | null) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const offsetMs = date.getTimezoneOffset() * 60 * 1000
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

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
    } = useUpcomingSupport(userId)
    const notifications = data?.data || []
    const pastNotifications = data?.pastData || []
    const actionPending = readStatusPending || dismissStatusPending || moveToUpcomingPending || dueDatePending
    const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null)
    const [editedDateValue, setEditedDateValue] = useState('')

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
                <p>Due: {formatDate(item.dueDateISO)}</p>
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
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {data?.scannedItems ?? 0} scanned
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
                        <CircleAlert className="h-3.5 w-3.5" />
                        {data?.skippedItems ?? 0} skipped
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-1">
                        {data?.persistedCount ?? 0} saved
                    </span>
                    {isLoading && <Spinner />}
                </div>

                {error ? (
                    <p className="text-sm text-destructive">
                        Could not generate upcoming support notifications right now.
                    </p>
                ) : notifications.length === 0 && pastNotifications.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                        No upcoming reminders found yet. Add letters or notes in your support folder and run a refresh scan.
                    </div>
                ) : (
                    <div className="space-y-5">
                        <section>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Upcoming
                            </p>
                            {notifications.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                                    No upcoming reminders.
                                </div>
                            ) : (
                                <ul className="space-y-3">{notifications.map((item, index) => renderNotificationItem(item, index, false))}</ul>
                            )}
                        </section>

                        <section>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Completed / Past
                            </p>
                            {pastNotifications.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                                    No past reminders.
                                </div>
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