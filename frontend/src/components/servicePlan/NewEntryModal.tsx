import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormInput } from '../forms/formComponents'

interface ServiceCategory {
  serviceName: string,
  flexibleHours: boolean,
  id: string
}

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

  // const { submitServicePlanEntry } = useSubmitServicePlanEntry(servicePlanId);
  
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
          <fieldset>
            <label>
              Category
            </label>
            <FormInput />
          </fieldset>
          <fieldset>
            <label>
              Allocated Hours
            </label>
            <input id="hours" />
          </fieldset>
          <fieldset>
            <label>
              Comment
            </label>
            <input id="comment" />
          </fieldset>


          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
              // onClick={() => submitServicePlanEntry()}
            >
              Add Service Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}