import { Grid } from "@mui/material";
import { Controls } from "./controls/Controls";
import { useForm, Form } from "../hook/useForm";

const EmptyForm = () => {
  const { handleEmptyInputChanges } = useForm();

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
    { name: "userType", value: "relatives", label: "Relatives" },
  ];

  const handleSubmit = async(e) => {
    e.preventDefault();
  }


  return (
    <Form>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ marginBottom: 3 }}>
          <Controls.OutlinedInput
            label="Account"
            name="account"
            defaultValue=""
            onChange={handleEmptyInputChanges}
          />
          <Controls.Selection
            label="Staff Type"
            name="userType"
            defaultValue=""
            onChange={handleEmptyInputChanges}
            inputLabelName="Staff Type"
            items={userTypeSelection}
          />

          <Controls.OutlinedInput
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
          <Controls.Buttons type="submit" text="Add new staff" />
        </Grid>
      </Grid>
    </Form>
  );
};

export default EmptyForm;
