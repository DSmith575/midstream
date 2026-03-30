import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AudioTranscribedContentViewer } from '@/components/accordion/AudioTranscribedContentViewer'

describe('AudioTranscribedContentViewer', () => {
  it('renders read-only state when editable is false', () => {
    render(
      <AudioTranscribedContentViewer
        document={{ id: 'doc-1', name: 'audio-note.wav' }}
        transcribedContent='Initial content'
      />,
    )

    expect(screen.getByText('Transcribed Content')).toBeTruthy()
    expect(screen.getByText('View the transcribed content from the audio file')).toBeTruthy()
    expect(screen.getByDisplayValue('Initial content')).toHaveProperty('disabled', true)
    expect(screen.queryByRole('button', { name: /Enable Editing/i })).toBeNull()
  })

  it('enables editing and saves updated content', () => {
    const onUpdate = vi.fn()

    render(
      <AudioTranscribedContentViewer
        document={{ id: 'doc-2', name: 'recording.mp3' }}
        transcribedContent='Original'
        editable
        onUpdate={onUpdate}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Enable Editing/i }))

    const textarea = screen.getByPlaceholderText('Transcribed content will appear here...')
    expect(textarea).toHaveProperty('disabled', false)

    fireEvent.change(textarea, { target: { value: 'Updated transcription' } })
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))

    expect(onUpdate).toHaveBeenCalledWith('doc-2', 'Updated transcription')
    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('cancel reverts content to initial value', () => {
    render(
      <AudioTranscribedContentViewer
        document={{ id: 'doc-3', name: 'meeting.webm' }}
        transcribedContent='Start value'
        editable
        onUpdate={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Enable Editing/i }))

    const textarea = screen.getByPlaceholderText('Transcribed content will appear here...')
    fireEvent.change(textarea, { target: { value: 'Temporary edit' } })
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))

    expect(screen.getByDisplayValue('Start value')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Enable Editing/i })).toBeTruthy()
  })
})
