import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/clerk-react'
import type { z } from 'zod'
import { SelectItem } from '@/components/ui/select'
import { Form } from '@/components/ui/form'
import { FormInput, FormSelect } from '@/components/forms/formComponents'
import { servicePlanEntryFormSchema } from '@/lib/schemas/servicePlanEntryFormSchema'
import {
  useCreateServicePlanEntry,
  useGetServiceCategories,
} from '@/hooks/servicePlan'
import { Button } from '@/components/ui/button'

type Inputs = z.infer<typeof servicePlanEntryFormSchema>
interface ServicePlanEntryFormProps {
  servicePlanId: string
  onSuccess: (data: any) => void
}

export const ServicePlanEntryForm = ({
  servicePlanId,
  onSuccess,
}: ServicePlanEntryFormProps) => {
  const { mutate } = useCreateServicePlanEntry(servicePlanId, onSuccess)
  const { isLoading, data: { data: serviceCategories } = { data: {} } } =
    useGetServiceCategories()
  const user = useUser()

  const form = useForm<Inputs>({
    resolver: zodResolver(servicePlanEntryFormSchema),
    defaultValues: {
      serviceCategoryId: '',
      hours: 0,
      minutes: 0,
      comment: '',
    },
  })

  const onSubmit = (values: Inputs) => {
    try {
      mutate({
        servicePlanId,
        userId: user.user?.id,
        allocatedMinutes: values.hours * 60 + values.minutes,
        ...values,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="flex flex-col justify-between px-10 py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 space-y-8 py-4"
        >
          <FormSelect
            control={form.control}
            fieldName="serviceCategoryId"
            formLabel="Category"
            selectPlaceholder="Category"
            children={
              isLoading ? (
                <div />
              ) : (
                serviceCategories.map(
                  (
                    category: { id: string; serviceName: string },
                    index: number,
                  ) => (
                    <SelectItem key={index} value={category.id}>
                      {category.serviceName}
                    </SelectItem>
                  ),
                )
              )
            }
          />
          <FormInput
            control={form.control}
            type="number"
            fieldName="hours"
            formLabel="Hours"
            placeholder="0"
          />
          <FormInput
            control={form.control}
            type="number"
            fieldName="minutes"
            formLabel="Minutes"
            placeholder="0"
          />
          <FormInput
            control={form.control}
            fieldName="comment"
            formLabel="Comment"
          />
          <Button
            variant="outline"
            size="lg"
            className="rounded bg-green-500 px-4 py-2 font-bold text-black hover:bg-green-600"
            type="submit"
          >
            Add Service Entry
          </Button>
        </form>
      </Form>
    </section>
  )
}
