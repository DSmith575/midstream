import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'

// This hook checks if the form is complete by ensuring all fields have values.
// It returns true if all fields are filled, otherwise false.
export const useIsReferralFormComplete = (form: UseFormReturn<any>) => {
  const values = useWatch({ control: form.control })

  const optionalFields = ['preferredName', 'disabilityDetails']

  return Object.entries(values).every(([key, value]) => {
    if (optionalFields.includes(key)) return true
    return value !== '' && value !== undefined && value !== null
  })
}
