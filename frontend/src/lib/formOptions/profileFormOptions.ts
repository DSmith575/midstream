import type { Steps } from '@/lib/profileInterfaces'

export const titleSelectOptions: string[] = ['Mr', 'Mrs', 'Miss', 'Other']
export const genderSelectOptions: string[] = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
]

export const profileFormSteps: Steps[] = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    subtitle: 'Provide your personal details.',
    fields: [
      'firstName',
      'lastName',
      'title',
      'preferredName',
      'dateOfBirth',
      'gender',
    ],
  },
  {
    id: 'Step 2',
    name: 'Contact Information',
    subtitle: 'Provide your contact information',
    fields: ['email', 'phone'],
  },
  {
    id: 'Step 3',
    name: 'Address',
    subtitle: 'Provide your address details.',
    fields: ['address', 'suburb', 'city', 'postCode', 'country'],
  },
  {
    id: 'Step 4',
    name: 'Complete',
    subtitle: 'Please check that all information is correct.',
    fields: ['complete'],
  },
]
