import { ServiceCase, ServicePlanEntry, ReferralForm, Prisma } from "@prisma/client";

interface EligibilityCriteria {
  field: string
  checkValue: string | Array<string>
  serviceCategory: string
  hours: number
}

interface ServicePlanEntrySlim extends Omit<ServicePlanEntry, 'id'>{}

const serviceEligibility: Array<EligibilityCriteria> = [
  {
    field: 'referralForm.disability.disabilityType',
    checkValue: ['Locomotor Disability', 'Cerebral Palsy', 'Muscular Dystrophy'],
    serviceCategory: 'Physical/Mobility',
    hours: 10
  },
  {
    field: 'referralForm.disability.disabilityType',
    checkValue: 'Specific Learning Disabilities',
    serviceCategory: 'Absence from School',
    hours: 6.5
  }
]

// TODO: This can probably go in a util file if it's useful anywhere else
const objectStringPath = (obj: any, path: string): any => {
    const splitPath = path.split('.');
    for (let i = 0; i < splitPath.length; ++i) {
      const key = splitPath[i];
      // This isn't super type safe, might be worth checking isObject
      if (key in obj) {
        obj = obj[key];
      } else {
        return undefined;
      }
    }
    return obj;
}

export const GenerateEligibleServicePlanEntries = async (
  prisma: Prisma.TransactionClient,
  servicePlanId: string,
  caseDetails: ServiceCase
): Promise<Array<ServicePlanEntrySlim>> => {
  const returnValue = [];

  for (const criteria of serviceEligibility) {
    const caseValue = objectStringPath(caseDetails, criteria.field);

    if ((Array.isArray(criteria.checkValue) && criteria.checkValue.includes(caseValue))
      || criteria.checkValue === caseValue) {
        console.log("Found match");
      const serviceCategory = await prisma.serviceCategory.findUnique({
        where: {
          serviceName: criteria.serviceCategory,
        }
      })

      if (!serviceCategory) {
        console.error(`Failed to find service category ${criteria.serviceCategory}`)
        continue;
      }

      returnValue.push({
        servicePlanId,
        allocatedMinutes: criteria.hours * 60,
        serviceCategoryId: serviceCategory?.id,
      });
    }
  }

  return returnValue;
}