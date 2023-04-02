import { useState } from "react";
import { useAuthContext } from "../hook/useAuthContext";

export const useSubmit = () => {
  const [error, setError] = useState(null);
  const {user} = useAuthContext();
 // const [isLoading, setIsLoading] = useState(null);

  // for patch and post
  const submit = async (path, data, method) => {
    setError(null);
    
    const resp = await fetch(path, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...data, updatedBy: `${user.account} (${user.lastName}, ${user.firstName})`}),
    });

    const respData = await resp.json();

    if (!resp.ok) {
      setError(respData.error);
    } 
  };

  return { submit, error, setError};
};
