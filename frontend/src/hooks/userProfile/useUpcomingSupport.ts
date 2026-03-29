import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'
import { fetchUpcomingSupportNotifications } from '@/lib/api/fetchUpcomingSupportNotifications'
import { patchUpcomingSupportReadStatus } from '@/lib/api/patchUpcomingSupportReadStatus'
import { patchUpcomingSupportDismissStatus } from '@/lib/api/patchUpcomingSupportDismissStatus'
import { patchUpcomingSupportMoveToUpcoming } from '@/lib/api/patchUpcomingSupportMoveToUpcoming'
import { patchUpcomingSupportDueDate } from '@/lib/api/patchUpcomingSupportDueDate'

export const useUpcomingSupport = (googleId: string) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['upcomingSupport', googleId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return fetchUpcomingSupportNotifications(googleId, token)
    },
    enabled: !!googleId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['upcomingSupport', googleId],
    })
  }

  const refreshScanMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return fetchUpcomingSupportNotifications(googleId, token, {
        rescan: true,
      })
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['upcomingSupport', googleId], response)
      toast.success('Upcoming support scan completed')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to refresh scan')
    },
  })

  const readStatusMutation = useMutation({
    mutationFn: async ({ notificationId, isRead }: { notificationId: string; isRead: boolean }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return patchUpcomingSupportReadStatus(googleId, notificationId, isRead, token)
    },
    onSuccess: async () => {
      await invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update read status')
    },
  })

  const dismissStatusMutation = useMutation({
    mutationFn: async ({
      notificationId,
      isDismissed,
    }: {
      notificationId: string
      isDismissed: boolean
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return patchUpcomingSupportDismissStatus(googleId, notificationId, isDismissed, token)
    },
    onSuccess: async () => {
      await invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update dismiss status')
    },
  })

  const moveToUpcomingMutation = useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return patchUpcomingSupportMoveToUpcoming(googleId, notificationId, token)
    },
    onSuccess: async () => {
      toast.success('Moved back to upcoming')
      await invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to move notification to upcoming')
    },
  })

  const dueDateMutation = useMutation({
    mutationFn: async ({
      notificationId,
      dueDateISO,
    }: {
      notificationId: string
      dueDateISO: string
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return patchUpcomingSupportDueDate(googleId, notificationId, dueDateISO, token)
    },
    onSuccess: async () => {
      toast.success('Due date updated')
      await invalidate()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update due date')
    },
  })

  return {
    ...query,
    refreshScan: refreshScanMutation.mutate,
    refreshScanPending: refreshScanMutation.isPending,
    setReadStatus: readStatusMutation.mutate,
    readStatusPending: readStatusMutation.isPending,
    setDismissStatus: dismissStatusMutation.mutate,
    dismissStatusPending: dismissStatusMutation.isPending,
    moveToUpcoming: moveToUpcomingMutation.mutate,
    moveToUpcomingPending: moveToUpcomingMutation.isPending,
    setDueDate: dueDateMutation.mutate,
    dueDatePending: dueDateMutation.isPending,
  }
}
