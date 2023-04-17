import {
  Grid,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  CardContent,
  List,
  CardActions,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Stack,
  Box,
  FormControl,
  Avatar,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

import { useState, useMemo, useEffect } from "react";
import { Controls } from "../controls/Controls";
import useAvatar from "../../hook/useAvatar";
import { useSubmit } from "../../hook/useSubmit";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";

// pass left, right
const ResidentDefaultRoutineItems = ({
  tabLeft,
  tabRight,
  selectedEld,
  setSelectedEld,
  selectedRoutine,
  setSelectedRoutine,
  routineData,
  unsortedRes,
}) => {
  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  const { submit, error } = useSubmit();
  const { open, setOpen, handleClose } = useAlert();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(tabLeft);
  const [right, setRight] = useState(tabRight);

  const numberOfChecked = (items) => intersection(checked, items).length;

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  // click on checkboxItem
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

  // click on selectall
  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  // click on > button
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setChecked(not(checked, leftChecked));
  };

  // click on x button
  const handleCheckedDelete = async () => {
    const filtered = not(right, rightChecked);
    setRight(filtered);

    // remove eld from routine items
    const removeDefault = rightChecked.map(async (item) => {
      const itemId = routineData.find((d) => d.routineName === item)._id;
      const resID = selectedEld.residentID;

      await submit(
        "/api/management/work/routine/updateDel/" + itemId,
        { setDefaultTo: resID },
        "PATCH"
      );
    });
    await Promise.all(removeDefault);

    // remove eld default routine
    await submit(
      "/api/management/residents/" + selectedEld._id,
      { defaultRoutineItems: filtered },
      "PATCH"
    );
    setChecked(not(checked, rightChecked));
    setOpen(true);
  };

  const saveRoutineItems = async () => {
    // right: routine item add elderly id (one id only)
    const routineUpdate = right.map(async (d) => {
      const routineId = routineData.find((item) => item.routineName === d)._id;
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

  // click pen and its routine info
  const handlePenClick = (value) => {
    const result = routineData.find((d) => d.routineName === value);
    setSelectedRoutine(result);
    setAddEld(result.setDefaultTo);
  };

  // multiple add
  const [addEld, setAddEld] = useState(selectedRoutine.setDefaultTo);
  const { stringAvatar } = useAvatar();

  function findRes(res) {
    const eld =
      unsortedRes && unsortedRes.find((data) => data.residentID === res);

    const { lastName, firstName, room, bed } = eld;

    return (
      <Box
        key={`${room}-${bed}`}
        direction="row"
        display={"flex"}
        alignItems="center"
        mt={1}
      >
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

  const findTime = (item) => {
    const routine = routineData.find((d) => d.routineName === item);
    return routine.fixedTimePeriod;
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
            width: "290px",
            height: "36vh",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.length > 0 &&
            // value=== routineName
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
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        {items === right ? (
          <Button onClick={saveRoutineItems}>Save change</Button>
        ) : (
          <Box height={"40px"} />
        )}
      </CardActions>
    </Card>
  );

  const fetchSelectedUser = async (user) => {
    const resp = await fetch(`/api/management/residents?_id=${user._id}`);
    const respData = await resp.json();

    if (resp.ok) {
      setSelectedEld(...respData);
    }
  };

  const fetchSelectedRoutine = async (routine) => {
    const resp = await fetch(`/api/management/work/routine?_id=${routine._id}`);
    const respData = await resp.json();

    if (resp.ok) {
      setSelectedRoutine(...respData);
    }
  };

  useMemo(() => {
    setRight(selectedEld.defaultRoutineItems);
  }, [selectedEld]);

  useEffect(() => {
    fetchSelectedUser(selectedEld);
    fetchSelectedRoutine(selectedRoutine);
  }, [open]);

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title="Update service items for elderly successfully!"
      />
      <Grid container>
        <Grid item xs={12} md={8}>
          <Grid container alignItems={"center"} gap={2}>
            <Grid item xs={5} md={5}>
              {left && customList("Total Routines", left)}
            </Grid>
            <Grid item xs md={1}>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0 || rightChecked.length > 0}
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
              {right &&
                customList(
                  `Default Routines to ${selectedEld.lastName}, ${selectedEld.firstName}`,
                  right
                )}
            </Grid>
          </Grid>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={12} md>
          {selectedRoutine && (
            <Stack ml={4} mb={5}>
              <Typography mb={4} variant="h6">
                {`Routine: ${selectedRoutine.routineName}`}
              </Typography>

              <Grid container>
                <Grid item xs={12} md={6}>
                  <Stack gap={2}>
                    <Controls.Bold>Routine Name</Controls.Bold>
                    <Controls.OutlinedInput
                      variant="standard"
                      name="routineName"
                      value={selectedRoutine.routineName}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Controls.Bold>Routine Category</Controls.Bold>
                    <Controls.OutlinedInput
                      variant="standard"
                      name="routineCategory"
                      value={selectedRoutine.routineCategory}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Controls.Bold>Fixed Time</Controls.Bold>
                    <Controls.Selection
                      key={"fixedTime"}
                      disabled
                      variant="standard"
                      name="fixedTime"
                      defaultValue={selectedRoutine.fixedTime}
                      value={selectedRoutine.fixedTime}
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
                        <Controls.Bold>Fixed Time Period</Controls.Bold>
                        <Stack direction="row" gap={2}>
                          {selectedRoutine.fixedTimePeriod.length !== 0 &&
                            selectedRoutine.fixedTimePeriod.map((time) => (
                              <Stack direction="row" key={time}>
                                <CheckCircleIcon sx={{ color: "#26a69a" }} />
                                <Typography>{time}</Typography>
                              </Stack>
                            ))}
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Grid>
                   
                <Grid item xs={12} md={6}>
                  <Controls.Bold mb={2}>
                    Default routine to elderly
                  </Controls.Bold>

                  <FormControl sx={{ m: 1, width: "80%" }}>
                    <InputLabel id="eld-select">
                      {addEld && addEld.length === 0
                        ? "No elderly"
                        : "Default To"}
                    </InputLabel>
                    <Select
                      labelId="eld-select"
                      multiple
                      disabled
                      value={addEld || []}
                      input={<OutlinedInput label="Default To" />}
                      renderValue={(addEld) => addEld.join(", ")}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 250 } },
                      }}
                    ></Select>
                  </FormControl>

                  {selectedRoutine.setDefaultTo.length > 0 &&
                    selectedRoutine.setDefaultTo.map((res) => findRes(res))}
                </Grid>
              </Grid>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ResidentDefaultRoutineItems;
