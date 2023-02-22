// MUI import
import { Grid, Typography} from "@mui/material";

// React import
import { useAuthContext } from "../hook/useAuthContext";
import { useForm, Form } from "../hook/useForm";
import { Controls } from "../components/controls/Controls";

const ProfileForm = () => {
  const { user, dispatch } = useAuthContext();
  const { userData, handleInputChanges } = useForm(user);

  const genderSelection = [
    { name: "sex", value: "M", label: "M" },
    { name: "sex", value: "F", label: "F" },
    { name: "sex", value: "Not available", label: "Not available" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch("/api/user/profile/" + user._id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const respData = await resp.json();

    if (resp.ok) {
      dispatch({ type: "UPDATE", payload: respData });
    }
  };

  return (
    // **improvement/suggestion: all disabled -> toggle to allow changes?
    // ** outlinedInput now define css here (because size vary between different input) -> need check check think think
    <Form>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
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
            label="Type"
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
            sx={{ width: "80%", margin: 1 }}
          />
          <Controls.OutlinedInput
            name="firstName"
            value={userData.firstName}
            label="First Name"
            onChange={handleInputChanges}
            sx={{ width: "80%", margin: 1 }}
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
            sx={{ width: "80%", margin: 1 }}
          />

          <Controls.OutlinedInput
            name="address"
            value={userData.address}
            label="Address"
            onChange={handleInputChanges}
            sx={{ width: "80%", margin: 1 }}
          />
          <Controls.OutlinedInput
            name="phoneNum"
            value={userData.phoneNum}
            lab4el="Phone Number"
            onChange={handleInputChanges}
            sx={{ width: "80%", margin: 1 }}
          />
          <Controls.OutlinedInput
            name="HKID"
            value={userData.HKID}
            label="HKID"
            onChange={handleInputChanges}
            sx={{ width: "80%", margin: 1 }}
          />
        </Grid>

        <Controls.Buttons type="submit" text="Save changes" onClick={handleSubmit}/>
        <Controls.Buttons text="Reset" color="neutral"/>
      </Grid>
    </Form>
  );
};

export default ProfileForm;
