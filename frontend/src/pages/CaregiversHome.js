import {
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  TextField,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import { Controls } from "../components/controls/Controls";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import FemaleElderly from "../assets/female_elderly.png";
import MaleElderly from "../assets/male_elderly.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useAvatar from "../hook/useAvatar";

const CaregiversHome = () => {
  const todayArea = ["101", "102", "104", "105", "106"];
  const [residents, setResidents] = useState([]);
  const [screenSize, setScreenSize] = useState("lg");
  const [selectedResident, setSelectedResident] = useState();
  const [eldRoutineItems, setEldRoutineItems] = useState();
  const [eldMedicationItems, setEldMedicationItems] = useState();
  const [routineList, setRoutineList] = useState();

  const [onClickCategoryItems, setOnClickCategoryItems] = useState();
  const [selectedError, setSelectedError] = useState();
  const [selectedMessage, setSelectedMessage] = useState();
  const [selectedItemList, setSelectedItemList] = useState([]);

  const {stringAvatar} = useAvatar();

  
  const fetchResidentInfo = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      const filteredResidents = respData.filter((resident) =>
        todayArea.includes(resident.room)
      );
      const sorted = filteredResidents.sort((a, b) => {
        if (a.room === b.room) {
          return a.bed > b.bed ? 1 : -1;
        } else {
          return a.room > b.room ? 1 : -1;
        }
      });
      setResidents(sorted);
      setSelectedResident(sorted[0]);

      fetchRoutine(sorted[0]);
      fetchMedInfo(sorted[0].residentID);
    }
  };

  const fetchRoutine = async (eld) => {
    const resp = await fetch("/api/management/work/routine");
    const respData = await resp.json();

    if (resp.ok) {
      setRoutineList(respData);
      const rightData = getRightItems(respData, "routineName");

      const routine =
        eld &&
        rightData &&
        rightData.filter((d) => d.resident === eld.residentID);

      setEldRoutineItems(routine[0].routine);
    }
  };

  const fetchMedInfo = async (id) => {
    const resp = await fetch("/api/management/medication");
    const respData = await resp.json();

    if (resp.ok) {
      const rightData = getRightItems(respData, "genericName");

      const routine =
        id && rightData && rightData.filter((d) => d.resident === id);

      setEldMedicationItems(routine[0].routine);
    }
  };

  function getRightItems(data, field) {
    const residentRoutines = data.reduce((acc, routine) => {
      routine.setDefaultTo.forEach((resident) => {
        const residentIndex = acc.findIndex(
          (item) => item.resident === resident
        );
        if (residentIndex === -1) {
          acc.push({
            resident: resident,
            routine: [routine[field]],
          });
        } else {
          acc[residentIndex].routine.push(routine[field]);
        }
      });
      return acc;
    }, []);
    return residentRoutines;
  }

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 960) {
      setScreenSize("md");
    } else {
      setScreenSize("lg");
    }
  };

  function percentage(complete, total) {
    return Math.round((complete / total) * 100);
  }

  function findCompleteTotal(data) {
    const result = data.reduce((count, item) => {
      if (item.todayResidentRoutine === true) {
        return count + 1;
      }
      return count;
    }, 0);
    return result;
  }

  function formatString(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  function getRoutienCategoryItems(category) {
    const result = routineList.filter((r) => r.routineCategory === category);
    setOnClickCategoryItems(result);
  }

  const handleSelectItems = (item) => {
    const check = eldRoutineItems.includes(item);

    if (check) {
      setSelectedError(item);
      setSelectedMessage("");
    } else {
      setSelectedItemList([...selectedItemList, item]);
      setSelectedError("");
      setSelectedMessage(item);
    }
  };

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    fetchResidentInfo();
    handleResize();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        <Grid container>
          <Grid item xs={6}>
            <Paper sx={{ mb: 3, p: 3, mr: 3, height: 250 }}>
              <Controls.Bold variant="h5" mb={2}>
                Today's Working Area
              </Controls.Bold>
              <Typography variant="h6" fontStyle={"italic"} color="#808191">
                Floor: 1
              </Typography>
              <Typography variant="h6" fontStyle={"italic"} color="#808191">
                Zone: A
              </Typography>
              <Typography variant="h6" fontStyle={"italic"} color="#808191">
                Room: 101, 102, 104, 105, 106
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ mb: 3, p: 3, mr: 3, height: 250 }}>
              <Controls.Bold variant="h5" mb={2}>
                Routine Progress
              </Controls.Bold>
              <Controls.Bold
                color="#009688"
                variant="h2"
                display={"flex"}
                justifyContent="center"
                p={2}
              >{`${
                residents &&
                percentage(findCompleteTotal(residents), residents.length)
              }%`}</Controls.Bold>
              <Typography color="#808191">
                {residents && `Completed: ${findCompleteTotal(residents)}`}
              </Typography>
              <Typography color="#808191">
                {residents &&
                  `Not complete: ${
                    residents.length - findCompleteTotal(residents)
                  }`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ mb: 3, p: 3, mr: 3 }}>
              <Controls.Bold variant="h5" mb={2}>
                Duty Today
              </Controls.Bold>
              <Grid container>
                {residents &&
                  residents.map((res, idx) => (
                    <Grid
                      key={idx}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={screenSize === "lg" ? 12 : 6}
                    >
                      <Box
                        direction="row"
                        display={"flex"}
                        alignItems="center"
                        mt={1}
                        key={idx}
                      >
                        <Box
                          width="3px"
                          height="74px"
                          bgcolor={res.todayResidentRoutine ? "green" : "red"}
                          mr={2}
                        />
                        <Avatar
                          {...stringAvatar(`${res.lastName} ${res.firstName}`)}
                        />
                        <Stack ml={2}>
                          <Typography
                            variant="subtitle2"
                            color="#808191"
                          >{`Resident ID: ${res.residentID}`}</Typography>
                          <Typography
                            variant="subtitle2"
                            color="#808191"
                          >{`Name: ${res.lastName}, ${res.firstName}`}</Typography>
                          <Typography
                            variant="subtitle2"
                            color="#808191"
                          >{`Bed: ${res.room}-${res.bed}`}</Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs md>
        {selectedResident && (
          <Grid container>
            <Grid item md={5}>
              <Stack direction="row">
                {selectedResident.sex === "F" ? (
                  <img
                    src={FemaleElderly}
                    alt="Female"
                    width="120"
                    height="190"
                  />
                ) : (
                  <img src={MaleElderly} alt="Male" width="140" height="190" />
                )}

                <Stack gap={2} p={3}>
                  <Typography>Name: Chan, Tsz (ResidentID: 12)</Typography>
                  <Typography>Room: 101, Bed: A</Typography>
                  <Typography>Today routine items: 6</Typography>
                  <Stack direction="row">
                    <Typography>Today routine status:</Typography>

                    {selectedResident.todayResidentRoutine ? (
                      <CheckCircleIcon sx={{ color: "#26a69a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#26a69a" }} />
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid item md>
              <Stack direction="row" p={5}>
                <Controls.Buttons
                  variant="outlined"
                  text={`View routine records for elderly ${selectedResident.lastName}, ${selectedResident.firstName}`}
                ></Controls.Buttons>
                <Controls.Buttons
                  variant="outlined"
                  text={`View medication records for elderly ${selectedResident.lastName}, ${selectedResident.firstName}`}
                ></Controls.Buttons>
              </Stack>
            </Grid>
          </Grid>
        )}

        <Divider />

        <Grid container direction="row">
          <Grid item xs={12} md={4} p={2}>
            <Stack
              direction="row"
              gap={0.5}
              display={"flex"}
              alignItems="center"
              my={1}
            >
              <StarIcon sx={{ fontSize: 40, color: "#f57c00" }} />
              <Typography>Default</Typography>
            </Stack>
            <Grid container>
              <Grid item xs={6} md={12}>
                <Paper sx={{ p: 3, mb: 5, mr: 3 }}>
                  <Controls.Bold variant="h6" mb={1}>
                    Routine List
                  </Controls.Bold>

                  <List
                    dense
                    component="div"
                    role="list"
                    subheader={<li />}
                    sx={{ height: "300px", overflow: "auto" }}
                  >
                    <ListSubheader component="div" id="nested-list-subheader">
                      Newly added routines
                    </ListSubheader>
                    {selectedItemList &&
                      selectedItemList.map((r, idx) => (
                        <ListItem key={idx}>
                          <ListItemButton
                            role={undefined}
                            onClick={handleToggle(r)}
                            dense
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(r) !== -1}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <Stack
                              key={idx}
                              direction="row"
                              alignItems={"center"}
                            >
                              <Typography ml={1}>{r}</Typography>
                            </Stack>
                          </ListItemButton>
                        </ListItem>
                      ))}

                    <Divider />

                    <ListSubheader component="div" id="nested-list-subheader">
                      Default routines
                    </ListSubheader>
                    {eldRoutineItems &&
                      eldRoutineItems.map((r, idx) => (
                        <ListItem key={idx}>
                          <ListItemButton
                            role={undefined}
                            onClick={handleToggle(r)}
                            dense
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(r) !== -1}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <Stack
                              key={idx}
                              direction="row"
                              alignItems={"center"}
                            >
                              <StarIcon
                                sx={{ fontSize: 20, color: "#f57c00" }}
                              />
                              <Typography ml={1}>{r}</Typography>
                            </Stack>
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </List>
                  <Button>Save changes</Button>
                </Paper>
              </Grid>

              <Grid item xs={6} md={12}>
                <Paper sx={{ p: 3, mb: 5, mr: 3 }}>
                  <Controls.Bold variant="h6" mb={1}>
                    Medication List
                  </Controls.Bold>
                  <List
                    dense
                    component="div"
                    role="list"
                    subheader={<li />}
                    sx={{ height: "300px", overflow: "auto" }}
                  >
                    <ListSubheader component="div" id="nested-list-subheader">
                      Newly added medication
                    </ListSubheader>
                    <Divider />
                    <ListSubheader component="div" id="nested-list-subheader">
                      Default medication
                    </ListSubheader>
                    {eldMedicationItems &&
                      eldMedicationItems.map((r, idx) => (
                        <ListItem key={idx}>
                          <ListItemButton
                            role={undefined}
                            onClick={handleToggle(r)}
                            dense
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(r) !== -1}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <Stack
                              key={idx}
                              direction="row"
                              alignItems={"center"}
                            >
                              <StarIcon
                                sx={{ fontSize: 20, color: "#f57c00" }}
                              />
                              <Typography ml={1}>{formatString(r)}</Typography>
                            </Stack>
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </List>
                  <Button>Save changes</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md
            display="flex"
            alignItems={"center"}
            justifyContent="center"
            maxWidth={"400px"}
          >
            {onClickCategoryItems === undefined ||
            onClickCategoryItems === "" ? (
              <>
                <Stack>
                  <Box p={15} border={"3px solid orange"}>
                    <Button
                      onClick={() =>
                        getRoutienCategoryItems("cleaning (elderly)")
                      }
                    >
                      <Controls.Bold variant="h5">Cleaning </Controls.Bold>
                    </Button>
                  </Box>
                  <Box p={15} border={"3px solid orange"}>
                    <Button
                      onClick={() => getRoutienCategoryItems("health care")}
                    >
                      <Controls.Bold variant="h5">Health care</Controls.Bold>
                    </Button>
                  </Box>
                </Stack>
                <Stack>
                  <Box p={15} border={"3px solid orange"}>
                    <Button onClick={() => getRoutienCategoryItems()}>
                      <Controls.Bold variant="h5">Medication</Controls.Bold>
                    </Button>
                  </Box>
                  <Box p={15} border={"3px solid orange"}>
                    <Button onClick={() => getRoutienCategoryItems()}>
                      <Controls.Bold variant="h5"> Others</Controls.Bold>
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : (
              <Stack>
                <Stack direction="row">
                  <Button onClick={() => setOnClickCategoryItems("")}>
                    <ArrowBackIosIcon />
                    Back to category
                  </Button>
                </Stack>
                {selectedError && (
                  <Typography
                    variant="h6"
                    color="#f44336"
                  >{`Item "${selectedError}" has already been selected as default`}</Typography>
                )}
                {selectedMessage && (
                  <Typography
                    variant="h6"
                    color="#009688"
                  >{`Item "${selectedMessage}" has already been added to routine list`}</Typography>
                )}
                <Grid container spacing={2} mb={3}>
                  {onClickCategoryItems.map((item, idx) => (
                    <Grid key={idx} item xs={4}>
                      <Box p={7} border={"1px solid black"}>
                        <Button
                          onClick={() => handleSelectItems(item.routineName)}
                        >
                          <Controls.Bold>{item.routineName}</Controls.Bold>
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <TextField
                  label="Special Notes"
                  multiline
                  rows={4}
                  defaultValue=""
                />
                <Stack direction="row">
                  <Button onClick={() => setOnClickCategoryItems("")}>
                    Save changes
                  </Button>
                </Stack>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CaregiversHome;
