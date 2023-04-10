import { useState } from "react";
import { useLogin } from "../hook/useLogin";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  InputAdornment,
  Grid,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { Controls } from "../components/controls/Controls";
import Office from "../assets/office.png";
import LoginIcon from "../assets/loginicon.png";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    console.log(account, password);
    e.preventDefault();
    await login(account, password);
  };


  return (
    <>
      <Grid container>
        <Grid item md bgcolor={"#009688"} height="60px"  display="flex" alignItems={"center"}>
          <Stack direction="row" width="100%">
            <Controls.Bold variant="h5" ml={3} flexGrow={1} color="#e0f2f1">
              Elderly Home Management System
            </Controls.Bold>
            <Stack direction="row" gap={5} mr={5} >
              <Controls.Bold color="#e0f2f1">Sign Up</Controls.Bold>
              <Controls.Bold color="#e0f2f1">Contact Us</Controls.Bold>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Grid container alignItems={"center"} mt={10}>
        <Grid item md ml={8}>
          <img src={Office} alt="login" width="800" />
        </Grid>
        <Divider width="1px" height="60%" color="grey" flexItem />
        <Grid item md mx={10}>
          <form className="login" onSubmit={handleSubmit}>
            <Stack alignItems={"center"} p={5}>
              <img src={LoginIcon} alt="loginicon" />
              <Controls.Bold variant="h3">Welcome</Controls.Bold>
              <Typography variant="h6" color="#808191">
                (Staff interface)
              </Typography>

              <Stack width="80%" my={3}>
                {error && (
                  <Alert severity="warning">
                    <AlertTitle>
                      <strong>{error}</strong>
                    </AlertTitle>
                    Please confirm your information
                  </Alert>
                )}
              </Stack>
              <Controls.OutlinedInput
                label="Account"
                name="account"
                value={account || ""}
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setAccount(e.target.value)}
              />
              <Controls.OutlinedInput
                label="Password"
                name="password"
                type="password"
                variant="standard"
                value={password || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Stack width="80%" mt={2}>
                <Controls.Buttons
                  text="Log in"
                  size="large"
                  type="submit"
                  disabled={isLoading}
                />
              </Stack>

              <Typography mt={5} variant="h6" color="#808191">
                Don't have an account? Go <Link to="/signup">Signup</Link>
              </Typography>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
