import { Grid } from "@mui/material";
import { Controls } from "../../controls/Controls";

const ResidentElderly = ({
  residentID,
  lastName,
  firstName,
  sex,
  HKID,
  active,
  age,
  height,
  weight,
  address,
  updateField,
  method,
}) => {
  const genderSelection = [
    { name: "sex", value: "M", label: "M" },
    { name: "sex", value: "F", label: "F" },
    { name: "sex", value: "Not available", label: "Not available" },
  ];

  return (
    <Grid container>
      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
        <Controls.OutlinedInput
          required
          label="Resident ID"
          name="residentID"
          value={residentID}
          onChange={(e) => updateField({ residentID: e.target.value })}
        />

        <Controls.OutlinedInput
          name="lastName"
          label="Last Name"
          value={lastName}
          onChange={(e) => updateField({ lastName: e.target.value })}
        />
        <Controls.OutlinedInput
          name="firstName"
          value={firstName}
          label="First Name"
          onChange={(e) => updateField({ firstName: e.target.value })}
        />
        <Controls.Selection
          name="sex"
          label="Gender"
          value={sex}
          inputLabelName="Gender"
          items={genderSelection}
          onChange={(e) => updateField({ sex: e.target.value })}
        />
        <Controls.OutlinedInput
          name="HKID"
          value={HKID}
          label="HKID"
          onChange={(e) => updateField({ HKID: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
        {method === "PATCH" && (
          <Controls.Selection
            name="active"
            label="Active"
            value={active}
            inputLabelName="Active"
            items={[
              { name: "active", value: true, label: "Yes" },
              { name: "active", value: false, label: "No" },
            ]}
            onChange={(e) => updateField({ active: e.target.value })}
          />
        )}
        <Controls.OutlinedInput
          name="age"
          value={age}
          label="Age"
          onChange={(e) => updateField({ age: e.target.value })}
        />
        <Controls.OutlinedInput
          name="height"
          value={height}
          label="Height (cm)"
          onChange={(e) => updateField({ height: e.target.value })}
        />
        <Controls.OutlinedInput
          name="weight"
          value={weight}
          label="Weight (kg)"
          onChange={(e) => updateField({ weight: e.target.value })}
        />
        <Controls.OutlinedInput
          name="address"
          value={address}
          label="Address"
          onChange={(e) => updateField({ address: e.target.value })}
        />
      </Grid>
    </Grid>
  );
};

export default ResidentElderly;
