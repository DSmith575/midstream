import { useMemo, useReducer } from "react";
import { Form } from "@/components/ui/form";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { referralFormSteps } from "@/lib/formOptions/referralFormOptions";
import MotionContainer from "../profileForm/profileFormComponents/MotionContainer";
import FormStepButtons from "../profileForm/profileFormComponents/FormStepButtons";
import { useAuth } from "@clerk/clerk-react";
import useUserProfile from "@/hooks/userProfile/useUserProfile";
import Spinner from "@/components/spinner/Spinner";
import StepNavigation from "../profileForm/profileFormComponents/StepNavigation";
import {
	AddressInformationProps,
	ContactInformationProps,
	UserInformationProps,
} from "@/interfaces/profileInterfaces";
import StepPersonalInfo from "./referralFormComponents/ReferralStepPersonalInfo";
import StepLanguageInfo from "./referralFormComponents/ReferralStepLangaugeInfo";
import StepMedicalInfo from "./referralFormComponents/ReferralStepMedicalInfo";
import StepDisabilityInfo from "./referralFormComponents/ReferralStepDisabilityInfo";
import StepAdditionalInfo from "./referralFormComponents/ReferralStepAdditionalInfo";
import StepReferralContactInfo from "./referralFormComponents/ReferralStepRefContactInfo";
import StepEmergencyContactInfo from "./referralFormComponents/ReferralStepEmergencyInfo";

type Inputs = z.infer<typeof referralFormSchema>;
type FieldName = keyof Inputs;

interface ReferralFormProps {
	firstName: UserInformationProps["firstName"];
	lastName: UserInformationProps["lastName"];
	title: UserInformationProps["title"];
	preferredName: UserInformationProps["preferredName"];
	dateOfBirth: UserInformationProps["dateOfBirth"];
	gender: UserInformationProps["gender"];
	email: ContactInformationProps["email"];
	phone: ContactInformationProps["phone"];
	address: AddressInformationProps["address"];
	suburb: AddressInformationProps["suburb"];
	city: AddressInformationProps["city"];
	postCode: AddressInformationProps["postCode"];
	country: AddressInformationProps["country"];
	firstLanguage: string;
	interpreter: string;
	culturalSupport: string;
	communicationNeeds: string;
	doctorName: string;
	doctorPhone: string;
	doctorAddress: string;
	doctorSuburb: string;
	doctorCity: string;
	nationalHealthIndex: string;
	disabilityType: string;
	disabilityDetails: string;
	disabilitySupportDetails: string;
	disabilityReasonForReferral: string;
	disabilitySupportRequired: string;
	safety: string;
	otherImportantInformation: string;
	referrerFirstName: string;
	referrerLastName: string;
	referrerEmail: string;
	referrerPhone: string;
	referrerRelationship: string;
	emergencyContactFirstName: string;
	emergencyContactLastName: string;
	emergencyContactPhone: string;
	emergencyContactEmail: string;
	emergencyContactRelationship: string;
	provideInformation: string;
	shareInformation: string;
	contactedForAdditionalInformation: string;
	statisticalInformation: string;
	correctInformationProvided: string;
}

const preLoadedData = (userData: any): ReferralFormProps => ({
	firstName: userData?.personalInformation?.firstName ?? "",
	lastName: userData?.personalInformation?.lastName ?? "",
	title: userData?.personalInformation?.title ?? "",
	preferredName: userData?.personalInformation?.preferredName ?? "",
	dateOfBirth: userData?.personalInformation?.dateOfBirth
		? new Date(userData.personalInformation.dateOfBirth)
				.toISOString()
				.split("T")[0]
		: "",
	gender: userData?.personalInformation?.gender ?? "",
	email: userData?.contactInformation?.email ?? "",
	phone: userData?.contactInformation?.phone ?? "",
	address: userData?.addressInformation?.address ?? "",
	suburb: userData?.addressInformation?.suburb ?? "",
	city: userData?.addressInformation?.city ?? "",
	postCode: userData?.addressInformation?.postCode ?? "",
	country: userData?.addressInformation?.country ?? "",
	firstLanguage: "",
	interpreter: "",
	culturalSupport: "",
	communicationNeeds: "",
	doctorName: "",
	doctorPhone: "",
	doctorAddress: "",
	doctorSuburb: "",
	doctorCity: "",
	nationalHealthIndex: "",
	disabilityType: "",
	disabilityDetails: "",
	disabilitySupportDetails: "",
	disabilityReasonForReferral: "",
	disabilitySupportRequired: "",
	safety: "",
	otherImportantInformation: "",
	referrerFirstName: "",
	referrerLastName: "",
	referrerEmail: "",
	referrerPhone: "",
	referrerRelationship: "",
	emergencyContactFirstName: "",
	emergencyContactLastName: "",
	emergencyContactPhone: "",
	emergencyContactEmail: "",
	emergencyContactRelationship: "",
	provideInformation: "",
	shareInformation: "",
	contactedForAdditionalInformation: "",
	statisticalInformation: "",
	correctInformationProvided: "",
});

const stepReducer = (
	state: { current: number; previous: number },
	action: "next" | "prev",
) => {
	const newStep = action === "next" ? state.current + 1 : state.current - 1;
	return { current: newStep, previous: state.current };
};

const ReferralForm = () => {
	const { isLoaded, userId } = useAuth();
	const { isLoading, isError, error, userData } = useUserProfile(userId || "");
	// const { mutate } = useCreateUserProfile();
	const preLoadData = useMemo(() => preLoadedData(userData), [userData]);

	const form = useForm<Inputs>({
		resolver: zodResolver(referralFormSchema),
		values: preLoadData,
	});

	const communicationNeedsValue = form.watch("communicationNeeds");
	const { trigger } = form;

	const next = async () => {
		console.log(form.getValues());
		const fields = referralFormSteps[step.current]?.fields;
		const isValid = await trigger(fields as FieldName[], { shouldFocus: true });
		if (isValid && step.current < referralFormSteps.length - 1) {
			dispatch("next");
		}
	};

	const prev = () => {
		if (step.current > 0) {
			dispatch("prev");
		}
	};

	const [step, dispatch] = useReducer(stepReducer, { current: 0, previous: 0 });
	const delta = step.current - step.previous;

	const onSubmit = async (values: z.infer<typeof referralFormSchema>) => {
		const googleUserId = userId;
		if (!googleUserId) {
			return;
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

							<FormStepButtons
								currentStep={step.current}
								profileFormStepsLength={referralFormSteps.length}
								prevButtonType={"button"}
								nextButtonType={"button"}
								prevButtonText={"Previous"}
								nextButtonText={"Next"}
								onClickPrev={prev}
								onClickNext={next}
								submitButtonText={"Submit"}
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
