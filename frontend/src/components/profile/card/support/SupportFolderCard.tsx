import { type ChangeEvent, useRef, useState } from 'react'
import { Camera, Download, FileText, Music2, Paperclip, Trash2, Upload } from 'lucide-react'
import { Spinner } from '@/components/spinner/Spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSupportFolder } from '@/hooks/userProfile'

interface SupportFolderCardProps {
  userId: string
}

export const SupportFolderCard = ({ userId }: SupportFolderCardProps) => {
  const isMobile = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [textName, setTextName] = useState('Support note')
  const [textContent, setTextContent] = useState('')
  const [itemPendingDelete, setItemPendingDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const {
    items,
    isLoading,
    error,
    uploadFile,
    uploadPending,
    createText,
    textPending,
    deleteItem,
    deletePending,
    handleDownload,
  } = useSupportFolder(userId)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    uploadFile(file)
    event.target.value = ''
  }

  const onCameraChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    uploadFile(file)
    event.target.value = ''
  }

  const onCreateText = () => {
    if (!textContent.trim()) return
    createText({
      name: textName.trim() || 'Support note',
      content: textContent.trim(),
    })
    setTextContent('')
  }

  const requestDelete = (id: string, name: string) => {
    setItemPendingDelete({ id, name })
  }

  const onConfirmDelete = () => {
    if (!itemPendingDelete) return
    deleteItem(itemPendingDelete.id)
    setItemPendingDelete(null)
  }

  const formatFileSize = (sizeBytes: number | null) => {
    if (!sizeBytes || sizeBytes <= 0) return 'N/A'
    if (sizeBytes < 1024) return `${sizeBytes} B`
    if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTypeIcon = (type: string) => {
    if (type === 'TEXT') return <FileText className="h-4 w-4" />
    if (type === 'AUDIO') return <Music2 className="h-4 w-4" />
    return <Paperclip className="h-4 w-4" />
  }

  return (
    <article className="col-span-1 w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10">
      <header className="border-b border-border/70 px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground">Support Folder</h3>
        <p className="text-sm text-muted-foreground">
          Store documents, audio, and text notes in one place.
        </p>
      </header>

      <div className="space-y-6 px-6 py-5">
        <section className="rounded-xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upload files
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload any supporting file such as forms, scans, audio clips, or PDFs.
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            onChange={onFileChange}
            className="hidden"
          />
          <Input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture={isMobile ? 'environment' : undefined}
            onChange={onCameraChange}
            className="hidden"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={uploadPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadPending ? 'Uploading...' : 'Upload file'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={uploadPending}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              {uploadPending ? 'Uploading...' : isMobile ? 'Take photo' : 'Upload image'}
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Create text file
          </p>
          <div className="mt-3 grid gap-3">
            <Input
              value={textName}
              onChange={(e) => setTextName(e.target.value)}
              placeholder="File name"
            />
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Write details for future reference"
              rows={5}
            />
            <Button
              type="button"
              disabled={textPending || !textContent.trim()}
              onClick={onCreateText}
            >
              <FileText className="mr-2 h-4 w-4" />
              {textPending ? 'Saving...' : 'Create text file'}
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border/70 bg-card/80 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stored items
            </p>
            {isLoading && <Spinner />}
          </div>

          {error ? (
            <p className="text-sm text-destructive">Failed to load support folder items.</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No items yet. Upload a file or create a text file to begin.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {getTypeIcon(item.type)}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {formatFileSize(item.sizeBytes)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletePending}
                      onClick={() => requestDelete(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Dialog
        open={Boolean(itemPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setItemPendingDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete support item?</DialogTitle>
            <DialogDescription>
              {itemPendingDelete
                ? `Are you sure you want to delete "${itemPendingDelete.name}"? This action cannot be undone.`
                : 'Are you sure you want to delete this item? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setItemPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletePending}
              onClick={onConfirmDelete}
            >
              {deletePending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  )
}
