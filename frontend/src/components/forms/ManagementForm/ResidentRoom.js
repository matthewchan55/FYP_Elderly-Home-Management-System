import { Grid } from "@mui/material";
import { Controls } from "../../controls/Controls";

const ResidentRoom = ({ floor, zone, room, bed, updateField }) => {
  return (
    <Grid container>
      <Grid item xs={12} md={12} sx={{ mb: 3 }}>
        <Controls.OutlinedInput name="floor" value={floor} label="Floor" onChange={e=>updateField({floor: e.target.value})} />
        <Controls.OutlinedInput name="zone" value={zone} label="Zone" onChange={e=>updateField({zone: e.target.value})}/>
        <Controls.OutlinedInput name="room" value={room} label="Room" onChange={e=>updateField({room: e.target.value})}/>
        <Controls.OutlinedInput name="bed" value={bed} label="Bed no." onChange={e=>updateField({bed: e.target.value})}/>
      </Grid>
    </Grid>
  );
};

export default ResidentRoom;
