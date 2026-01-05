import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/functions/functions'

interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

interface AddNotesDialogProps {
  formId: string
  disabled?: boolean
  onSave: (formId: string, content: string) => void
  existingNotes?: Array<Note>
}

export const AddNotesDialog = ({
  formId,
  disabled,
  onSave,
  existingNotes = [],
}: AddNotesDialogProps) => {
  const [open, setOpen] = useState(false)
  const [newNote, setNewNote] = useState('')

  const handleSave = () => {
    if (newNote.trim()) {
      onSave(formId, newNote)
      setNewNote('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size="sm"
          className="border border-primary/20 hover:text-white bg-gradient-to-b from-primary/5 to-primary/10 text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
        >
          <FileText className="h-4 w-4" />
          {existingNotes.length > 0
            ? `Notes (${existingNotes.length})`
            : 'Add notes'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Referral Notes</DialogTitle>
          <DialogDescription>
            View previous notes and add new observations or context.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto max-h-[55vh]">
          {existingNotes.length > 0 && (
            <div className="grid gap-2">
              <Label>Previous Notes</Label>
              <div className="max-h-[200px] overflow-y-auto rounded-md border p-4 space-y-4">
                {existingNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border bg-muted/30 p-3 text-sm break-words overflow-hidden"
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="new-note">
              <Plus className="inline h-4 w-4 mr-1" />
              Add New Note
            </Label>
            <Textarea
              id="new-note"
              placeholder="Enter additional information, context, or observations..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!newNote.trim()}>
            Save note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
