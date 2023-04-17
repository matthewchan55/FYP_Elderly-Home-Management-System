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
  IconButton,
  Box,
} from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Controls } from "../components/controls/Controls";
import { useState, useEffect, useMemo } from "react";
import SmallAlert from "../components/SmallAlert";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShowerIcon from "@mui/icons-material/Shower";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";
import FemaleElderly from "../assets/female_elderly.png";
import MaleElderly from "../assets/male_elderly.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useAvatar from "../hook/useAvatar";
import { useAuthContext } from "../hook/useAuthContext";
import { BloodPressure } from "../components/forms/CaregiverForm/BloodPressure";
import { UrinaryCatheter } from "../components/forms/CaregiverForm/UrinaryCatheter";
import { Default } from "../components/forms/CaregiverForm/Default";
import { BloodGlucose } from "../components/forms/CaregiverForm/BloodGlucose";
import { useSubmit } from "../hook/useSubmit";
import useAlert from "../hook/useAlert";
import { HeightWeight } from "../components/forms/CaregiverForm/HeightWeight";

const CaregiversHome = () => {
  const { user } = useAuthContext();
  const today = new Date();

  const [userShift, setUserShift] = useState();
  const [currentShift, setCurrentShift] = useState();

  const [screenSize, setScreenSize] = useState("lg");

  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState();

  const [eldRoutineItems, setEldRoutineItems] = useState();
  const [selectedItemList, setSelectedItemList] = useState();
  const [eldMedicationItems, setEldMedicationItems] = useState();
  const [selectedMedicationlist, setSelectedMedicationList] = useState();

  const icons = [
    <ShowerIcon />,
    <HealthAndSafetyIcon />,
    <MedicalServicesIcon />,
  ];

  function getSelectedItemsForm(item) {
    const props = {
      routine: item.routineName || item,
      eld: selectedResident,
      date: getToday(),
      shift: getCurrentShift(),
      addRoutineList: handleAddItem,
      deselect: setSelectedItem,
      note: item.notes || "",
      value: item.value || {},
    };

    switch (item.routineName || item) {
      case "Blood pressure measurement":
        return <BloodPressure {...props} />;
      case "Blood glucose measurement":
        return <BloodGlucose {...props} />;
      case "Urinary catheter care":
        return <UrinaryCatheter {...props} />;
      case "Height & Weight":
        return <HeightWeight {...props} />;
      default:
        return <Default {...props} />;
    }
  }

  // routine list on the right
  const [routineList, setRoutineList] = useState();
  const [medicationList, setMedicationList] = useState();
  const [category, setCategory] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedError, setSelectedError] = useState();
  const { submit, error } = useSubmit();
  const { open, setOpen, handleClose } = useAlert();

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
      // check the default routine has been completed
      checkRoutineNamesMatch(sorted[0]);

      // default routine and med (according to shift)
      setEldRoutineItems(sorted[0].defaultRoutineItems);
      setEldMedicationItems(
        getCurrentMedication(sorted[0].defaultMedicationItems)
      );
    }
  };

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

  // const fetchWorkRecords = async () => {
  //   const resp = await fetch("/api/management/work/todayworkrecords");
  //   const respData = await resp.json();

  //   if (resp.ok) {
  //     const today = new Date();
  //     const yesterday = new Date(today);
  //     yesterday.setDate(yesterday.getDate() - 1);
  //     const yesterdayISO = yesterday.toISOString().slice(0, 10);
  //     const filtered = respData.filter(
  //       (item) => item.createdAt.slice(0, 10) === yesterdayISO
  //     );

  //     const updatedData = filtered
  //       .map((item) => {
  //         const completed = item.routineComplete.reduce((acc, completeItem) => {
  //           if (completeItem.status) {
  //             return [
  //               ...acc,
  //               { ...completeItem, routineName: item.routineName },
  //             ];
  //           } else {
  //             return acc;
  //           }
  //         }, []);
  //         return completed; // update the routineComplete array in the item
  //       })
  //       .filter((item) => item.length > 0)
  //       .flat();
  //   }
  // };

  const fetchSelected = async (eld) => {
    const resp = await fetch(`/api/management/residents?_id=${eld._id}`);
    const respData = await resp.json();

    if (resp.ok) {
      setSelectedResident(...respData);
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

  function percentage(complete, total) {
    if (complete === 0 || total === 0) return 0;
    return Math.round((complete / total) * 100);
  }

  function findCompleteTotal(data) {
    const result = data.reduce((count, item) => {
      if (
        item.todayResidentRoutine === true ||
        item.todayMedicationRoutine === true
      ) {
        return count + 1;
      }
      return count;
    }, 0);
    return result;
  }

  function getRoutienCategoryItems(category) {
    if (category === "medication") {
      setCategory(medicationList);
    }
    const result = routineList.filter((r) => r.routineCategory === category);
    setCategory(result);
  }

  const handleSelectItems = (item) => {
    const check = eldRoutineItems.includes(item.routineName);

    if (check) {
      setSelectedError(item.routineName);
    } else {
      setSelectedError("");
      setSelectedItem(item);
    }
  };

  const [checkedRoutine, setCheckedRoutine] = useState([]);
  const [completedRoutine, setCompletedRoutine] = useState([]);
  const [checkedMedication, setCheckedMedication] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checkedRoutine.indexOf(value.routineName || value);
    const newChecked = [...checkedRoutine];

    if (currentIndex === -1) {
      newChecked.push(value.routineName || value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedRoutine(newChecked);
    setCompletedRoutine([...completedRoutine, value]);
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

  const getCurrentShift = () => {
    const hour = today.getHours();

    if (hour >= 8 && hour < 14) {
      return "A";
    } else if (hour >= 14 && hour < 22) {
      return "P";
    } else {
      return "N";
    }
  };

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const handleAddItem = (newItem) => {
    const index = eldRoutineItems.indexOf(newItem.routineName);
    if (index !== -1) {
      handleToggle(newItem)();
      return;
    }
    setCheckedRoutine([...checkedRoutine, newItem]);
    setCompletedRoutine([...completedRoutine, newItem]);
    setSelectedItemList([...selectedItemList, newItem]);
  };

  const handlePenClick = (item) => {
    setSelectedItem(item);
    setSelectedError("");
  };

  const saveRoutine = async (item) => {
    try {
      const resp = await fetch(
        `/api/management/work/todayworkrecords?routineName=${item.routineName}`
      );
      const respData = await resp.json();
  
      if (resp.ok && respData.length>0) {
        const updatedRoutineComplete = respData[0].routineComplete.map((obj) => {
          if (obj.id === item.id) {
            return {
              ...obj,
              status: true,
              shift: item.shift,
              notes: item.notes,
              value: item.value,
            };
          }
          return obj;
        });
        await submit(
          "/api/management/work/todayworkrecords/" + respData[0]._id,
          {
            routineComplete: updatedRoutineComplete,
          },
          "PATCH"
        );
      } else {
        const newRecord = {
          routineName: item.routineName,
          routineCategory: "health care",
          routineComplete: {
            id: item.id,
            status: true,
            shift: item.shift,
            notes: item.notes,
            value: item.value,
          },
          routinePerformer: "caregivers",
          routinePerformedBy: `${user.account} (${user.lastName}, ${user.firstName})`,
          toElderly: true,
          specialNeeded: false,
        };
        await submit("/api/management/work/todayworkrecords", newRecord, "POST");
  
        setOpen(true)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveRoutine = async (itemList) => {
    // itemList.forEach((item) => {
    //   saveRoutine(item);
    // });

    // await submit(
    //   "/api/management/residents/" + selectedResident._id,
    //   {
    //     todayRoutineItems: completedRoutine,
    //     todayResidentRoutine: true,
    //   },
    //   "PATCH"
    // );
    // setOpen(true);
    checkRoutineNamesMatch(selectedResident.defaultRoutineItems, completedRoutine, setAllCompleted)
  };

  const handleSaveMedications = async () => {
    const med = checkedMedication.map((item) => {
      return { shift: getCurrentShift(), medication: item };
    });
    await submit(
      "/api/management/residents/" + selectedResident._id,
      { todayMedicationItems: med, todayMedicationRoutine: true },
      "PATCH"
    );
    setOpen(true);
  };

  const [allCompleted, setAllCompleted] = useState();
  function checkRoutineNamesMatch(routineNames, objects, setState) {
    const objectNames = objects.map(obj => obj.routineName);
    
    const routineNamesMatch = routineNames.every(routineName => {
      return objectNames.includes(routineName);
    });
    
    setState(routineNamesMatch);
  }

  console.log(allCompleted)

  const CustomRoutineList = ({ header, items, title, type }) => {
    return (
      <>
        <ListSubheader component="div" id="nested-list-subheader">
          {header}
        </ListSubheader>
        {items &&
          items.map((r, idx) => (
            <ListItem
              key={idx}
              disabled={currentShift !== userShift}
              secondaryAction={
                type === "routine" && (
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handlePenClick(r)}
                  >
                    <EditIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                disabled={currentShift !== userShift}
                role={undefined}
                onClick={
                  type === "medication" ? handleToggleMedication(r) : undefined
                }
                dense
              >
                <ListItemIcon sx={{ mr: 0 }}>
                  <Checkbox
                    edge="start"
                    checked={
                      type === "routine"
                        ? checkedRoutine.indexOf(r) !== -1
                        : checkedMedication.indexOf(r) !== -1
                    }
                    tabIndex={-1}
                    disableRipple
                    sx={{ p: 0 }}
                  />
                </ListItemIcon>
                <Stack key={idx} direction="row" alignItems={"center"}>
                  {title === "default" && (
                    <StarIcon sx={{ fontSize: 20, color: "#f57c00", mr: 1 }} />
                  )}
                  <Typography ml={1}>{r.routineName || r}</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
      </>
    );
  };

  console.log(completedRoutine);
  useEffect(() => {
    fetchResidentInfo();
    fetchRoutine();
    fetchMedication();
    //fetchWorkRecords();
    setUserShift(formatShift(user.workingShift));
    setCurrentShift(getCurrentShift());
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

  useEffect(() => {
    fetchSelected(selectedResident);
  }, [open]);

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title="Update today routine items successfully!"
      />

      <Grid container>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={6}>
              <Paper sx={{ mb: 3, p: 3, mr: 2, height: 250 }}>
                <Controls.Bold variant="h5" mb={3}>
                  Today's Working Area
                </Controls.Bold>
                <Controls.Bold
                  variant="h6"
                  fontStyle={"italic"}
                  color="#808191"
                >
                  {`Shift: ${userShift}`}
                </Controls.Bold>

                <Controls.Bold
                  variant="h6"
                  fontStyle={"italic"}
                  color="#808191"
                  sx={{ wordBreak: "break-word" }}
                >
                  {`Room: ${
                    user.workingArea.length > 0 ? user.workingArea : "/"
                  }`}
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
                  {residents && residents.length > 0 ? (
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
                              bgcolor={
                                res.todayResidentRoutine ? "green" : "red"
                              }
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
                    ))
                  ) : (
                    <Typography>No data </Typography>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs md>
          {selectedResident ? (
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
                    <img
                      src={MaleElderly}
                      alt="Male"
                      width="140"
                      height="190"
                    />
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
                        {selectedResident.todayRoutineItems.length}
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
                      {selectedResident.todayMedicationRoutine ? (
                        <CheckCircleIcon
                          sx={{ fontSize: 50, color: "#26a69a", pr: 2 }}
                        />
                      ) : (
                        <CancelIcon sx={{ fontSize: 50, color: "#ef5350" }} />
                      )}
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
          ) : (
            <Stack direction="row" my={3} alignItems={"center"}>
              <CancelIcon sx={{ color: "#ef5350" }} />
              <Typography variant="h5">
                No selected elderly for today's routine
              </Typography>
            </Stack>
          )}

          <Divider />

          <Stack direction="row" display="flex" alignItems="center" gap={1}>
            {userShift && currentShift && userShift !== currentShift && (
              <>
                <ErrorOutlineIcon sx={{ fontSize: 50 }} />
                <Typography variant="h6">
                  You are currently not allowed to modify elderly routine
                  profile
                </Typography>
              </>
            )}
          </Stack>

          <Grid container>
            {selectedResident &&
            selectedResident.todayMedicationRoutine &&
            selectedResident.todayResidentRoutine ? (
              <>
                <Grid item xs={6} md={4}>
                  <Stack direction="row" mt={2} ml={2} gap={1}>
                    <ElderlyIcon />
                    <Typography variant="h6">Today's routine items</Typography>
                  </Stack>

                  {selectedResident &&
                    selectedResident.todayRoutineItems.map((item, idx) => (
                      <Grid item key={idx}>
                        <Paper sx={{ p: 3, m: 2 }}>
                          <Stack>
                            <Stack direction="row" alignItems="center">
                              <CheckCircleIcon
                                sx={{ fontSize: 40, color: "#26a69a" }}
                              />
                              <Controls.Bold ml={1}>
                                {item.routineName}
                              </Controls.Bold>
                            </Stack>
                            <Stack ml={6}>
                              {item.value && (
                                <Stack mb={2}>
                                  {Object.entries(item.value).map(
                                    ([key, value]) => (
                                      <Stack key={key} direction="row" gap={1}>
                                        <Controls.Bold color="#808191">{`${key}: `}</Controls.Bold>
                                        <Controls.Bold color="#808191">
                                          {value}
                                        </Controls.Bold>
                                      </Stack>
                                    )
                                  )}
                                </Stack>
                              )}
                              <Typography>{`Shift: ${item.shift}`}</Typography>
                              <Typography>{`Notes: ${item.notes}`}</Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack direction="row" mt={2} ml={2} gap={1}>
                    <MedicationLiquidIcon />
                    <Typography variant="h6">
                      Today's medication items
                    </Typography>
                  </Stack>

                  {selectedResident && selectedResident.todayMedictionItems ? (
                    selectedResident.todayMedicationItems.map((item, idx) => (
                      <Grid item key={idx}>
                        <Paper sx={{ p: 3, m: 2, minHeight: 90 }}>
                          <Stack>
                            <Stack direction="row" alignItems="center">
                              <CheckCircleIcon
                                sx={{ fontSize: 40, color: "#26a69a" }}
                              />
                              <Controls.Bold ml={1}>
                                {item.medication}
                              </Controls.Bold>
                            </Stack>
                            <Typography
                              ml={6}
                            >{`Shift: ${item.shift}`}</Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Stack alignItems={"center"} ml={6} mt={5}>
                      <ErrorOutlineIcon />
                      <Typography variant="h6">
                        No shift medicine is assigned
                      </Typography>
                    </Stack>
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6} md={3}>
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
                  <Paper sx={{ p: 3, width: "95%" }}>
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
                            width: "107%",
                            height: "400px",
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
                        <Button
                          onClick={() => handleSaveRoutine(completedRoutine)}
                        >
                          Save changes
                        </Button>
                      </>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box height="56px" />
                  <Paper sx={{ p: 3, ml: 6, width: "80%" }}>
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
                            width: "100%",
                            height: "400px",
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

                    <Button onClick={handleSaveMedications}>
                      Save changes
                    </Button>
                  </Paper>
                </Grid>
              </>
            )}

            <Grid item xs={12} md p={3} ml={5}>
              {/* 1. Three category */}
              {category === undefined || category === "" ? (
                <Stack alignItems={"center"} mt={3}>
                  {["cleaning (elderly)", "health care", "medication"].map(
                    (category, idx) => (
                      <Box
                        height="150px"
                        display="flex"
                        justifyContent={"center"}
                        width="50%"
                        border={"2px solid orange"}
                      >
                        <Button
                          onClick={() => getRoutienCategoryItems(category)}
                        >
                          {icons[idx]}
                          <Controls.Bold variant="h5" ml={1}>
                            {category}
                          </Controls.Bold>
                        </Button>
                      </Box>
                    )
                  )}
                </Stack>
              ) : (
                // 4. Category header
                <Stack>
                  <Stack direction="row">
                    {!selectedItem && (
                      <Button
                        onClick={() => {
                          setCategory("");
                          setSelectedItem("");
                        }}
                        sx={{ mb: 2 }}
                      >
                        <ArrowBackIosIcon />
                        Back to category
                      </Button>
                    )}
                  </Stack>
                  {selectedError && (
                    <Typography
                      variant="h6"
                      color="#f44336"
                    >{`Item "${selectedError}" has already been selected as default`}</Typography>
                  )}
                  {/* 3. Category item spread  */}
                  {selectedItem ? (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedItem("");
                        }}
                        sx={{ mb: 2 }}
                      >
                        <ArrowBackIosIcon />
                        Back to category items
                      </Button>
                      <Controls.Bold variant="h5" mb={3}>{`Routine Item: ${
                        selectedItem.routineName || selectedItem
                      }`}</Controls.Bold>
                      {getSelectedItemsForm(selectedItem)}
                    </>
                  ) : (
                    // 2/ Category items
                    <Grid container spacing={2} mb={3}>
                      {category.map((item, idx) => (
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
                                handleSelectItems(item);
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
    </>
  );
};

export default CaregiversHome;
