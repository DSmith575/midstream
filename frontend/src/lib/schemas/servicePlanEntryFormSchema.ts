import { z } from 'zod'

export const servicePlanEntryFormSchema = z.object({
  serviceCategoryId: z.string().nonempty({ message: 'Please select an option' }),
  hours: z.coerce.number().int().gte(0),
  minutes: z.coerce.number().int().gte(0),
  comment: z.string() // Not required
})