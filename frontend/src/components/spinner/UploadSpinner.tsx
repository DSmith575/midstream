import { useEffect } from 'react'

import { Spinner } from './Spinner'

export const UploadSpinner = ({ text }: { text: string }) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="alert"
      aria-live="polite"
      aria-busy="true"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-xl flex flex-col items-center shadow-2xl">
        <Spinner className={'w-24 h-24'} />

        <div className="text-center mt-5">
          <p>{text}</p>
          <p>Do not refresh or close the page</p>
        </div>
      </div>
    </div>
  )
}
