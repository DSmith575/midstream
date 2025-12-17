import { PDFViewer } from '@react-pdf/renderer'
import { Eye } from 'lucide-react'
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
  DialogClose,
} from '@/components/ui/dialog'

export const UserReferralFormView = ({ referralForm }: any) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="border border-primary/20 bg-linear-to-b from-primary/5 to-primary/10 hover:text-white text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15 transition-all duration-200" size="sm">
          <Eye className="h-4 w-4" />
          <p>View Form:</p>
          <span>{new Date(referralForm.createdAt).toLocaleDateString()}</span>
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
