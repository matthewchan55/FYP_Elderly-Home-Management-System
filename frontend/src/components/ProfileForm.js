// MUI import
import { Grid, Typography } from "@mui/material";

// React import
import { useAuthContext } from "../hook/useAuthContext";
import { useForm, Form } from "../hook/useForm";
import { Controls } from "../components/controls/Controls";
import { useSubmit } from "../hook/useSubmit";
import useAlert from "../hook/useAlert";
import SmallAlert from "./SmallAlert";

const ProfileForm = ({selectedUser}) => {
  const { user, dispatch } = useAuthContext();
  const { userData, handleInputChanges } = useForm(selectedUser ? selectedUser : user);
  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const genderSelection = [
    { name: "sex", value: "M", label: "M" },
    { name: "sex", value: "F", label: "F" },
    { name: "sex", value: "Not available", label: "Not available" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit("/api/user/profile/" + (selectedUser? selectedUser._id: user._id), userData, "PATCH");
    setOpen(true);

    if(!selectedUser || selectedUser._id===user._id){
      dispatch({ type: "UPDATE", payload: userData });
    }

  };

  return (
    // **improvement/suggestion: all disabled -> toggle to allow changes?
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title="Update successfully!"
      />
      <Form>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Personal information
        </Typography>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ marginBottom: 3 }}>
            <Controls.DisabledInput
              label="Account"
              name="account"
              value={userData.account}
              onChange={handleInputChanges}
            />
            <Controls.DisabledInput
              label="Staff Type"
              name="userType"
              value={userData.userType}
              onChange={handleInputChanges}
            />
            <Controls.DisabledInput
              label="Staff ID"
              name="staffID"
              value={userData.staffID}
              onChange={handleInputChanges}
            />
            <Controls.OutlinedInput
              name="lastName"
              label="Last Name"
              value={userData.lastName}
              onChange={handleInputChanges}
            />
            <Controls.OutlinedInput
              name="firstName"
              value={userData.firstName}
              label="First Name"
              onChange={handleInputChanges}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ marginBottom: 3 }}>
            <Controls.Selection
              name="sex"
              label="Gender"
              value={userData.sex}
              onChange={handleInputChanges}
              inputLabelName="Gender"
              items={genderSelection}
            />

            <Controls.OutlinedInput
              name="address"
              value={userData.address}
              label="Address"
              onChange={handleInputChanges}
            />
            <Controls.OutlinedInput
              name="phoneNum"
              value={userData.phoneNum}
              label="Phone Number"
              onChange={handleInputChanges}
            />
            <Controls.OutlinedInput
              name="HKID"
              value={userData.HKID}
              label="HKID"
              onChange={handleInputChanges}
            />
          </Grid>

          <Controls.Buttons
            type="submit"
            text="Save changes"
            onClick={handleSubmit}
          />
          <Controls.Buttons text="Reset" color="neutral" />
        </Grid>
      </Form>
    </>
  );
};

export default ProfileForm;
