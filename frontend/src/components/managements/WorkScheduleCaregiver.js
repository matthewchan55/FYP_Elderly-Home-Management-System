import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Divider,
  Stack,
  Typography,
  Box,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  Checkbox,
  InputLabel,
  OutlinedInput,
  Button,
  Paper,
} from "@mui/material";
import StaffList from "./StaffList";
import { Controls } from "../controls/Controls";
import Floorplan from "../../assets/floorplan.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const WorkScheduleCaregiver = () => {
  const [caregiversList, setCaregiversList] = useState();
  const [selected, setSelected] = useState();
  const [roomData, setRoomData] = useState();
  const [floor, setFloor] = useState(1);
  const [room, setRoom] = useState([]);

  const handleFloor = (e) => {
    setFloor(e.target.value);
  };

  const handleSave = () => {
    
  }

  const menuprops = {
    PaperProps: { style: { maxHeight: 250 } },
  };

  const fetchStaff = async () => {
    const resp = await fetch("/api/management/staff");
    const respData = await resp.json();

    if (resp.ok) {
      const filtered = respData.filter(
        (staff) => staff.userType === "caregivers"
      );
      setCaregiversList(filtered);
      setSelected(filtered[0]);
    }
  };



  const groupRoom = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const room = item.roomName;
      if (!acc[room]) {
        acc[room] = { name: room, value: room, count: 0 };
      }
      acc[room].count++;
      return acc;
    }, {});

    const labeled = Object.values(groupedData).map((room) => ({
      name: room.name,
      value: room.value,
      label: `${room.name} (${room.count} people room)`,
    }));

    setRoomData(labeled);
  };

  useEffect(() => {
    fetchStaff();
  }, []);


  const fetchFacility = async () => {
    const resp = await fetch(`/api/management/facility?roomFloor=${floor}`);
    const respData = await resp.json();

    if (resp.ok) {
      const bedData = respData.filter(
        (item) => typeof item.roomNumber === "string" && isNaN(item.roomNumber)
      );
      groupRoom(bedData);
    }
  };

  
  useMemo(() => {
    fetchFacility();
    setRoom([]);
  }, [floor]);

  console.log(room);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoom(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <Grid container direction="row">
      {/* Left: elderly list */}
      <Grid item xs={12} md={2} minWidth="220px">
        <StaffList
          data={caregiversList}
          selected={selected}
          setSelected={setSelected}
        />
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs md p={2}>
        <Grid container>
          <Grid item xs={12} alignItems="center">
            <Grid container mb={2}>
              <Grid item md={7} xs={12}>
                {selected && (
                  <Stack gap={1}>
                    <Typography>{`Name: ${selected.lastName}, ${selected.firstName} (Staff ID: ${selected.staffID})`}</Typography>
                    <Typography>Contact Method:</Typography>
                    <Typography
                      variant="subtitle2"
                      fontStyle={"italic"}
                      color="#808191"
                    >{`Phone: ${selected.phoneNum}`}</Typography>
                    <Typography
                      variant="subtitle2"
                      fontStyle={"italic"}
                      color="#808191"
                    >{`Email: ${selected.email}`}</Typography>
                  </Stack>
                )}
              </Grid>

              <Grid item md xs={12} mb={2}>
                <Stack direction="row" gap={4}>
                  <Box
                    sx={{
                      width: "200px",
                      border: "1px solid grey",
                      borderRadius: "10px",
                      py: 3,
                      pl: 5,
                    }}
                  >
                    <Controls.Bold>Today's Working Area</Controls.Bold>
                    <Typography>Not assigned</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "200px",
                      border: "1px solid grey",
                      borderRadius: "10px",
                      py: 3,
                      pl: 9,
                    }}
                  >
                    <Controls.Bold>Present</Controls.Bold>
                    {/* {selectedElderlyFinance && selectedElderlyFinance.paid ? (
                      <CheckCircleIcon sx={{ color: "#26a69a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef5350" }} />
                    )} */}
                    <CheckCircleIcon sx={{ color: "#26a69a" }} />
                  </Box>
                </Stack>
              </Grid>

              <Divider style={{ width: "100%" }} flexItem />
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Grid item xs={12} md={8}>
              <img
                style={{ width: 850, height: 500, position: "relative" }}
                src={Floorplan}
                alt="Floorplan"
              />
            </Grid>

            <Grid item xs={12} md={4} p={3}>
              <Paper sx={{p: 3, mb:5}}>
                <Controls.Bold variant="h6">Previous working area</Controls.Bold>
                <Controls.OutlinedInput
                  variant="standard"
                  name="prevRecords"
                  value={"Room 103, Room 104, Room 105" || ""}
                  sx={{margin: 0, width: "100%"}}
                />
              </Paper>

              <Paper sx={{p: 3}}>
                <Stack display="flex" alignItems="flex-start">
                  <Controls.Bold variant="h6" mb={2}>Today's working area:</Controls.Bold>
                  {roomData && (
                    <>
                      <Controls.Selection
                        name="floor"
                        label="Floor"
                        defaultValue={1}
                        inputLabelName="Floor"
                        items={[
                          { name: "floor", value: 1, label: "1/F" },
                          { name: "floor", value: 2, label: "2/F" },
                          { name: "floor", value: 3, label: "3/F" },
                        ]}
                        onChange={handleFloor}
                      />

                      <FormControl sx={{ m: 1, width: "80%" }}>
                        <InputLabel id="room-select">Select room(s)</InputLabel>
                        <Select
                          labelId="room-select"
                          multiple
                          value={room}
                          input={<OutlinedInput label="Select room(s)" />}
                          onChange={handleChange}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={menuprops}
                        >
                          {roomData.map((item) => (
                            <MenuItem key={item.name} value={item.value}>
                              <Checkbox
                                checked={room.indexOf(item.name) > -1}
                              />
                              <ListItemText primary={item.label} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}
                  <Button onClick={handleSave}>Save changes</Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WorkScheduleCaregiver;
