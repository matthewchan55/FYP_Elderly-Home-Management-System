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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

import { useState, useEffect, useMemo } from "react";
import { useSubmit } from "../../hook/useSubmit";
import { Controls } from "../controls/Controls";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";

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
  const [sortedResData, setSortedResData] = useState();
  const [unsortedResData, setUnsortedResData] = useState();
  const [selectedEld, setSelectedEld] = useState();

  const [routineData, setRoutineData] = useState();
  const [selectedRoutine, setSelectedRoutine] = useState();

  const [left, setLeft] = useState();
  const [right, setRight] = useState();
  const [checked, setChecked] = useState([]);

  // checkboxes
  const [state, setState] = useState([]);
  const [falseTrue, setFalseTrue] = useState(false);
  const { A, P, N } = state;

  const handleChange = (event) => {
    setFalseTrue(true);
    const { value } = event.target;
    setSelectedRoutine({
      ...selectedRoutine,
      fixedTimePeriod: [...selectedRoutine.fixedTimePeriod, value],
    });
  };

  // multiple add
  const [addEld, setAddEld] = useState();
  const handleAddChange = (event) => {
    const {
      target: { value },
    } = event;
    const newAddEld = typeof value === "string" ? value.split(",") : value;

    setAddEld(newAddEld);
    setSelectedRoutine((prev) => {
      return {
        ...prev,
        setDefaultTo: [...newAddEld],
      };
    });
  };

  // create routine
  const [createRoutine, setCreateRoutine] = useState(false);

  const fetchRoutine = async (eld) => {
    const resp = await fetch("/api/management/work/routine");
    const respData = await resp.json();

    if (resp.ok) {
      setRoutineData(respData);
      setSelectedRoutine(respData[0]);
      setAddEld(respData[0].setDefaultTo);
      const result = respData.map((d) => d.routineName);
      setLeft(result)

    }
  };

  const sortResidentsAsc = (d) => {
    setUnsortedResData(d);
    const copy = [...d];
    const sorted = sortRoomBed(copy);
    setSortedResData(sorted);
    setSelectedEld(sorted[0]);
    setRight(sorted[0].defaultRoutineItems);
  };

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

  useEffect(() => {
    sortResidentsAsc(data);
    fetchRoutine();
  }, []);

  useMemo(() => {
    setRight(selectedEld && selectedEld.defaultRoutineItems);
  }, [selectedEld]);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setSelectedRoutine({
      ...selectedRoutine,
      [name]: value,
    });
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
    const eld = sortedResData.find((data) => data.residentID === res);

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

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => (event) => {
    // not toggle the checkbox if click on a pen
    if (event.target.closest(".MuiIconButton-root") !== null) {
      return;
    }
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

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedDelete = async () => {
    const filtered = not(right, rightChecked);
    setRight(filtered);
    const removeDefault = rightChecked.map(async (item) => {
      const itemId = routineData
        .find((d) => d.routineName === item)
        ._id;
      const resID = selectedEld.residentID;

      await submit(
        "/api/management/work/routine/updateDel/" + itemId,
        { setDefaultTo: resID },
        "PATCH"
      );
    });
    await Promise.all(removeDefault);

    await submit(
      "/api/management/residents/" + selectedEld._id,
      { defaultRoutineItems: filtered },
      "PATCH"
    );
    setChecked(not(checked, rightChecked));
    setOpen(true);
  };

  const handlePenClick = (value) => {
    const result = routineData.find((d) => d.routineName === value);
    setSelectedRoutine(result);
    setAddEld(result.setDefaultTo);
  };

  const { submit, error } = useSubmit();
  const { open, setOpen, handleClose } = useAlert();


  const saveRoutineItems = async () => {
    // right: routine item add elderly id (one id only)
    const routineUpdate = right.map(async (d) => {
      const routineId = routineData
        .find((item) => item.routineName === d)
        ._id
      const resId = selectedEld.residentID;

      await submit(
        "/api/management/work/routine/updateAdd/" + routineId,
        { setDefaultTo: resId },
        "PATCH"
      );
    });
    await Promise.all(routineUpdate);

    // right: all routine item add to elderly default item
    await submit(
      "/api/management/residents/" + selectedEld._id,
      { defaultRoutineItems: right },
      "PATCH"
    );
    setOpen(true);
  };

  const saveRoutineItemsDetails = async () => {
    console.log()
    // // routine detail: add routine to each elderly (multiple id)
    // const resUpdate = selectedRoutine.setDefaultTo.map(async (res) => {
    //   const eldID = sortedResData.find((item) => item.residentID === res)._id;
    //   await fetch("/api/management/residents/routineAdd/" + eldID, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({defaultRoutineItems: selectedRoutine.routineName})
    //   });
    // });
    // await Promise.all(resUpdate);

    // // routine detail: update routine
    // await submit(
    //   "/api/management/work/routine/" + selectedRoutine._id,
    //   selectedRoutine,
    //   "PATCH"
    // );
    // setOpen(true);
  };

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
                  key={value}
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
                  <ListItemText key={value} id={labelId} primary={`${value}`} />
                </ListItem>
              );
            })}
        </List>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        {items === right ? (
          <Button onClick={saveRoutineItems}>Save change</Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCreateRoutine(true)}
            sx={{ borderRadius: "50%" }}
          >
            +
          </Button>
        )}
      </CardActions>
    </Card>
  );

  useMemo(() => {
    fetchRoutine();
  }, [open]);

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title="Update service items for elderly successfully!"
      />
      <Grid container direction="row">
        <Grid item xs={12} md={2} minWidth="220px">
          <ResidentList
            data={sortedResData}
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
                  <Typography>{`1/2`}</Typography>
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
                  {selectedEld && selectedEld.todayResidentRoutine === true ? (
                    <CheckCircleIcon sx={{ color: "#26a69a" }} />
                  ) : (
                    <CancelIcon sx={{ color: "#ef5350" }} />
                  )}
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
                  {createRoutine ? (
                    <Typography>HI</Typography>
                  ) : (
                    <>
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
                                onChange={handleInputChanges}
                              />
                              <Controls.Bold>Routine Category</Controls.Bold>
                              <Controls.DisabledInput
                                variant="standard"
                                name="routineCategory"
                                value={selectedRoutine.routineCategory}
                              />
                              <Controls.Bold>Fixed Time</Controls.Bold>
                              <Controls.Selection
                                key={"fixedTime"}
                                variant="standard"
                                name="fixedTime"
                                defaultValue={selectedRoutine.fixedTime}
                                value={selectedRoutine.fixedTime}
                                onChange={handleInputChanges}
                                items={[
                                  {
                                    name: "fixedTime",
                                    value: true,
                                    label: "Yes",
                                  },
                                  {
                                    name: "fixedTime",
                                    value: false,
                                    label: "No",
                                  },
                                ]}
                              />

                              {selectedRoutine.fixedTime && (
                                <>
                                  <Controls.Bold>
                                    Fixed Time Period
                                  </Controls.Bold>
                                  <Stack direction="row" gap={2}>
                                    {selectedRoutine.fixedTimePeriod.length !==
                                      0 && !falseTrue ? (
                                      selectedRoutine.fixedTimePeriod.map(
                                        (time) => (
                                          <Stack direction="row">
                                            <CheckCircleIcon
                                              sx={{ color: "#26a69a" }}
                                            />
                                            <Typography>{time}</Typography>
                                          </Stack>
                                        )
                                      )
                                    ) : (
                                      <Box sx={{ display: "flex" }}>
                                        <FormControl
                                          component="fieldset"
                                          variant="standard"
                                        >
                                          <FormGroup row>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={A}
                                                  onChange={handleChange}
                                                  value="A"
                                                />
                                              }
                                              label="A"
                                            />
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={P}
                                                  onChange={handleChange}
                                                  value="P"
                                                />
                                              }
                                              label="P"
                                            />
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={N}
                                                  onChange={handleChange}
                                                  value="N"
                                                />
                                              }
                                              label="N"
                                            />
                                          </FormGroup>
                                          <FormHelperText>
                                            Pick shift(s)
                                          </FormHelperText>
                                        </FormControl>
                                      </Box>
                                    )}
                                  </Stack>
                                </>
                              )}
                            </Stack>
                          </Grid>

                          <Grid item md>
                            <Controls.Bold mb={2}>
                              Default routine to elderly
                            </Controls.Bold>
                            {addEld && (
                              <FormControl sx={{ m: 1, width: "80%" }}>
                                <InputLabel id="eld-select">
                                  Select elderly
                                </InputLabel>
                                <Select
                                  labelId="eld-select"
                                  multiple
                                  value={addEld}
                                  input={
                                    <OutlinedInput label="Select elderly" />
                                  }
                                  onChange={handleAddChange}
                                  renderValue={(selected) =>
                                    selected.join(", ")
                                  }
                                  MenuProps={{
                                    PaperProps: { style: { maxHeight: 250 } },
                                  }}
                                >
                                  {unsortedResData &&
                                    unsortedResData.map((item) => (
                                      <MenuItem
                                        key={item.residentID}
                                        value={item.residentID}
                                      >
                                        <Checkbox
                                          checked={
                                            addEld.indexOf(item.residentID) > -1
                                          }
                                        />
                                        <ListItemText
                                          primary={item.residentID}
                                        />
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            )}

                            {selectedRoutine.setDefaultTo ? (
                              selectedRoutine.setDefaultTo.map((res) =>
                                findRes(res)
                              )
                            ) : (
                              <Typography>No elderly is set</Typography>
                            )}
                          </Grid>

                          <Button onClick={saveRoutineItemsDetails}>
                            Save routine details changes
                          </Button>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </>
            )}

            {/* 2. Change routine info */}
            <Grid item xs={12} md={6}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ResidentRoutineManagement;
