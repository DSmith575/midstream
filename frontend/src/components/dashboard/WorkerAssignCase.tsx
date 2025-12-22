import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ReferralStatusBadge } from '@/components/referralForms/ReferralStatusBadge'
import { WorkerReferralFormClientView } from '@/components/referralForms/WorkerReferralFormClientView'
import { generateFormSections } from '@/lib/functions/formFunctions'

interface AssignWorkerProps {
  refId: string
  caseWorkerId: string
}

interface WorkerAssignCaseProps {
  caseWorkerId: string
  referralForm: any
  setOpen: (open: boolean) => void
  open: boolean
}

const apiKey = import.meta.env.VITE_API_BACKEND_URL

export const WorkerAssignCase = ({
  caseWorkerId,
  referralForm,
  setOpen,
  open,
}: WorkerAssignCaseProps) => {
  const formSections = generateFormSections(referralForm, {
    excludeKeys: ['assignedToWorker'],
  })

  if (!caseWorkerId) {
    return (
      <div className="text-red-500">
        You must be assigned a case worker to assign cases.
      </div>
    )
  }

  const handleAssignWorker = async ({
    refId,
    caseWorkerId,
  }: AssignWorkerProps) => {
    try {
      const response = await fetch(`${apiKey}assignCases/assignWorker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralId: refId,
          caseWorkerId: caseWorkerId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign worker')
      }
      return alert('Worker assigned successfully!')
    } catch (error) {
      console.error('Error assigning worker:', error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        {' '}
        {/* Close dialog on change */}
        <DialogContent className="overflow-y-auto sm:max-w-[425px] lg:max-h-[90vh] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {referralForm.user.personalInformation.firstName}{' '}
              {referralForm.user.personalInformation.lastName}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>test</DialogDescription>

          <Accordion type="single" collapsible className="w-full">
            {formSections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <WorkerReferralFormClientView refField={section.field} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className={'grid'}>
            <div className={'flex items-center gap-2'}>
              <Label htmlFor="submitStatus" className={'text-right'}>
                Status:
              </Label>
              <ReferralStatusBadge status={referralForm.status} />
            </div>
          </div>
          <div>
            {referralForm.assignedToWorker ? (
              <p className="text-sm text-muted-foreground">
                Assigned to:{' '}
                {referralForm.assignedToWorker.personalInformation.firstName}{' '}
                {referralForm.assignedToWorker.personalInformation.lastName}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No worker assigned
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
              onClick={() =>
                handleAssignWorker({
                  refId: referralForm.id,
                  caseWorkerId: caseWorkerId,
                })
              }
            >
              Assign Self
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
