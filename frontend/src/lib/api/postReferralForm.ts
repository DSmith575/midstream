import type { CreateReferralProps } from "@/lib/interfaces";

const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const postReferralForm = async (referralData: CreateReferralProps) => {
  try {
    const response = await fetch(`${apiKey}referralForms/createReferralForm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(referralData),
    });

    if (!response.ok) {
      throw new Error("Failed to create referral form");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default postReferralForm;