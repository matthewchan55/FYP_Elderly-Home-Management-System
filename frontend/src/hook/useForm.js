import { useState } from "react"


// to avoid repeat typing these things when creating forms

// changes can simultaneously applied to all forms
export const useForm = (user) => {

  const [userData, setUserData] = useState(user)

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return {userData, setUserData, handleInputChanges}
}

export function Form(props){
    return (
        <form autoComplete="off">
            {props.children}
        </form>

    )
}
