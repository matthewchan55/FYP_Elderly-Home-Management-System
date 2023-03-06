import { Grid, Box } from "@mui/material";
import { Controls } from "../controls/Controls";
import { useForm, Form } from "../../hook/useForm";
import { useSubmit } from "../../hook/useSubmit";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";

const EmptyForm = ({ path }) => {
  const { newData, handleEmptyInputChanges } = useForm();
  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  //duplicate with profile form, consider change to component (Constant.js)
  const genderSelection = [
    { name: "sex", value: "M", label: "M" },
    { name: "sex", value: "F", label: "F" },
    { name: "sex", value: "Not available", label: "Not available" },
  ];

  // duplicate with signup, consider change to component (Constant.js)
  const userTypeSelection = [
    { name: "userType", value: "admin", label: "Administrator" },
    { name: "userType", value: "caregivers", label: "Caregivers" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(path, newData, "POST");
    setOpen(true);
  };

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={
          error
            ? "Failed - Please check your information again"
            : "Success - Added successfully!"
        }
      />
      <Form>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ marginBottom: 3 }}>
            <Controls.OutlinedInput
              required
              label="Account"
              name="account"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              required
              label="Password"
              name="password"
              type="password"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.Selection
              required
              label="Staff Type"
              name="userType"
              defaultValue=""
              onChange={handleEmptyInputChanges}
              inputLabelName="Staff Type"
              items={userTypeSelection}
            />

            <Controls.OutlinedInput
              required
              label="Staff ID"
              name="staffID"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="lastName"
              label="Last Name"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="firstName"
              defaultValue=""
              label="First Name"
              onChange={handleEmptyInputChanges}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ marginBottom: 3 }}>
            <Controls.Selection
              name="sex"
              label="Gender"
              defaultValue=""
              onChange={handleEmptyInputChanges}
              inputLabelName="Gender"
              items={genderSelection}
            />
            <Controls.OutlinedInput
              name="address"
              defaultValue=""
              label="Address"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="email"
              defaultValue=""
              label="Email Address"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="phoneNum"
              defaultValue=""
              label="Phone Number"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="HKID"
              defaultValue=""
              label="HKID"
              onChange={handleEmptyInputChanges}
            />
            <Controls.Buttons
              type="submit"
              text="Add new staff"
              onClick={handleSubmit}
            />
            {error && <Box>{error}</Box>}
          </Grid>
        </Grid>
      </Form>
    </>
  );
};

export default EmptyForm;
