import { useState } from "react"

const useProfileStart = () => {
  const [profileStart, setProfileStart] = useState<boolean>(false);

  const handleProfileStart = (profileStatus: boolean) => {
    setProfileStart(profileStatus);
    console.log(profileStatus)
  };

  return { profileStart, handleProfileStart };

}

export default useProfileStart;