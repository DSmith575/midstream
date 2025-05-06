import { useMemo, useReducer } from 'react';
import { Form } from "@/components/ui/form";
import { referralFormSchema } from '@/lib/schemas/referralFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@clerk/clerk-react';
import { z } from 'zod';
import { referralFormSteps } from "@/lib/formOptions/referralFormOptions";
import useCreateReferralForm from '@/hooks/userProfile/useCreateReferralForm';
import useUserProfile from '@/hooks/userProfile/useUserProfile';
import Spinner from '@/components/spinner/Spinner';
import StepNavigation from '@/components/forms/formComponents/StepNavigation';
import FormStepButtons from '@/components/forms/formComponents/FormStepButtons';
import { useNavigate } from '@tanstack/react-router';
import StepPersonalInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepPersonalInfo';
import StepLanguageInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepLanguageInfo';
import StepMedicalInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepMedicalInfo';
import StepDisabilityInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepDisabilityInfo';
import StepAdditionalInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepAdditionalInfo';
import StepReferralContactInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepRefContactInfo';
import StepEmergencyContactInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepEmergencyInfo';
import StepConsentInfo from '@/components/forms/referralForm/referralFormComponents/ReferralStepConsentInfo';

type Inputs = z.infer<typeof referralFormSchema>;

const preLoadedData = (userData: any) => ({
  firstName: userData?.personalInformation?.firstName ?? '',
  lastName: userData?.personalInformation?.lastName ?? '',
  title: userData?.personalInformation?.title ?? '',
  preferredName: userData?.personalInformation?.preferredName ?? '',
  dateOfBirth: userData?.personalInformation?.dateOfBirth
    ? new Date(userData.personalInformation.dateOfBirth).toISOString().split('T')[0]
    : '',
  gender: userData?.personalInformation?.gender ?? '',
  email: userData?.contactInformation?.email ?? '',
  phone: userData?.contactInformation?.phone ?? '',
  address: userData?.addressInformation?.address ?? '',
  suburb: userData?.addressInformation?.suburb ?? '',
  city: userData?.addressInformation?.city ?? '',
  postCode: userData?.addressInformation?.postCode ?? '',
  country: userData?.addressInformation?.country ?? '',
  firstLanguage: '',
  interpreter: '',
  culturalSupport: '',
  communicationNeeds: '',
  doctorName: '',
  doctorPhone: '',
  doctorAddress: '',
  doctorSuburb: '',
  doctorCity: '',
  nationalHealthIndex: '',
  disabilityType: '',
  disabilityDetails: '',
  disabilityReasonForReferral: '',
  disabilitySupportRequired: '',
  safety: '',
  otherImportantInformation: '',
  referrerFirstName: '',
  referrerLastName: '',
  referrerEmail: '',
  referrerPhone: '',
  referrerRelationship: '',
  emergencyContactFirstName: '',
  emergencyContactLastName: '',
  emergencyContactPhone: '',
  emergencyContactEmail: '',
  emergencyContactRelationship: '',
  provideInformation: '',
  shareInformation: '',
  contactedForAdditionalInformation: '',
  statisticalInformation: '',
  correctInformationProvided: '',
});

const stepReducer = (state: { current: number; previous: number }, action: 'next' | 'prev') => {
  const newStep = action === 'next' ? state.current + 1 : state.current - 1;
  return { current: newStep, previous: state.current };
};

