import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'
import {
  fetchSupportFolderItems,
  type SupportFolderItem,
} from '@/lib/api/fetchSupportFolderItems'
import { postSupportFolderUpload } from '@/lib/api/postSupportFolderUpload'
import { postSupportFolderTextItem } from '@/lib/api/postSupportFolderTextItem'
import { deleteSupportFolderItem } from '@/lib/api/deleteSupportFolderItem'
import { downloadSupportFolderItem } from '@/lib/api/downloadSupportFolderItem'

export const useSupportFolder = (googleId: string) => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['supportFolderItems', googleId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const response = await fetchSupportFolderItems(googleId, token)
      return response.data || []
    },
    enabled: !!googleId,
    staleTime: 30 * 1000,
  })

  const refreshItems = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['supportFolderItems', googleId],
    })
  }

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return postSupportFolderUpload(googleId, file, token)
    },
    onSuccess: async () => {
      toast.success('File uploaded to support folder')
      await refreshItems()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload file')
    },
  })

  const createTextMutation = useMutation({
    mutationFn: async (payload: { name: string; content: string }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return postSupportFolderTextItem(googleId, payload, token)
    },
    onSuccess: async () => {
      toast.success('Text file created in support folder')
      await refreshItems()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create text file')
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteSupportFolderItem(googleId, itemId, token)
    },
    onSuccess: async () => {
      toast.success('Support folder item deleted')
      await refreshItems()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete item')
    },
  })

  const handleDownload = async (item: Pick<SupportFolderItem, 'id' | 'name'>) => {
    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const blob = await downloadSupportFolderItem(googleId, item.id, token)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Download failed')
      toast.error(err.message)
    }
  }

  return {
    items: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    uploadFile: uploadFileMutation.mutate,
    uploadPending: uploadFileMutation.isPending,
    createText: createTextMutation.mutate,
    textPending: createTextMutation.isPending,
    deleteItem: deleteItemMutation.mutate,
    deletePending: deleteItemMutation.isPending,
    handleDownload,
  }
}
