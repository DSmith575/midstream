import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DocumentAccordion } from '@/components/accordion/DocumentAccordion'

const { updateDocumentMutateMock } = vi.hoisted(() => ({
  updateDocumentMutateMock: vi.fn(),
}))

vi.mock('@/hooks/useUpdateDocument', () => ({
  useUpdateDocument: () => ({
    mutate: updateDocumentMutateMock,
  }),
}))

vi.mock('@/lib/functions/functions', () => ({
  formatDate: () => '2026-03-31',
}))

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('DocumentAccordion', () => {
  it('returns nothing when documents list is empty', () => {
    const { container } = render(<DocumentAccordion documents={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders attachment heading and document entries', () => {
    render(
      <DocumentAccordion
        documents={[
          {
            id: 'd1',
            name: 'voice-note.mp3',
            type: 'AUDIO',
            createdAt: '2026-03-31T00:00:00.000Z',
            transcribedContent: 'hello',
          },
          {
            id: 'd2',
            name: 'report.pdf',
            type: 'PDF',
            createdAt: '2026-03-31T00:00:00.000Z',
            transcribedContent: 'summary',
          },
        ]}
      />,
    )

    expect(screen.getByText('Attachments (2)')).toBeTruthy()
    expect(screen.getByText('voice-note.mp3')).toBeTruthy()
    expect(screen.getByText('report.pdf')).toBeTruthy()
    expect(screen.getAllByText('2026-03-31').length).toBeGreaterThan(0)
  })

  it('propagates editor save via useUpdateDocument mutate', () => {
    render(
      <DocumentAccordion
        editable
        documents={[
          {
            id: 'd3',
            name: 'audio.wav',
            type: 'AUDIO',
            createdAt: '2026-03-31T00:00:00.000Z',
            transcribedContent: 'old text',
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Enable Editing/i }))
    fireEvent.change(screen.getByPlaceholderText('Transcribed content will appear here...'), {
      target: { value: 'new text' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

    expect(updateDocumentMutateMock).toHaveBeenCalledWith({
      documentId: 'd3',
      transcribedContent: 'new text',
    })
  })
})
