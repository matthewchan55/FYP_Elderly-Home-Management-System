import ResidentList from "./ResidentList";
import {
  Grid,
  Divider,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  ListItem,
  Checkbox,
  List,
  IconButton,
  Button,
  CardActions,
  CardHeader,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Controls } from "../controls/Controls";
import { useState, useEffect, useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const ResidentRoutineManagement = ({ data }) => {
  // res list
  const [sortedData, setSortedData] = useState();
  // res list onclick
  const [selectedEld, setSelectedEld] = useState();

  const [routineData, setRoutineData] = useState();
  const [left, setLeft] = useState();
  const [right, setRight] = useState();
  const [checked, setChecked] = useState([]);
  //pen click
  const [selectedRoutine, setSelectedRoutine] = useState();

  function sortRoomBed(data) {
    const sortList = data.sort((a, b) => {
      if (a.room === b.room) {
        return a.bed > b.bed ? 1 : -1;
      } else {
        return a.room > b.room ? 1 : -1;
      }
    });
    return sortList;
  }

  const sortResidentsAsc = (d) => {
    const copy = [...d];
    const sorted = sortRoomBed(copy);
    setSortedData(sorted);
    setSelectedEld(sorted[0]);
    fetchRoutine(sorted[0]);
  };

  const fetchRoutine = async (eld) => {
    const resp = await fetch("/api/management/work/routine");
    const respData = await resp.json();

    if (resp.ok) {
      const rightData = getRightItems(respData);

      const routine =
        eld &&
        rightData &&
        rightData.filter((d) => d.resident === eld.residentID);

      setRoutineData(rightData);
      //left
      setLeft(respData);
      //right (changing)
      setRight(routine.routine);
      // on the rightest information
      setSelectedRoutine(respData[0]);
    }
  };

  function getRightItems(data) {
    const residentRoutines = data.reduce((acc, routine) => {
      routine.setDefaultTo.forEach((resident) => {
        const residentIndex = acc.findIndex(
          (item) => item.resident === resident
        );
        if (residentIndex === -1) {
          acc.push({
            resident: resident,
            routine: [routine.routineName],
          });
        } else {
          acc[residentIndex].routine.push(routine.routineName);
        }
      });
      return acc;
    }, []);
    return residentRoutines;
  }

  const findEldRoutine = (data) => {
    const routine =
      data &&
      selectedEld &&
      data.find((d) => d.resident === selectedEld.residentID);

    console.log(routine, selectedEld);
    if (routine) {
      setRight(routine.routine);
    } else {
      setRight([]);
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function findRes(res) {
    const eld = sortedData.find((data) => data.residentID === res);

    const { lastName, firstName, room, bed } = eld;

    return (
      <Box direction="row" display={"flex"} alignItems="center" mt={1}>
        <Avatar {...stringAvatar(`${lastName} ${firstName}`)} />
        <Stack ml={2}>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Resident ID: ${res}`}</Typography>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Name: ${lastName}, ${firstName}`}</Typography>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Bed: ${room}-${bed}`}</Typography>
        </Stack>
      </Box>
    );
  }

  useMemo(() => {
    findEldRoutine(routineData);
  }, [selectedEld]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

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

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleLeftCheckedItem = (lc) => {
    const result = lc.map(({ serviceName, serviceCost }) => {
      return { item: serviceName, charge: serviceCost, payment: 0 };
    });
    return result;
  };

  const handleCheckedRight = () => {
    const customize = handleLeftCheckedItem(leftChecked);
    setRight(right.concat(customize));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedDelete = () => {
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handlePenClick = (value) => {
    setSelectedRoutine(value);
    //setCreateService(false);
  };
  console.log(selectedRoutine);

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <CardContent>
        <List
          sx={{
            width: "295px",
            height: "36vh",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.length > 0 &&
            items.map((value, idx) => {
              const labelId = `transfer-list-all-item-${value}-label`;

              return (
                <ListItem
                  key={value.routineName}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  secondaryAction={
                    items === left && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handlePenClick(value)}
                      >
                        <EditIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon key={idx}>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    key={value.routineName}
                    id={labelId}
                    primary={`${value.routineName || value}`}
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    // Left: elderly list
    sortResidentsAsc(data);
    // Transferlist: left & right
  }, []);

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={2} minWidth="220px">
        <ResidentList
          data={sortedData}
          eld={selectedEld}
          setEld={setSelectedEld}
        />
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs md p={2}>
        <Grid container mb={2}>
          <Grid item md={7} xs={12}>
            {selectedEld && (
              <Stack gap={1}>
                <Typography>{`Name: ${selectedEld.lastName}, ${selectedEld.firstName} (Resident ID: ${selectedEld.residentID})`}</Typography>
                <Typography>{`Room: ${selectedEld.room}, ${selectedEld.bed}`}</Typography>
                <Typography>{`Relative Name: ${
                  selectedEld.relativesName || ""
                } Relative Contact: ${
                  selectedEld.relativesPhone || ""
                }`}</Typography>
              </Stack>
            )}
          </Grid>

          <Grid item md xs={12} mb={2}>
            <Stack direction="row" gap={4}>
              <Box
                sx={{
                  width: "225px",
                  border: "1px solid grey",
                  borderRadius: "10px",
                  py: 3,
                  pl: 3,
                }}
              >
                <Controls.Bold>Today's routine items</Controls.Bold>
                <Typography>{`Completed: 6`}</Typography>
                <Typography>{`Not Complete: 5`}</Typography>
              </Box>
              <Box
                sx={{
                  width: "200px",
                  border: "1px solid grey",
                  borderRadius: "10px",
                  py: 3,
                  pl: 3,
                }}
              >
                <Controls.Bold>Complete today's routine</Controls.Bold>
                <Typography></Typography>
              </Box>
            </Stack>
          </Grid>

          <Divider style={{ width: "100%" }} flexItem />
        </Grid>

        <Grid container>
          {/* 1. Set default routine */}
          {left && right && (
            <>
              <Grid item xs={12} md={7}>
                <Grid container alignItems="center" minWidth={700}>
                  <Grid item xs={5} md={5}>
                    {customList("Total Routines", left)}
                  </Grid>
                  <Grid item xs md={1.5}>
                    <Grid container direction="column" alignItems="center">
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={
                          leftChecked.length === 0 || rightChecked.length > 0
                        }
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={handleCheckedDelete}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                      >
                        x
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item xs={5} md={5}>
                    {customList("Total Routines", right)}
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} md p={3}>
                <Controls.Bold
                  mb={4}
                  variant="h6"
                >{`Selected routine item: ${selectedRoutine.routineName}`}</Controls.Bold>
                {selectedRoutine && (
                  <Grid container>
                    <Grid item md={5}>
                      <Stack gap={2}>
                        <Controls.Bold>Routine Name</Controls.Bold>
                        <Controls.OutlinedInput
                          variant="standard"
                          name="routineName"
                          value={selectedRoutine.routineName}
                        />
                        <Controls.Bold>Routine Category</Controls.Bold>
                        <Controls.OutlinedInput
                          variant="standard"
                          name="routineCategory"
                          value={selectedRoutine.routineCategory}
                        />
                        <Controls.Bold>Fixed Time</Controls.Bold>
                        <Controls.OutlinedInput
                          variant="standard"
                          name="fixedTime"
                          value={selectedRoutine.fixedTime ? "Yes" : "No"}
                        />

                        {selectedRoutine.fixedTime && (
                          <Controls.Bold>Fixed Time Period</Controls.Bold>
                        )}
                        <Stack direction="row" gap={2}>
                          {selectedRoutine.fixedTime &&
                            selectedRoutine.fixedTimePeriod.map((time) => (
                              <Stack direction="row">
                                <CheckCircleIcon sx={{ color: "#26a69a" }} />
                                <Typography>{time}</Typography>
                              </Stack>
                            ))}
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item md>
                      <Controls.Bold mb={2}>
                        Default routine to elderly
                      </Controls.Bold>

                      {selectedRoutine.setDefaultTo.map((res) => findRes(res))}

                      <Box display={"flex"} justifyContent="center" mt={2}>
                        <IconButton disableTouchRipple>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* 2. Change routine info */}
          <Grid item xs={12} md={6}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResidentRoutineManagement;
