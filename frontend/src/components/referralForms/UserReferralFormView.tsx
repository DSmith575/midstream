import { PDFViewer } from '@react-pdf/renderer'
import { PdfAccordion } from '../accordion'
import { ReferralFormPDF } from './ReferralFormPDF'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'


export const UserReferralFormView = ({ referralForm }: any) => {


  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          {new Date(referralForm.createdAt).toLocaleDateString()}
        </Button>
      </DialogTrigger>
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

        <PdfAccordion documents={referralForm.documents} />

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
