import { useState } from "react";

export const useGetOrDelete = () => {
  const [error, setError] = useState(null);
 // const [isLoading, setIsLoading] = useState(null);

  // for get and delete
  const getOrDelete = async (path, method) => {
    setError(null);

    const resp = await fetch(path, {
      method: method,
    });

    const respData = await resp.json();

    if (!resp.ok) {
      setError(respData.error);
    } 
  };

  return { getOrDelete, error, setError};
};
