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
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from "@mui/material";
import { Box } from "@mui/system";
import { Controls } from "../components/controls/Controls";
import { useState, useEffect, useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShowerIcon from "@mui/icons-material/Shower";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";
import FemaleElderly from "../assets/female_elderly.png";
import MaleElderly from "../assets/male_elderly.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useAvatar from "../hook/useAvatar";

import { useAuthContext } from "../hook/useAuthContext";

const CaregiversHome = () => {
  const { user } = useAuthContext();
  const [screenSize, setScreenSize] = useState("lg");

  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState();

  const [eldRoutineItems, setEldRoutineItems] = useState();
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [eldMedicationItems, setEldMedicationItems] = useState();
  const [selectedMedicationlist, setSelectedMedicationList] = useState([]);

  const icons = [
    <ShowerIcon />,
    <HealthAndSafetyIcon />,
    <MedicalServicesIcon />,
  ];

  console.log(selectedItemList);
  // routine list on the right
  const [routineList, setRoutineList] = useState();
  const [medicationList, setMedicationList] = useState();
  const [onClickCategoryItems, setOnClickCategoryItems] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [openItemSpreadup, setOpenItemSpreadup] = useState(false);
  const [selectedError, setSelectedError] = useState();
  const [selectedMessage, setSelectedMessage] = useState();
  const [notes, setNotes] = useState();
  const [itemValue, setItemValue] = useState();

  const { stringAvatar } = useAvatar();

  const fetchResidentInfo = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      // get elderly in today working area
      const filteredResidents = respData.filter((resident) =>
        user.workingArea.includes(resident.room)
      );
      const sorted = filteredResidents.sort((a, b) => {
        if (a.room === b.room) {
          return a.bed > b.bed ? 1 : -1;
        } else {
          return a.room > b.room ? 1 : -1;
        }
      });

      // filtered resident list
      setResidents(sorted);
      // first resident
      setSelectedResident(sorted[0]);
      // default routine and med (according to shift)
      setEldRoutineItems(sorted[0].defaultRoutineItems);
      setEldMedicationItems(
        getCurrentMedication(sorted[0].defaultMedicationItems)
      );
    }
  };

  const findDefaultRoutineDetails = (routine) => {};

  console.log(eldRoutineItems);

  const fetchRoutine = async (eld) => {
    const resp = await fetch("/api/management/work/routine");
    const respData = await resp.json();

    if (resp.ok) {
      setRoutineList(respData);
    }
  };

  const fetchMedication = async () => {
    const resp = await fetch("/api/management/medication");
    const respData = await resp.json();

    if (resp.ok) {
      setMedicationList(respData);
    }
  };

  const getCurrentMedication = (items) => {
    const now = new Date();
    const hour = now.getHours();

    let currentMedication = [];
    items.forEach((item) => {
      if (item.A && hour >= 8 && hour < 14) {
        currentMedication = currentMedication.concat(item.A);
      }
      if (item.P && hour >= 14 && hour < 22) {
        currentMedication = currentMedication.concat(item.P);
      }
      if (
        (item.N && hour >= 22 && hour <= 23) ||
        (item.N && hour >= 0 && hour < 8)
      ) {
        currentMedication = currentMedication.concat(item.N);
      }
    });
    return currentMedication;
  };

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

  function getRoutienCategoryItems(category) {
    if (category === "medication") {
      setOnClickCategoryItems(medicationList);
    }
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

  const [checkedRoutine, setCheckedRoutine] = useState([]);
  const [checkedMedication, setCheckedMedication] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checkedRoutine.indexOf(value);
    const newChecked = [...checkedRoutine];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedRoutine(newChecked);
  };

  const handleToggleMedication = (value) => () => {
    const currentIndex = checkedMedication.indexOf(value);
    const newChecked = [...checkedMedication];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedMedication(newChecked);
  };

  const formatShift = (time) => {
    if (time.slice(10, 19) === "T08:00:00") {
      return "A";
    } else if (time.slice(10, 19) === "T14:00:00") {
      return "P";
    } else if (time.slice(10, 19) === "T22:00:00") {
      return "N";
    }
    return "Not assigned";
  };

  const CustomRoutineList = ({ header, items, title, type }) => {
    return (
      <>
        <ListSubheader component="div" id="nested-list-subheader">
          {header}
        </ListSubheader>
        {items &&
          items.map((r, idx) => (
            <ListItem key={idx}>
              <ListItemButton
                role={undefined}
                onClick={
                  type === "routine"
                    ? handleToggle(r)
                    : handleToggleMedication(r)
                }
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      type === "routine"
                        ? checkedRoutine.indexOf(r) !== -1
                        : checkedMedication.indexOf(r) !== -1
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <Stack key={idx} direction="row" alignItems={"center"}>
                  {title === "default" && (
                    <StarIcon sx={{ fontSize: 20, color: "#f57c00", mr: 1 }} />
                  )}
                  <Typography ml={1}>{r}</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
      </>
    );
  };

  useEffect(() => {
    fetchResidentInfo();
    fetchRoutine();
    fetchMedication();
    handleResize();
  }, []);

  useMemo(() => {
    setEldRoutineItems(
      selectedResident && selectedResident.defaultRoutineItems
    );
    setEldMedicationItems(
      selectedResident &&
        getCurrentMedication(selectedResident.defaultMedicationItems)
    );
    setCheckedRoutine([]);
    setCheckedMedication([]);
    setSelectedItemList([]);
    setSelectedMedicationList([]);
  }, [selectedResident]);

  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        <Grid container>
          <Grid item xs={6}>
            <Paper sx={{ mb: 3, p: 3, mr: 3, height: 250 }}>
              <Controls.Bold variant="h5" mb={2}>
                Today's Working Area
              </Controls.Bold>
              <Controls.Bold variant="h6" fontStyle={"italic"} color="#808191">
                {`Shift: ${formatShift(user.workingShift)}`}
              </Controls.Bold>

              <Controls.Bold variant="h6" fontStyle={"italic"} color="#808191">
                {`Room: ${user.workingArea || "Not assigned"}`}
              </Controls.Bold>
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
                      <Box direction="row" mt={1} key={idx}>
                        <Button
                          onClick={() => setSelectedResident(res)}
                          sx={{
                            justifyContent: "flex-start",
                            width: "100%",
                            "& .MuiTypography-root": {
                              textTransform: "none",
                              color: "black",
                              textAlign: "left",
                            },
                          }}
                        >
                          <Box
                            width="3px"
                            height="74px"
                            bgcolor={res.todayResidentRoutine ? "green" : "red"}
                            mr={2}
                          />
                          <Avatar
                            {...stringAvatar(
                              `${res.lastName} ${res.firstName}`
                            )}
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
                        </Button>
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
          <Grid container alignItems="center">
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
                  <Typography>{`Name: ${selectedResident.lastName}, ${selectedResident.firstName} (Resident ID: ${selectedResident.residentID})`}</Typography>
                  <Typography>{`Bed: ${selectedResident.room}-${selectedResident.bed}`}</Typography>
                  <Typography>{`Special Routine Items: ${
                    selectedResident.defaultRoutineItems
                      ? selectedResident.defaultRoutineItems.length
                      : 0
                  }`}</Typography>
                  <Typography>{`Default Medication Items: ${
                    selectedResident.defaultMedicationItems
                      ? getCurrentMedication(
                          selectedResident.defaultMedicationItems
                        ).length
                      : 0
                  }`}</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item md={4}>
              <Stack direction="row" gap={4}>
                <Box
                  sx={{
                    width: "200px",
                    border: "1px solid grey",
                    borderRadius: "10px",
                  }}
                >
                  <Stack alignItems={"center"} px={3} py={2} gap={1}>
                    <Controls.Bold>Completed Routine Items</Controls.Bold>
                    <Controls.Bold color="#009688" variant="h3">
                      0
                    </Controls.Bold>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: "200px",
                    border: "1px solid grey",
                    borderRadius: "10px",
                  }}
                >
                  <Stack alignItems={"center"} pl={4} py={2} gap={1}>
                    <Controls.Bold>Completed shift medication</Controls.Bold>
                    {/* <CheckCircleIcon
                      sx={{ fontSize: 50, color: "#26a69a", pr: 2 }}
                    /> */}
                    <CancelIcon sx={{ fontSize: 50, color: "#ef5350" }} />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item md>
              <Stack p={5}>
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
              <Controls.Bold>Default</Controls.Bold>
            </Stack>

            {/* routine list and medication list */}
            <Grid container>
              <Grid item xs={6} md={12}>
                <Paper sx={{ p: 3, mb: 5, mr: 3 }}>
                  <Controls.Bold variant="h6" mb={1}>
                    Routine List
                  </Controls.Bold>
                  {eldRoutineItems && selectedItemList && (
                    <>
                      <List
                        dense
                        component="div"
                        role="list"
                        subheader={<li />}
                        sx={{
                          width: "105%",
                          height: "300px",
                          overflow: "auto",
                        }}
                      >
                        <CustomRoutineList
                          header={"Default Routine Items"}
                          items={eldRoutineItems}
                          title="default"
                          type="routine"
                        />

                        <Divider />

                        <CustomRoutineList
                          header={"Additional Routine Items"}
                          items={selectedItemList}
                          type="routine"
                        />
                      </List>
                      <Button>Save changes</Button>
                    </>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={6} md={12}>
                <Paper sx={{ p: 3, mb: 5, mr: 3 }}>
                  <Controls.Bold variant="h6" mb={1}>
                    Medication List
                  </Controls.Bold>

                  {eldRoutineItems && selectedMedicationlist && (
                    <>
                      <List
                        dense
                        component="div"
                        role="list"
                        subheader={<li />}
                        sx={{
                          width: "105%",
                          height: "300px",
                          overflow: "auto",
                        }}
                      >
                        <CustomRoutineList
                          header={"Default Medication Items"}
                          items={eldMedicationItems}
                          title="default"
                          type="medication"
                        />
                        <Divider />
                        <CustomRoutineList
                          header={"Additional Medication Items"}
                          items={selectedMedicationlist}
                          type="medication"
                        />
                      </List>
                    </>
                  )}

                  <Button>Save changes</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md>
            {onClickCategoryItems === undefined ||
            onClickCategoryItems === "" ? (
              <Stack alignItems={"center"} mt={10}>
                {["cleaning (elderly)", "health care", "medication"].map(
                  (category, idx) => (
                    <Box
                      height="150px"
                      display="flex"
                      justifyContent={"center"}
                      width="50%"
                      border={"2px solid orange"}
                    >
                      <Button onClick={() => getRoutienCategoryItems(category)}>
                        {icons[idx]}
                        <Controls.Bold variant="h5" ml={1}>
                          {category}{" "}
                        </Controls.Bold>
                      </Button>
                    </Box>
                  )
                )}
              </Stack>
            ) : (
              <Stack>
                <Stack direction="row">
                  <Button
                    onClick={() => {
                      setOnClickCategoryItems("");
                      setOpenItemSpreadup(false);
                      setNotes("");
                      setSelectedItem("");
                    }}
                    sx={{ mb: 2 }}
                  >
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

                {selectedItem && openItemSpreadup ? (
                  <>
                    <Controls.Bold>{`Routine Item: ${selectedItem.routineName}`}</Controls.Bold>

                    <Typography>Value</Typography>
                    <Controls.OutlinedInput
                      value={itemValue || ""}
                      variant="standard"
                      onChange={(e) => setItemValue(e.target.value)}
                      sx={{ width: "10%", mb: 3 }}
                    />

                    <TextField
                      label="Special Notes"
                      multiline
                      rows={4}
                      defaultValue=""
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Stack direction="row">
                      <Button>Add to list</Button>
                    </Stack>
                  </>
                ) : (
                  <Grid container spacing={2} mb={3}>
                    {onClickCategoryItems.map((item, idx) => (
                      <Grid key={idx} item xs={4}>
                        <Box
                          height="80px"
                          display="flex"
                          justifyContent={"center"}
                          border={"1px solid black"}
                          borderRadius="20px"
                        >
                          <Button
                            onClick={() => {
                              setOpenItemSpreadup(true);
                              setSelectedItem(item);
                            }}
                          >
                            <Controls.Bold>{item.routineName}</Controls.Bold>
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CaregiversHome;
