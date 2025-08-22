import { Spinner } from "./Spinner";

export const UploadSpinner = () => {
  return (
      <div className="fixed inset-0 bg-[rgba(0, 0, 0, 0.5)] opacity-90 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl flex flex-col items-center">
              <Spinner className={'w-24 h-24'} />

              <div className="text-center mt-5">
                <p>Processing audio...</p>
                <p>Do not refresh or close the page</p>
              </div>
            </div>
          </div>
  )
}