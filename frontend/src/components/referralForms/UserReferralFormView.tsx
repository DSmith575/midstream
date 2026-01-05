import { Eye } from 'lucide-react'
import { DocumentAccordion } from '../accordion/DocumentAccordion'
import { ReferralFormView } from './ReferralFormView'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const UserReferralFormView = ({ referralForm }: any) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          className="border border-primary/20 bg-gradient-to-b from-primary/5 to-primary/10 hover:text-white text-primary font-medium shadow-sm hover:shadow-md hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
          size="sm"
        >
          <Eye className="h-4 w-4" />
          <p>View Form:</p>
          <span>{new Date(referralForm.createdAt).toLocaleDateString()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] sm:max-w-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Referral Form - {referralForm.user.personalInformation.firstName}{' '}
            {referralForm.user.personalInformation.lastName}
          </DialogTitle>
          <DialogDescription>
            Complete referral information and supporting documents
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          <ReferralFormView referralForm={referralForm} />

          {referralForm.documents && referralForm.documents.length > 0 && (
            <div className="mt-4">
              <DocumentAccordion
                documents={referralForm.documents}
                editable={true}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
