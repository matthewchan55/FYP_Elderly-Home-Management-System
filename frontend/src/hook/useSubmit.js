import { useState } from "react";

export const useSubmit = () => {
  const [error, setError] = useState(null);
 // const [isLoading, setIsLoading] = useState(null);

  // for patch and post
  const submit = async (path, data, method) => {
    setError(null);

    const resp = await fetch(path, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...data}),
    });

    const respData = await resp.json();

    if (!resp.ok) {
      setError(respData.error);
    } 
  };

  return { submit, error};
};
