import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'

// This hook checks if the form is complete by ensuring all fields have values.
// It returns true if all fields are filled, otherwise false.
export const useIsReferralFormComplete = (form: UseFormReturn<any>) => {
  const values = useWatch({ control: form.control })

  return Object.values(values).every(
    (value) => value !== '' && value !== undefined && value !== null,
  )
}
