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
import { PDFViewer } from '@react-pdf/renderer';
import { ReferralFormPDF } from './ReferralFormPDF';

export const UserReferralFormView = ({ referralForm }: any) => {
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
          <Button
            variant="outline"
            size="lg"
            className="mt-4 items-center justify-center"
          >
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
