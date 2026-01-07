import { FileAudio, FileText } from 'lucide-react'
import { AudioTranscribedContentViewer } from './AudioTranscribedContentViewer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useUpdateDocument } from '@/hooks/useUpdateDocument'
import { formatDate } from '@/lib/functions/functions'

interface Document {
  id: string
  name: string
  type: string
  createdAt: string
  transcribedContent?: string
}

interface DocumentAccordionProps {
  documents: Array<Document>
  editable?: boolean
}

export const DocumentAccordion = ({
  documents,
  editable = false,
}: DocumentAccordionProps) => {
  const { mutate: updateDocument } = useUpdateDocument()

  const getFileType = (name: string): 'audio' | 'pdf' | 'unknown' => {
    const ext = name.split('.').pop()?.toLowerCase()
    if (['mp3', 'wav', 'ogg', 'm4a', 'webm'].includes(ext || '')) return 'audio'
    if (ext === 'pdf') return 'pdf'
    return 'unknown'
  }

  if (!documents || documents.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Attachments ({documents.length})
      </h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {documents.map((doc: Document, idx: number) => {
          const fileType = getFileType(doc.name)

          return (
            <AccordionItem
              key={doc.id}
              value={`document-${idx}`}
              className="border rounded-lg shadow-sm bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  {fileType === 'audio' ? (
                    <FileAudio className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                  )}
                  <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                    <span className="font-medium text-sm truncate w-full text-left">
                      {doc.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.createdAt)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AudioTranscribedContentViewer
                  document={doc}
                  transcribedContent={doc.transcribedContent || ''}
                  editable={editable}
                  onUpdate={(docId, content) => {
                    updateDocument({
                      documentId: docId,
                      transcribedContent: content,
                    })
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
