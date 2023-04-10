import { useState } from "react";
import { useSignup } from "../hook/useSignup";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  InputAdornment,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MultiTask from "../assets/signup.png";
import { Controls } from "../components/controls/Controls";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const Signup = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [staffID, setStaffID] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(account, password, userType, staffID);
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          md
          bgcolor={"#009688"}
          height="60px"
          display="flex"
          alignItems={"center"}
        >
          <Stack direction="row" width="100%">
            <Controls.Bold variant="h5" ml={3} flexGrow={1} color="#e0f2f1">
              Elderly Home Management System
            </Controls.Bold>
            <Stack direction="row" gap={5} mr={5}>
              <Controls.Bold color="#e0f2f1">Log In</Controls.Bold>
              <Controls.Bold color="#e0f2f1">Contact Us</Controls.Bold>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Grid container alignItems={"center"} mt={10}>
        <Grid item md ml={8}>
          <img src={MultiTask} alt="login" width="800" />
        </Grid>
        <Grid item md mr={8}>
          <form className="signup" onSubmit={handleSubmit}>
            <Paper sx={{ p: 3 }}>
              <Stack alignItems={"center"}>
                <Typography variant="h4">Account registration</Typography>
                <Typography variant="h6" color="#808191">
                  (Admin staff interface)
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
                <Controls.Selection
                  name="userType"
                  label="User Type"
                  value={userType}
                  inputLabelName="User Type"
                  onChange={(e) => setUserType(e.target.value)}
                  items={[
                    { value: "admin", label: "Administrator" },
                    { value: "caregivers", label: "Caregivers" },
                    { value: "relatives", label: "Relatives" },
                  ]}
                />

                {(userType === "admin" || userType === "caregivers") && (
                  <Controls.OutlinedInput
                    label="Staff ID"
                    name="staffID"
                    value={staffID || ""}
                    onChange={(e) => setStaffID(e.target.value)}
                  />
                )}

                <Stack width="80%" mt={2}>
                  <Controls.Buttons
                    text="Sign up"
                    size="large"
                    type="submit"
                    disabled={isLoading}
                  />
                </Stack>

                <Typography mt={5} variant="h6" color="#808191">
                  <Link to="/login">Log in</Link> if you have an account!
                </Typography>
              </Stack>
            </Paper>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Signup;
