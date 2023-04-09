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
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Fullcalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

import StaffList from "./StaffList";
import { Controls } from "../controls/Controls";
import { useSubmit } from "../../hook/useSubmit";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";

const WorkScheduleCaregiver = () => {
  const [caregiversList, setCaregiversList] = useState();
  const [selected, setSelected] = useState();
  const [roomData, setRoomData] = useState();

  const [event, setEvent] = useState([]);
  const [floor, setFloor] = useState(1);
  const [room, setRoom] = useState([]);
  const [shift, setShift] = useState("");

  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const handleSave = async () => {
    await submit(
      "/api/user/profile/" + selected._id,
      { workingArea: room, workingShift: shift },
      "PATCH"
    );
    setOpen(true);
    setRoom(room);
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
      gatherEvents(respData);
    }
  };

  const gatherEvents = (data) => {
    const workingData = data.filter(
      (item) => item.workingArea && item.workingShift
    );
    const result = workingData.map((d) => {
      const stringRoom = d.workingArea.join(", ");
      const staff = `${d.lastName}, ${d.firstName}`;
      const event = {
        title: `${staff} - ${stringRoom}`,
        start: d.workingShift,
        backgroundColor: getColor(d.workingShift),
        borderColor: getColor(d.workingShift),
      };
      return event;
    });
    setEvent(result);
  };

  function getColor(time) {
    if (time === "2023-04-09T08:00:00") {
      return "green";
    } else if (time === "2023-04-09T14:00:00") {
      return "";
    } else {
      return "brown";
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  // room grouping
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

  const handleFloor = (e) => {
    setFloor(e.target.value);
  };

  const handleShift = (e) => {
    setShift(e.target.value);
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoom(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useMemo(() => {
    fetchFacility();
    setRoom([]);
  }, [floor]);

  useMemo(() => {
    setRoom(selected && selected.workingArea);
    setShift(selected && selected.workingShift);
  }, [selected]);

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={`Update Working Area for - ${selected && selected.lastName}, ${
          selected && selected.firstName
        } - successfully!`}
      />

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

            <Grid item md xs={12} my={2}>
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
                  <Grid container>
                    {selected && selected.workingArea.length > 0 ? (
                      selected.workingArea.map((item, idx) => (
                        <Grid item md={4} key={idx}>
                          <Typography variant="h6">{`${item},`}</Typography>
                        </Grid>
                      ))
                    ) : (
                      <Typography mt={1} variant="h6">
                        Not assigned
                      </Typography>
                    )}
                  </Grid>
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
                  <Controls.Bold mb={2}>Present</Controls.Bold>
                  {selected && selected.present ? (
                    <CheckCircleIcon sx={{ color: "#26a69a", fontSize: 50 }} />
                  ) : (
                    <CancelIcon sx={{ color: "#ef5350", fontSize: 50 }} />
                  )}
                </Box>
              </Stack>
            </Grid>

            <Divider style={{ width: "100%" }} flexItem />
          </Grid>

          <Grid container direction="row">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" mb={3}>Work schedule</Typography>

              <Fullcalendar
                plugins={[listPlugin]}
                initialView="listWeek"
                events={event}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "listDay,listWeek,listMonth",
                }}
                views={{
                  listDay: {
                    buttonText: "List Day",
                    titleFormat: {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  },
                  listWeek: {
                    buttonText: "List Week",
                    titleFormat: {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  },
                  listMonth: {
                    buttonText: "List Month",
                    titleFormat: { year: "numeric", month: "long" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={4} md={4} p={3}>
              <Paper sx={{ p: 3 }}>
                <Stack display="flex" alignItems="flex-start">
                  <Controls.Bold variant="h6" mb={2}>
                    Set Today's Working Area:
                  </Controls.Bold>
                  <Typography color="#808191" mb={1}>
                    Shift
                  </Typography>
                  <Controls.Selection
                    name="todayShift"
                    variant="standard"
                    value={shift || ""}
                    inputLabelName=""
                    items={[
                      {
                        name: "todayShift",
                        value: "2023-04-09T08:00:00",
                        label: "A",
                      },
                      {
                        name: "todayShift",
                        value: "2023-04-09T14:00:00",
                        label: "P",
                      },
                      {
                        name: "todayShift",
                        value: "2023-04-09T22:00:00",
                        label: "N",
                      },
                    ]}
                    onChange={handleShift}
                  />

                  <Divider sx={{ my: 2 }} width="100%" />

                  <Typography color="#808191" mb={3}>
                    Venue
                  </Typography>
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
                          renderValue={(room) => room.join(", ")}
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 250 } },
                          }}
                        >
                          {roomData.map((item) => (
                            <MenuItem key={item.name} value={item.value}>
                              <Checkbox
                                checked={room && room.indexOf(item.name) > -1}
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
    </>
  );
};

export default WorkScheduleCaregiver;
