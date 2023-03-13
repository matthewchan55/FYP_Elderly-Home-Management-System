import { Grid } from "@mui/material";
import { Controls } from "../../controls/Controls";

const ResidentRelatives = ({ relativesName, relativesPhone, relativesHKID, relativesAddress, relativesEmail, updateField}) => {
  return (
    <Grid container>
      <Grid item xs={12} md={12} sx={{ mb: 3 }}>
        <Controls.OutlinedInput
          name="relativesName"
          value={relativesName}
          label="Relatives Name"
          onChange={e=>updateField({relativesName: e.target.value})}
        />
        <Controls.OutlinedInput
          name="relativesPhone"
          value={relativesPhone}
          label="Relatives Phone"
          onChange={e=>updateField({relativesPhone: e.target.value})}
        />
        <Controls.OutlinedInput
          name="relativesHKID"
         value={relativesHKID}
          label="Relatives HKID"
          onChange={e=>updateField({relativesHKID: e.target.value})}
        />
        <Controls.OutlinedInput
          name="relativesAddress"
          value={relativesAddress}
          label="Relatives Address"
          onChange={e=>updateField({relativesAddress: e.target.value})}
        />
        <Controls.OutlinedInput
          name="relativesEmail"
          value={relativesEmail}
          label="Relatives Email"
          onChange={e=>updateField({relativesEmail: e.target.value})}
        />
      </Grid>
    </Grid>
  );
};

export default ResidentRelatives;
