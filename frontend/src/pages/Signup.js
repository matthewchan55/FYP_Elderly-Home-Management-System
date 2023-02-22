import { useState } from "react";
import { useSignup } from "../hook/useSignup";
import { Link } from "react-router-dom";
import Select from "react-select";

const Signup = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [staffID, setStaffID] = useState("");
  const { signup, error, isLoading } = useSignup();

  const options = [
    { value: "admin", label: "Administrator" },
    { value: "caregivers", label: "Caregivers" },
    { value: "relatives", label: "Relatives" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(account, password, userType, staffID);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label htmlFor="account">Account:</label>
      <input
        type="text"
        onChange={(e) => setAccount(e.target.value)}
        value={account}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Select
        options={options}
        onChange={(e) => setUserType(e.value)}
        placeholder="Please select your identity..."
      />

      {(userType === "admin" || userType === "caregivers") && (
        <input
          type="text"
          onChange={(e) => setStaffID(e.target.value)}
          value={staffID}
          placeholder="Staff ID"
        />
      )}
      <p>
        <Link to="/login">Log in</Link> if you have an account!
      </p>
      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
