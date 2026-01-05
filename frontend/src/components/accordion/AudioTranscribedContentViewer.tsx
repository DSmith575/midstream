import { useState } from 'react'
import { Edit, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PdfViewerProps {
  document: {
    id: string
    name: string
  }
  transcribedContent?: string
  onUpdate?: (documentId: string, content: string) => void
  editable?: boolean
}

export const AudioTranscribedContentViewer = ({
  document,
  transcribedContent = '',
  onUpdate,
  editable = false,
}: PdfViewerProps) => {
  const [content, setContent] = useState(transcribedContent)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (content.trim() && onUpdate) {
      onUpdate(document.id, content)
      setIsEditing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transcribed Content</CardTitle>
        <CardDescription>
          {editable
            ? 'Edit the transcribed content below and save changes if anything needs correction'
            : 'View the transcribed content from the audio file'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transcribed-content">
            Content from {document.name}
          </Label>
          <Textarea
            id="transcribed-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Transcribed content will appear here..."
            className="min-h-[400px] font-mono text-sm"
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {editable && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Enable Editing
            </Button>
          )}
          {editable && isEditing && (
            <>
              <Button
                onClick={handleSave}
                disabled={!content.trim()}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setContent(transcribedContent)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
