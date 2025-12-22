import { ServicePlanSummary } from '../servicePlan/ServicePlanSummary'
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
import { useEditServicePlan } from '@/hooks/servicePlan/useEditServicePlan'

interface CaseModalProps {
  caseData: any
  setOpen: (open: boolean) => void
  open: boolean
}

export const CaseModal = ({ caseData, setOpen, open }: CaseModalProps) => {
  const { editServicePlan } = useEditServicePlan(
    caseData.id,
    caseData?.servicePlan?.id,
  )
  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        {' '}
        {/* Close dialog on change */}
        <DialogContent className="overflow-y-auto sm:max-w-[425px] lg:max-h-[90vh] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {caseData.user.personalInformation.firstName}{' '}
              {caseData.user.personalInformation.lastName}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>Current Service Case Status</DialogDescription>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem key={0} value={'item-0'}>
              <AccordionTrigger>Assessment Status</AccordionTrigger>
              <AccordionContent>
                No assessment data available, schedule an assessment?
              </AccordionContent>
            </AccordionItem>
            <AccordionItem key={1} value={'item-1'}>
              <AccordionTrigger>Service Plan Summary</AccordionTrigger>
              <AccordionContent>
                <ServicePlanSummary
                  serviceList={caseData?.servicePlan?.services}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className={'grid'}>
            <div className={'flex items-center gap-2'}>
              <Label htmlFor="submitStatus" className={'text-right'}>
                Status:
              </Label>
              <ReferralStatusBadge status={caseData.referralForm.status} />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Assigned to: {caseData.caseWorker.personalInformation.firstName}{' '}
              {caseData.caseWorker.personalInformation.lastName}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
              onClick={() => editServicePlan()}
            >
              Edit Service Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
