import { splitAndCapitalize } from "@/lib/functions/functions";

interface FormSection {
  title: string;
  field: Record<string, any>;
};

export const generateFormSections = (
  referralForm: Record<string, any>,
  options?: {
    includeKeys?: string[];
    excludeKeys?: string[];
  }
): FormSection[] => {
  const { includeKeys, excludeKeys } = options || {};

  return Object.entries(referralForm)
    .flatMap(([topKey, topValue]) => {
      if (excludeKeys?.includes(topKey)) return [];

      // Filter by includeKeys if provided
      if (includeKeys && !includeKeys.includes(topKey)) return [];

      if (typeof topValue !== "object" || topValue === null) return [];

      // If it's the "user" object, dive deeper
      if (topKey === "user") {
        return Object.entries(topValue)
          .filter(
            ([_, subValue]) =>
              typeof subValue === "object" && subValue !== null
          )
          .map(([subKey, subValue]) => ({
            title: splitAndCapitalize(subKey),
            field: subValue,
          }));
      }

      return [
        {
          title: splitAndCapitalize(topKey),
          field: topValue,
        },
      ];
    });
};