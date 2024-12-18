import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { profileFormSchema } from "@/lib/schemas/profileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MotionContainer from "./profileFormComponents/MotionContainer";
import StepNavigation from "./profileFormComponents/StepNavigation";
import FormInput from "./profileFormComponents/FormInput";
import FormSelect from "./profileFormComponents/FormSelect";
import {
	titleSelectOptions,
	genderSelectOptions,
	profileFormSteps,
} from "@/lib/formOptions/profileFormOptions";
import FormStepButtons from "./profileFormComponents/FormStepButtons";

type Inputs = z.infer<typeof profileFormSchema>;
type FieldName = keyof Inputs;

const ReferralForm = () => {
	const form = useForm<Inputs>({
		resolver: zodResolver(profileFormSchema),
	});

	const { trigger, watch } = form;
	const [previousStep, setPreviousStep] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const delta = currentStep - previousStep;

	const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
		console.log("here", values);
		// Submit to backend api
	};

	const next = async () => {
		const fields = profileFormSteps[currentStep]?.fields;
		// console.log(watch());

		const output = await trigger(fields as FieldName[], { shouldFocus: true });
		// console.log(output);
		if (!output) return;

		if (currentStep < profileFormSteps.length - 1) {
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
		<section className="flex flex-col justify-between px-10 py-10">
			<StepNavigation steps={profileFormSteps} currentStep={currentStep} />

			{/* Form */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 space-y-8 py-4">
					{currentStep === 0 && (
						<MotionContainer
							delta={delta}
							header={profileFormSteps[currentStep].name}
							subtitle={profileFormSteps[currentStep].subtitle}>
							<FormInput
								control={form.control}
								fieldName="firstName"
								formLabel="First Name"
								placeholder="John"
							/>

							<FormInput
								control={form.control}
								fieldName={"lastName"}
								formLabel={"Last Name"}
								placeholder={"Doe"}
							/>

							<FormSelect
								control={form.control}
								fieldName={"title"}
								formLabel={"Title"}
								selectPlaceholder={"Title"}
								children={titleSelectOptions.map((title, index) => (
									<SelectItem key={index} value={title}>
										{title}
									</SelectItem>
								))}
							/>

							<FormInput
								control={form.control}
								fieldName={"preferredName"}
								formLabel={"Preferred Name"}
								placeholder={"Optional"}
							/>

							<FormInput
								control={form.control}
								fieldName={"dateOfBirth"}
								formLabel={"Date of Birth"}
								placeholder={"DD/MM/YYYY"}
								type={"date"}
							/>

							<FormSelect
								control={form.control}
								fieldName={"gender"}
								formLabel={"Gender"}
								selectPlaceholder={"Gender"}
								children={genderSelectOptions.map((gender, index) => (
									<SelectItem key={index} value={gender}>
										{gender}
									</SelectItem>
								))}
							/>
						</MotionContainer>
					)}

					{currentStep === 1 && (
						<MotionContainer
							delta={delta}
							header={profileFormSteps[currentStep].name}
							subtitle={profileFormSteps[currentStep].subtitle}>
							<FormInput
								control={form.control}
								fieldName={"email"}
								formLabel={"Email"}
								type={"email"}
								placeholder={"JohnDoe@email.com"}
							/>

							<FormInput
								control={form.control}
								fieldName={"phone"}
								formLabel={"Phone Number"}
								placeholder={"Home or Mobile"}
							/>
						</MotionContainer>
					)}

					{currentStep === 2 && (
						<MotionContainer
							delta={delta}
							header={profileFormSteps[currentStep].name}
							subtitle={profileFormSteps[currentStep].subtitle}>
							<FormInput
								control={form.control}
								fieldName={"address"}
								formLabel={"Address"}
								placeholder={"123 Example Street"}
							/>

							<FormInput
								control={form.control}
								fieldName={"suburb"}
								formLabel={"Suburb"}
								placeholder={"Richmond"}
							/>

							<FormInput
								control={form.control}
								fieldName={"city"}
								formLabel={"City"}
								placeholder={"Christchurch"}
							/>

							<FormInput
								control={form.control}
								fieldName={"postCode"}
								formLabel={"Post Code"}
								placeholder={"1234"}
								type={"number"}
							/>

							<FormInput
								control={form.control}
								fieldName={"country"}
								formLabel={"Country"}
								placeholder={"New Zealand"}
							/>
						</MotionContainer>
					)}

					{currentStep === 3 && (
						<MotionContainer
							delta={delta}
							header={profileFormSteps[currentStep].name}
							subtitle={profileFormSteps[currentStep].subtitle}>
							{Object.entries(form.getValues()).map(([key, value]) => (
								<div key={key} className="sm:col-span-3">
									<FormItem>
										<FormLabel>
											{key
												// Adds space between camelCase words
												.replace(/([a-z])([A-Z])/g, "$1 $2")
												// Capitalize first letter
												.replace(/^./, (str) => str.toUpperCase())}
										</FormLabel>
										<FormControl>
											<Input
												value={value as string}
												readOnly
												className="block w-full cursor-not-allowed rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
											/>
										</FormControl>
									</FormItem>
								</div>
							))}
						</MotionContainer>
					)}

					{/* This could be handled better, refactor when time allows */}
					<FormStepButtons
						currentStep={currentStep}
						profileFormStepsLength={profileFormSteps.length}
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
		</section>
	);
};

export default ReferralForm;
