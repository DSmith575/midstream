const apiKey = import.meta.env.VITE_API_BACKEND_URL

type UserRoles = 'CLIENT' | 'WORKER'

interface ChangeUserRoleProps {
  userId: string
  role: UserRoles
}

export const postChangeUserRole = async ({ userId, role }: ChangeUserRoleProps) => {
  try {
    const response = await fetch(`${apiKey}devTools/updateUserRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newRole: role }),
    });

    if (!response.ok) {
      throw new Error('Failed to change user role');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};