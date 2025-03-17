import { useState, useEffect } from "react";
import { SelectItem } from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { referralFormSchema } from "@/lib/schemas/referralFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	referralFormInterpreterOptions,
	referralFormFirstLanguageOptions,
	referralFormSteps,
} from "@/lib/formOptions/referralFormOptions";
import MotionContainer from "../profileForm/profileFormComponents/MotionContainer";
import FormInput from "../profileForm/profileFormComponents/FormInput";
import FormSelect from "../profileForm/profileFormComponents/FormSelect";
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
import { Textarea } from "@/components/ui/textarea";
import FormTextArea from "../profileForm/profileFormComponents/FormTextArea";

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
}

const ReferralForm = () => {
	const { isLoaded, userId } = useAuth();
	const { isLoading, isError, error, userData } = useUserProfile(userId || "");
	// const { mutate } = useCreateUserProfile();

	const preLoadedData: ReferralFormProps = {
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
		postCode: userData?.addressInformation?.postCode ?? 0,
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
	};

	const form = useForm<Inputs>({
		resolver: zodResolver(referralFormSchema),
		values: preLoadedData,
	});

	const communicationNeedsValue = form.watch("communicationNeeds");
	const { trigger } = form;
	const [previousStep, setPreviousStep] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const delta = currentStep - previousStep;

	const onSubmit = async (values: z.infer<typeof referralFormSchema>) => {
		const googleUserId = userId;
		if (!googleUserId) {
			return;
		}
	};

	const next = async () => {
		const fields = referralFormSteps[currentStep]?.fields;
		// console.log(watch());
		console.log(form.getValues());

		const output = await trigger(fields as FieldName[], { shouldFocus: true });
		// console.log(output);
		if (!output) return;

		if (currentStep < referralFormSteps.length - 1) {
			setPreviousStep(currentStep);
			setCurrentStep((step) => step + 1);
		}
	};

	const prev = () => {
		if (currentStep > 0) {
			setPreviousStep(currentStep);
			setCurrentStep((step) => step - 1);
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

			{!isLoading && !isError && userData ? (
				<>
					<StepNavigation steps={referralFormSteps} currentStep={currentStep} />
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="mt-4 space-y-8 py-4">
							{currentStep === 0 && (
								<MotionContainer
									delta={delta}
									header={referralFormSteps[currentStep].name}
									subtitle={referralFormSteps[currentStep].subtitle}>
									<FormInput
										control={form.control}
										fieldName="firstName"
										formLabel="First Name"
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"lastName"}
										formLabel={"Last Name"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"title"}
										formLabel={"Title"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"preferredName"}
										formLabel={"Preferred Name"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"dateOfBirth"}
										formLabel={"Date of Birth"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"gender"}
										formLabel={"Gender"}
										disabled={true}
									/>
									<FormInput
										control={form.control}
										fieldName={"email"}
										formLabel={"Email"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"phone"}
										formLabel={"Phone"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"address"}
										formLabel={"Address"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"suburb"}
										formLabel={"Suburb"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"city"}
										formLabel={"City"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"postCode"}
										formLabel={"Post Code"}
										disabled={true}
									/>

									<FormInput
										control={form.control}
										fieldName={"country"}
										formLabel={"Country"}
										disabled={true}
									/>
								</MotionContainer>
							)}

							{currentStep === 1 && (
								<MotionContainer
									delta={delta}
									header={referralFormSteps[currentStep].name}
									subtitle={referralFormSteps[currentStep].subtitle}>
									<FormSelect
										control={form.control}
										fieldName={"firstLanguage"}
										formLabel={"First Language"}
										selectPlaceholder="Select Language"
										children={referralFormFirstLanguageOptions.map(
											(option, index) => (
												<SelectItem key={index} value={option}>
													{option}
												</SelectItem>
											),
										)}
									/>

									<FormSelect
										control={form.control}
										fieldName={"interpreter"}
										formLabel={"Interpreter"}
										selectPlaceholder={"Select Option"}
										children={referralFormInterpreterOptions.map(
											(option, index) => (
												<SelectItem key={index} value={option}>
													{option}
												</SelectItem>
											),
										)}
									/>

									<FormSelect
										control={form.control}
										fieldName={"culturalSupport"}
										formLabel={"Cultural Support"}
										selectPlaceholder={"Select Option"}
										children={referralFormInterpreterOptions.map(
											(option, index) => (
												<SelectItem key={index} value={option}>
													{option}
												</SelectItem>
											),
										)}
									/>

									<FormSelect
										control={form.control}
										fieldName={"communicationNeeds"}
										formLabel={"Communication Needs"}
										selectPlaceholder={"Select Option"}
										children={referralFormInterpreterOptions.map(
											(option, index) => (
												<SelectItem key={index} value={option}>
													{option}
												</SelectItem>
											),
										)}
									/>

									{communicationNeedsValue === "Yes" && (
										<FormTextArea
											control={form.control}
											fieldName={"communicationNeedsDetails"}
											formLabel={"Communication Needs Details"}
											placeholder={
												"Non-verbal communication (e.g., requires anticipation and support)"
											}
										/>
									)}
								</MotionContainer>
							)}

							{currentStep === 2 && (
								<MotionContainer
									delta={delta}
									header={referralFormSteps[currentStep].name}
									subtitle={referralFormSteps[currentStep].subtitle}>
									<FormInput
										control={form.control}
										fieldName={"doctorName"}
										formLabel={"Doctor/GP Name"}
										placeholder={"Dr. Jane Doe"}
									/>

									<FormInput
										control={form.control}
										fieldName={"doctorPhone"}
										formLabel={"Medical Centre Contact Number"}
										placeholder={"021 123 4567"}
									/>

									<FormInput
										control={form.control}
										fieldName={"doctorAddress"}
										formLabel={"Medical Centre Address"}
										placeholder={"123 Medical Centre Street"}
									/>

									<FormInput
										control={form.control}
										fieldName={"doctorSuburb"}
										formLabel={"Medical Centre Suburb"}
										placeholder={"Medical Centre Suburb"}
									/>

									<FormInput
										control={form.control}
										fieldName={"doctorCity"}
										formLabel={"Medical Centre City"}
										placeholder={"Medical Centre City"}
									/>

									<FormInput
										control={form.control}
										fieldName={"nationalHealthIndex"}
										formLabel={"National Health Index (NHI) Number"}
										placeholder={"XYZ1234"}
									/>
								</MotionContainer>
							)}

							<FormStepButtons
								currentStep={currentStep}
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
			) : (
				<div className="mt-12 flex items-center justify-center">
					<p className="text-red-500">Sign in to get started!</p>
				</div>
			)}
		</section>
	);
};

export default ReferralForm;
