import { z } from 'zod';

/**
 * Validation schema for creating a user profile
 */
export const createUserProfileSchema = z.object({
  googleId: z.string().min(1, 'Google ID is required'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  title: z.string().min(1, 'Title is required').max(20),
  preferredName: z.string().max(100).optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  address: z.string().min(1, 'Address is required').max(200),
  suburb: z.string().min(1, 'Suburb is required').max(100),
  city: z.string().min(1, 'City is required').max(100),
  postCode: z.string().min(1, 'Post code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

/**
 * Validation schema for referral form creation
 */
export const createReferralFormSchema = z.object({
  googleId: z.string().min(1, 'Google ID is required'),
  userProfile: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    title: z.string().max(20),
    preferredName: z.string().max(100).optional(),
    gender: z.string(),
    dateOfBirth: z.string(),
  }),
  addressInformation: z.object({
    address: z.string().max(200),
    suburb: z.string().max(100),
    city: z.string().max(100),
    postCode: z.string().max(20),
    country: z.string().max(100),
  }),
  contactInformation: z.object({
    email: z.string().email(),
    phone: z.string().max(20),
  }),
  languageInfo: z.object({
    firstLanguage: z.string(),
    interpreter: z.string(),
    culturalSupport: z.string(),
    communicationNeeds: z.string(),
    communicationNeedsDetails: z.string().optional(),
  }),
  doctorInfo: z.object({
    doctorName: z.string().max(200),
    doctorPhone: z.string().max(20),
    doctorAddress: z.string().max(200),
    doctorSuburb: z.string().max(100),
    doctorCity: z.string().max(100),
    nationalHealthIndex: z.string().max(50),
  }),
  disabilityInfo: z.object({
    disabilityType: z.string(),
    disabilityDetails: z.string().optional(),
    disabilitySupportDetails: z.string().optional(),
    disabilityReasonForReferral: z.string(),
    disabilitySupportRequired: z.string(),
  }),
  additionalInfo: z.object({
    safety: z.string(),
    otherImportantInformation: z.string(),
  }),
  referrerInfo: z.object({
    referrerFirstName: z.string().max(100),
    referrerLastName: z.string().max(100),
    referrerEmail: z.string().email(),
    referrerPhone: z.string().max(20),
    referrerRelationship: z.string(),
  }),
  emergencyContactInfo: z.object({
    emergencyContactFirstName: z.string().max(100),
    emergencyContactLastName: z.string().max(100),
    emergencyContactEmail: z.string().email(),
    emergencyContactPhone: z.string().max(20),
    emergencyContactRelationship: z.string(),
  }),
  consentInfo: z.object({
    provideInformation: z.string(),
    shareInformation: z.string(),
    contactedForAdditionalInformation: z.string(),
    statisticalInformation: z.string(),
    correctInformationProvided: z.string(),
  }),
  companyId: z.string().min(1, 'Company ID is required'),
});

/**
 * Validation schema for referral note creation
 */
export const createReferralNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000),
});

/**
 * Validation schema for checklist update
 * Accepts either a specific field/value pair OR a partial object
 * with one or more boolean fields (audio, notes, review, submit).
 */
export const updateChecklistSchema = z.union([
  z.object({
    checklistField: z.enum(['audio', 'notes', 'review', 'submit']),
    value: z.boolean(),
  }),
  z
    .object({
      audio: z.boolean().optional(),
      notes: z.boolean().optional(),
      review: z.boolean().optional(),
      submit: z.boolean().optional(),
    })
    .refine(
      (obj) =>
        typeof obj.audio === 'boolean' ||
        typeof obj.notes === 'boolean' ||
        typeof obj.review === 'boolean' ||
        typeof obj.submit === 'boolean',
      { message: 'At least one checklist field must be provided' }
    ),
]);
