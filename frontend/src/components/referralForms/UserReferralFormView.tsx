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
import { Input } from '../ui/input';
import { PDFViewer } from '@react-pdf/renderer';
import { ReferralFormPDF } from './ReferralFormPDF';

import {useRef} from 'react'

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, referralId: string) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadAudio(file, referralId)
      .then(response => {
        console.log('Audio uploaded successfully:', response);
      })
      .catch(error => {
        console.error('Error uploading audio:', error);
      });
  }
}

const uploadAudio = async (file: File, referralId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('referralId', referralId);

  const response = await fetch('http://localhost:8000/upload-audio', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload audio');
  }

  alert('Audio uploaded successfully');

  return response.json();
}

export const UserReferralFormView = ({ referralForm }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <Button variant="outline" size="lg" className="" asChild>
        <DialogTrigger>
          {new Date(referralForm.createdAt).toLocaleDateString()}
        </DialogTrigger>
      </Button>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {referralForm.user.personalInformation.firstName}{' '}
            {referralForm.user.personalInformation.lastName}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <PDFViewer style={{ width: '30rem', height: '40rem' }}>
          <ReferralFormPDF referralForm={referralForm} />
        </PDFViewer>
        <DialogFooter>
          <Input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, referralForm.id)}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className={`mt-4 items-center justify-center bg-green-500 hover:bg-[#59b5e1]`}
          >
            Upload-Audio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
