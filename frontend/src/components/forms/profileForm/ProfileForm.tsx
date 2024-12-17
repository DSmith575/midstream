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
import { Button } from "../../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { profileFormSchema } from "@/lib/schemas/profileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof profileFormSchema>;
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
			"dateOfBirth",
			"gender",
		],
	},
	{
		id: "Step 2",
		name: "Contact Information",
		fields: ["email", "phone"],
	},
	{
		id: "Step 3",
		name: "Address",
		fields: ["address", "suburb", "city", "postCode", "country"],
	},
	{ id: "Step 4", name: "Complete", fields: ["complete"] },
];

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
		const fields = steps[currentStep]?.fields;
		console.log(watch());

		const output = await trigger(fields as FieldName[], { shouldFocus: true });
		console.log(output);
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
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className={"sm:col-span-3"}>
									<FormField
										control={form.control}
										name={"title"}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder={"Title"} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															<SelectItem value={"Mr"}>Mr</SelectItem>
															<SelectItem value={"Mrs"}>Mrs</SelectItem>
															<SelectItem value={"Miss"}>Miss</SelectItem>
															<SelectItem value={"Dr"}>Dr</SelectItem>
															<SelectItem value={"Other"}>Other</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className={"sm:col-span-3"}>
									<FormField
										control={form.control}
										name={"preferredName"}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Preferred Name</FormLabel>
												<FormControl>
													<Input placeholder="Optional" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className={"sm:col-span-3"}>
									<FormField
										control={form.control}
										name={"dateOfBirth"}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date of birth</FormLabel>
												<FormControl>
													<Input
														type={"date"}
														{...field}
														placeholder="DD/MM/YYYY"
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className={"sm:col-span-3"}>
									{/* Gender */}
									<FormField
										control={form.control}
										name={"gender"}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder={"Gender"} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															<SelectItem value={"Male"}>Male</SelectItem>
															<SelectItem value={"Female"}>Female</SelectItem>
															<SelectItem value={"Other"}>Other</SelectItem>
															<SelectItem value={"Prefer not to say"}>
																Prefer not to say
															</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
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
								Contact Information
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-600">
								Provide your contact information.
							</p>

							<section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type={"email"}
														placeholder="JohnDoe@email.com"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input
														placeholder="Home or Mobile"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</section>
						</motion.div>
					)}

					{currentStep === 2 && (
						<motion.div
							initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Address Information
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-600">
								Provide your address details.
							</p>

							<section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Address</FormLabel>
												<FormControl>
													<Input
														placeholder="123 Example Street"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="suburb"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Suburb</FormLabel>
												<FormControl>
													<Input
														placeholder="Richmond"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>City</FormLabel>
												<FormControl>
													<Input
														placeholder="Christchurch"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="postCode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Post Code</FormLabel>
												<FormControl>
													<Input
														type={"number"}
														placeholder={"1234"}
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="sm:col-span-3">
									<FormField
										control={form.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input
														placeholder="New Zealand"
														{...field}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</section>
						</motion.div>
					)}

					{currentStep === 3 && (
						<motion.div
							initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Form Complete
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-600">
								Please check that all information is correct.
							</p>

							<section className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
													className="block cursor-not-allowed w-full rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
												/>
											</FormControl>
										</FormItem>
									</div>
								))}
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
