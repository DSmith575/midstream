import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PdfAccordion } from '@/components/accordion/PdfAccordion'

const { convertStringToPdfMock } = vi.hoisted(() => ({
  convertStringToPdfMock: vi.fn(() => 'blob:pdf-url'),
}))

vi.mock('@/lib/functions/pdfs/pdfFunctions', () => ({
  convertStringToPdf: convertStringToPdfMock,
}))

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('PdfAccordion', () => {
  it('renders each pdf name', () => {
    render(
      <PdfAccordion
        documents={[
          { name: 'one.pdf', rawBytes: 'AAA' },
          { name: 'two.pdf', rawBytes: 'BBB' },
        ]}
      />,
    )

    expect(screen.getByText('one.pdf')).toBeTruthy()
    expect(screen.getByText('two.pdf')).toBeTruthy()
  })

  it('uses convertStringToPdf for iframe source', () => {
    render(<PdfAccordion documents={[{ name: 'doc.pdf', rawBytes: 'RAW_BYTES' }]} />)

    expect(convertStringToPdfMock).toHaveBeenCalledWith('RAW_BYTES')

    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.getAttribute('src')).toBe('blob:pdf-url')
  })
})
