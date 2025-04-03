import { CreateUserProps } from "@/interfaces/profileInterfaces";

const apiKey = import.meta.env.VITE_API_BACKEND_URL;

const postUserProfile = async (userData: CreateUserProps) => {
  try {
    // Step 1: Send the request to create the user profile
    const response = await fetch(`${apiKey}userProfiles/createUserProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Check if the first request failed
    if (!response.ok) {
      throw new Error("Failed to create user profile");
    }

    // Step 2: If user profile creation succeeded, add the user to the membership
    const addUserToMembership = await fetch(`${apiKey}clerk/createMembershipInvite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userData.googleId }), // assuming googleId is the unique user ID
    });

    // Check if adding to membership failed
    if (!addUserToMembership.ok) {
      throw new Error("Failed to add user to membership");
    }

    // Step 3: If both operations are successful, parse the response
    const data = await response.json(); // Assuming response contains the data you need

    return data; // Return the response data from the user profile creation

  } catch (error) {
    console.error("Error in postUserProfile:", error);
    // Optionally, return an error message if needed
    return { error: error || "An unexpected error occurred" };
  }
};

export default postUserProfile;
