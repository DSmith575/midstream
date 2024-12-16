import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { referralFormSchema } from "@/lib/referralForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof referralFormSchema>;
type FieldName = keyof Inputs;

const steps = [
	{
		id: "Step 1",
		name: "Personal Information",
		fields: [
			"firstName",
			"lastName",
			"title",
			"preferredName",
		],
	},
	{
		id: "Step 2",
		name: "Contact Information",
		fields: ["email", "mobilePhone", "homePhone"],
	},
	{
		id: "Step 3",
		name: "Address",
		fields: ["country", "city", "street", "zip"],
	},
	{ id: "Step 4", name: "Complete" },
];

const ReferralForm = () => {
	const form = useForm<Inputs>({
		resolver: zodResolver(referralFormSchema),
		// defaultValues: {
		// 	firstName: "",
		// 	lastName: "",
		// 	title: "",
		// 	preferredName: "",
		// 	email: "",
		// 	phone: "",
		// 	referral: "",
		// 	street: "",
		// 	city: "",
		// 	country: "",
		// 	zip: "",
		// },
	});

	const {
		control,
		handleSubmit,
		trigger,
		watch,
		formState: { errors },
	} = form;
	const [previousStep, setPreviousStep] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const delta = currentStep - previousStep;

	const onSubmit = (values: z.infer<typeof referralFormSchema>) => {
		console.log(values);
	};

	const next = async () => {
		const fields = steps[currentStep]?.fields;
		console.log(watch());
		if (!fields) return;
		const output = await trigger(fields as FieldName[], { shouldFocus: true });
		if (!output) return;

		if (currentStep < steps.length - 1) {
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
			{/* steps */}
			<nav aria-label="Progress">
				<ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
					{steps.map((step, index) => (
						<li key={step.name} className="md:flex-1">
							{currentStep > index ? (
								<div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
									<span className="text-sm font-medium text-sky-600 transition-colors">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							) : currentStep === index ? (
								<div
									className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
									aria-current="step">
									<span className="text-sm font-medium text-sky-600">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							) : (
								<div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
									<span className="text-sm font-medium text-gray-500 transition-colors">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							)}
						</li>
					))}
				</ol>
			</nav>

			{/* Form */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 space-y-8 py-4">
					{currentStep === 0 && (
						<motion.div
							initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Personal Information
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-600">
								Provide your personal details.
							</p>
							<section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input
														placeholder="John"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormDescription>
													This is your first name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Doe"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormDescription>
													This is your last name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className={'sm:col-span-3'}>
									<FormField
										control={form.control}
										name={'title'}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={'Title'}/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectGroup>
														<SelectItem value={'Mr'}>Mr</SelectItem>
														<SelectItem value={'Mrs'}>Mrs</SelectItem>
														<SelectItem value={'Miss'}>Miss</SelectItem>
														<SelectItem value={'Dr'}>Dr</SelectItem>
														<SelectItem value={'Other'}>Other</SelectItem>
													</SelectGroup>
												</SelectContent>
												</Select>
												<FormDescription>
													This is your title.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className={'sm:col-span-3'}>
									<FormField
										control={form.control}
										name={'preferredName'}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Preferred Name</FormLabel>
												<FormControl>
													<Input
													placeholder="Optional"
													{...field}
													/>
												</FormControl>
												<FormDescription>
													This is your preferred name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
										/>
								</div>
							</section>
						</motion.div>
					)}

					{currentStep === 1 && (
						<motion.div
							initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Address
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-600">
								Address where you can receive mail.
							</p>

							<section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input
														placeholder="John"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormDescription>
													This is your first name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Doe"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormDescription>
													This is your last name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</section>
						</motion.div>
					)}

					<div className="mt-8 pt-5">
						<div className="flex justify-between">
							{currentStep > 0 && (
								<Button type="button" onClick={prev} variant="outline">
									Previous
								</Button>
							)}
							{currentStep < steps.length - 1 && (
								<Button type="button" onClick={next} variant={"outline"}>
									Next
								</Button>
							)}
							{currentStep === steps.length - 1 && (
								<Button type="submit" variant={"outline"}>
									Submit
								</Button>
							)}
						</div>
					</div>
				</form>
			</Form>
		</section>
	);
};

export default ReferralForm;
