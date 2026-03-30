import { describe, expect, it } from 'vitest'

import {
  AudioTranscribedContentViewer,
  DocumentAccordion,
  PdfAccordion,
} from '@/components/accordion'

describe('accordion index exports', () => {
  it('exports all accordion components', () => {
    expect(AudioTranscribedContentViewer).toBeTruthy()
    expect(DocumentAccordion).toBeTruthy()
    expect(PdfAccordion).toBeTruthy()
  })
})
