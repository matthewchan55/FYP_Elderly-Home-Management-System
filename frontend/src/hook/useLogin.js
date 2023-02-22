import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Signup inside here and get response back, which can update the auth context
// {user: null} (in AuthContext.js) => user: user
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (account, password) => {
    setIsLoading(true);
    setError(null);

    // /api/user/signup comes from 
    // (server.js => app.use('api/user') +  user.js => '/signup')
    const resp = await fetch("api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account, password }),
    });

    const respData = await resp.json();

    if (!resp.ok) {
      setError(respData.error);
    } else {
      // update the auth context
      dispatch({ type: "LOGIN", payload: respData });
    }
    setIsLoading(false)
  };

  //grab these things from this hook
  return { login, isLoading, error}
};