const ReferralForm = () => {
  const { userId } = useAuth();
  const { isLoading, isError, userData } = useUserProfile(userId as string);
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateReferralForm(userId as string, () => {
    navigate({ to: `/dashboard` });
  });
  const preLoadData = useMemo(() => preLoadedData(userData), [userData]);


  const form = useForm<Inputs>({
    resolver: zodResolver(referralFormSchema),
    values: preLoadData,
  });

  const communicationNeedsValue = form.watch('communicationNeeds');
  const { trigger } = form;

  const next = async () => {
    const fields = referralFormSteps[step.current]?.fields;
    const isValid = await trigger(fields as (keyof Inputs)[], { shouldFocus: true });
    if (isValid && step.current < referralFormSteps.length - 1) {
      dispatch('next');
    }
  };

  const prev = () => {
    if (step.current > 0) {
      dispatch('prev');
    }
  };

  const [step, dispatch] = useReducer(stepReducer, { current: 0, previous: 0 });
  const delta = step.current - step.previous;

  const onSubmit = async (values: Inputs) => {
    const googleUserId = userId;
    if (!googleUserId) {
      return;
    }
    const referralDetails = {
      googleId: userId,
      userProfile: {
        firstName: values.firstName,
        lastName: values.lastName,
        title: values.title,
        preferredName: values.preferredName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
      },
      addressInformation: {
        address: values.address,
        suburb: values.suburb,
        city: values.city,
        postCode: values.postCode,
        country: values.country,
      },
      contactInformation: {
        email: values.email,
        phone: values.phone,
      },
      languageInfo: {
        firstLanguage: values.firstLanguage,
        interpreter: values.interpreter,
        culturalSupport: values.culturalSupport,
        communicationNeeds: values.communicationNeeds,
      },
      doctorInfo: {
        doctorName: values.doctorName,
        doctorPhone: values.doctorPhone,
        doctorAddress: values.doctorAddress,
        doctorSuburb: values.doctorSuburb,
        doctorCity: values.doctorCity,
        nationalHealthIndex: values.nationalHealthIndex,
      },
      disabilityInfo: {
        disabilityType: values.disabilityType,
        disabilityDetails: values.disabilityDetails,
        disabilityReasonForReferral: values.disabilityReasonForReferral,
        disabilitySupportRequired: values.disabilitySupportRequired,
      },
      additionalInfo: {
        safety: values.safety,
        otherImportantInformation: values.otherImportantInformation,
      },
      referrerInfo: {
        referrerFirstName: values.referrerFirstName,
        referrerLastName: values.referrerLastName,
        referrerEmail: values.referrerEmail,
        referrerPhone: values.referrerPhone,
        referrerRelationship: values.referrerRelationship,
      },
      emergencyContactInfo: {
        emergencyContactFirstName: values.emergencyContactFirstName,
        emergencyContactLastName: values.emergencyContactLastName,
        emergencyContactPhone: values.emergencyContactPhone,
        emergencyContactEmail: values.emergencyContactEmail,
        emergencyContactRelationship: values.emergencyContactRelationship,
      },
      consentInfo: {
        provideInformation: values.provideInformation,
        shareInformation: values.shareInformation,
        contactedForAdditionalInformation: values.contactedForAdditionalInformation,
        statisticalInformation: values.statisticalInformation,
        correctInformationProvided: values.correctInformationProvided,
      },
      companyId: 1,
    };

    try {
       mutate(referralDetails);

    } catch (error) {
      console.error(error);
    }
  };

  return (
		<section className="flex flex-col justify-between px-10 pt-10">
			{/* Loading State */}
			{isLoading && (
				<div className="mt-12 flex items-center justify-center">
					<Spinner />
				</div>
			)}

			{!isLoading && !isError && userData && (
				<>
					<StepNavigation
						steps={referralFormSteps}
						currentStep={step.current}
					/>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="mt-4 space-y-2 py-4">
							{step.current === 0 && (
								<StepPersonalInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 1 && (
								<StepLanguageInfo
									form={form}
									delta={delta}
									communicationNeedsValue={communicationNeedsValue}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 2 && (
								<StepMedicalInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 3 && (
								<StepDisabilityInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 4 && (
								<StepAdditionalInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 5 && (
								<StepReferralContactInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 6 && (
								<StepEmergencyContactInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							{step.current === 7 && (
								<StepConsentInfo
									form={form}
									delta={delta}
									header={referralFormSteps[step.current].name}
									subtitle={referralFormSteps[step.current].subtitle}
								/>
							)}

							<FormStepButtons
								currentStep={step.current}
								profileFormStepsLength={referralFormSteps.length}
								prevButtonType={"button"}
								nextButtonType={"button"}
								prevButtonText={"Previous"}
								nextButtonText={"Next"}
								onClickPrev={prev}
								onClickNext={next}
								submitButtonText={isPending ? "Submitting..." : "Submit"}
								submitButtonType={"submit"}
							/>
						</form>
					</Form>
				</>
			)}
		</section>
	);
};

export default ReferralForm;
