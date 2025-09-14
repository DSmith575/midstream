import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ServicePlanEntryForm } from '../forms/servicePlanEntry/ServicePlanEntryForm'

interface NewEntryModalProps {
  servicePlanId: string,
  setOpen: (open: boolean) => void
  open: boolean
}

export const NewEntryModal = ({
  servicePlanId,
  setOpen,
  open,
}: NewEntryModalProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        {' '}
        {/* Close dialog on change */}
        <DialogContent className="overflow-y-auto sm:max-w-[425px] lg:max-h-[90vh] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              New Service Entry
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>Allocating hours for service</DialogDescription>
          <ServicePlanEntryForm
            servicePlanId={servicePlanId}
            onSuccess={() => setOpen(false)}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </>
  )
}