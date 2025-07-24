import { z } from 'zod'

export const referralFormSchema = z
  .object({
    firstName: z.string({ message: 'First name is required' }).nonempty(),
    lastName: z.string({ message: 'Last name is required' }).nonempty(),
    title: z.string({ message: 'Please select a title' }).nonempty(),
    preferredName: z.string().optional(),
    dateOfBirth: z
      .string({ message: 'Please enter a valid date of birth' })
      .nonempty(),
    gender: z
      .string({ message: 'Please select from the options above' })
      .nonempty(),
    email: z.string({ message: 'Please enter a valid email' }).email(),
    phone: z
      .string({ message: 'Please enter a valid phone number' })
      .nonempty(),
    address: z.string({ message: 'Please enter a valid address' }).nonempty(),
    suburb: z.string({ message: 'Please enter a valid suburb' }).nonempty(),
    city: z.string({ message: 'Please enter a valid city' }).nonempty(),
    postCode: z
      .string()
      .min(4, { message: 'Postcode must be at least 4 characters' })
      .regex(/^\d+$/, { message: 'Postcode must contain only digits' })
      .max(4, 'Postcode must be at most 4 digits'),
    country: z.string().nonempty(),
    firstLanguage: z
      .string()
      .nonempty({ message: 'A language must be selected' }),
    interpreter: z.string().nonempty({ message: 'Please select an option.' }),
    culturalSupport: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    communicationNeeds: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    communicationNeedsDetails: z
      .string()
      .min(0)
      .max(150, { message: '150 character limit' })
      .optional(),
    doctorName: z.string().nonempty({ message: 'Doctor/GP name is required' }),
    doctorPhone: z
      .string()
      .nonempty({ message: 'Doctor/GP phone is required' }),
    doctorAddress: z
      .string()
      .nonempty({ message: 'Medical Centre address is required' }),
    doctorSuburb: z
      .string()
      .nonempty({ message: 'Medical Centre suburb is required' }),
    doctorCity: z
      .string()
      .nonempty({ message: 'Medical Centre city is required' }),
    nationalHealthIndex: z
      .string()
      .nonempty({ message: 'NHI Number required' })
      .toUpperCase(),
    disabilityType: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    disabilityDetails: z.string().optional(),
    disabilityReasonForReferral: z
      .string()
      .max(150)
      .nonempty({
        message: 'Please enter the reason you are filling this application.',
      }),
    disabilitySupportRequired: z
      .string()
      .max(150)
      .nonempty({ message: 'Please enter the support required.' }),
    safety: z
      .string()
      .max(150)
      .nonempty({ message: 'Please enter safety information.' }),
    otherImportantInformation: z
      .string()
      .max(150)
      .nonempty({ message: 'Please enter other important information.' }),
    referrerFirstName: z
      .string()
      .nonempty({ message: "Please enter the referrer's first name." }),
    referrerLastName: z
      .string()
      .nonempty({ message: "Please enter the referrer's last name." }),
    referrerEmail: z.string().email({ message: 'Please enter a valid email.' }),
    referrerPhone: z
      .string()
      .nonempty({ message: "Please enter the referrer's phone number." }),
    referrerRelationship: z
      .string()
      .nonempty({ message: "Please enter the referrer's relationship." }),
    emergencyContactFirstName: z
      .string()
      .nonempty({
        message: "Please enter the emergency contact's first name.",
      }),
    emergencyContactLastName: z
      .string()
      .nonempty({ message: "Please enter the emergency contact's last name." }),
    emergencyContactPhone: z
      .string()
      .nonempty({
        message: "Please enter the emergency contact's phone number.",
      }),
    emergencyContactEmail: z
      .string()
      .email({ message: 'Please enter a valid email.' }),
    emergencyContactRelationship: z
      .string()
      .nonempty({
        message: "Please enter the emergency contact's relationship.",
      }),
    provideInformation: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    shareInformation: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    contactedForAdditionalInformation: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    statisticalInformation: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
    correctInformationProvided: z
      .string()
      .nonempty({ message: 'Please select an option.' }),
  })
  .refine(
    (data) =>
      data.communicationNeeds !== 'Yes' ||
      (data.communicationNeedsDetails &&
        data.communicationNeedsDetails.trim() !== ''),
    {
      message: 'Details are required when communication needs is selected.',
      path: ['communicationNeedsDetails'],
    },
  )
