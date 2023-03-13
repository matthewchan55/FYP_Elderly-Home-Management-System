import { Button, Avatar, Grid } from "@mui/material";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";

import { useState} from "react";
import PageHeader from "../../components/PageHeader";
import Floorplan from "../../assets/floorplan.png";

const ManagementFacility = () => {
  const [editRoom, setEditRoom] = useState(false);
  const [plotCoordinates, setPlotCoordinates] = useState([]);

  const handleStartClick = () => {
    setEditRoom(true);
  };

  const handleFinishClick = () => {
    setEditRoom(false);
    setPlotCoordinates([])
  };

  const handleClickOnImage = (e) => {
    if (editRoom) {
      const coor = [...plotCoordinates];
      coor.push({ x: e.clientX, y: e.clientY });
      setPlotCoordinates(coor);
    }
  };





  return (
    <>
      <PageHeader
        title="Facility Management"
        subtitle="View facility vacancy or manage rooms status"
        icon={
          <RoomPreferencesIcon
            sx={{ fontSize: 60, justifyContent: "center" }}
          />
        }
      />

      <Grid container spacing={2}>
        <Grid item>
          {!editRoom && <Button onClick={handleStartClick}>Start</Button> }
          {editRoom && <Button onClick={handleFinishClick}>Finish</Button> }
        </Grid>
        <Grid item>
          <div onClick={handleClickOnImage}>
            <img
              style={{ width: 1000, height: 600 }}
              src={Floorplan}
              alt="Floorplan"
              size="100"
            />
            {editRoom && plotCoordinates.map((plot, index) => (
              <Avatar key={index} sx={{position: 'absolute', width: 30, height: 30, top: plot.y -14, left: plot.x-15}}>
                A
              </Avatar>
            ))}

          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default ManagementFacility;
