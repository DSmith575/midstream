import { useState } from "react";

interface StepProps {
    id: string;
    name: string;
    fields: string[];
}

const steps: StepProps[] = [
    {id: "Step 1", name: "Personal Information", fields: ["First Name", "Last Name", "Email", "Phone Number"]},
    {id: "Step 2", name: "Address Information", fields: ["Street Address", "City", "State", "Zip Code"]},
    {id: "Step 3", name: "Complete", fields: ["Submit"]},
];

const ReferralForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        };
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(step => step - 1);
        };
    };
    
    return (
        <section className={'inset-0 flex flex-col justify-between p-24'}>
            <nav aria-label="Progress">
            <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
            {steps.map((step, index) => (
                    <li key={step.name} className={'md:flex-1'}>
 {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-sky-600 transition-colors '>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              )}
            </li>
          ))}
                </ol>
            </nav>

    <form className='py-12 mt-12'>
{currentStep === 0 && (
  <>
    <h2 className='text-base font-semibold leading-7 text-gray-900'>
      Personal Information
    </h2>
    <p className='mt-1 text-sm leading-6 text-gray-600'>
      Provide your personal details.
    </p>
    <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
      <div className='sm:col-span-3'>
        <label
          htmlFor='firstName'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          First name
        </label>
        <div className='mt-2'>
          <input
            type='text'
            id='firstName'
            autoComplete='given-name'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>
    </div>
  </>
)}
    </form>

        </section>
    );
}

export default ReferralForm;