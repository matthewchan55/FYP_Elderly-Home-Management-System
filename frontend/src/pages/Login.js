import { useState } from "react";
import { useLogin } from "../hook/useLogin";
import { Link } from "react-router-dom";


const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const {login, error, isLoading} = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(account, password)
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
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
      <p>Don't have an account. Go <Link to="/signup">Signup</Link></p>

      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
