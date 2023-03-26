import {
  FormControlLabel,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
  Divider,
  Grid,
  Stack,
  Checkbox,
  Icon,
  Paper,
  AvatarGroup,
  Grow,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";

import FemaleElderly from "../../assets/female_elderly.png";
import MaleElderly from "../../assets/male_elderly.png";
import { useState, useEffect } from "react";
import { useDrawerContext } from "../../hook/useDrawerContext";
import PageHeader from "../../components/PageHeader";
import { Controls } from "../../components/controls/Controls";
import Floorplan from "../../assets/floorplan.png";
import { useSubmit } from "../../hook/useSubmit";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../../components/SmallAlert";
import parseISO from "date-fns/parseISO";
import PageOverviewHeader from "../../components/PageOverviewHeader";

const ManagementFacility = () => {
  // const [editRoom, setEditRoom] = useState(false);
  // const [plotCoordinates, setPlotCoordinates] = useState([]);

  // const handleStartClick = () => {
  //   setEditRoom(true);
  // };

  // const handleFinishClick = () => {
  //   setEditRoom(false);
  //   setPlotCoordinates([])
  // };

  // const handleClickOnImage = (e) => {
  //   if (editRoom) {
  //     const coor = [...plotCoordinates];
  //     coor.push({ x: e.clientX, y: e.clientY });
  //     setPlotCoordinates(coor);
  //   }
  // };

  // document.onmouseup = getXYPosition;
  // var myX, myY, xyOn, myMouseX, myMouseY;
  // xyOn = true;
  // function getXYPosition(e) {
  //   myMouseX = e.clientX;
  //   myMouseY = e.clientY;
  //   console.log(myMouseX, myMouseY)
  //   if (document.documentElement.scrollTop > 0) {
  //     myMouseY = myMouseY + document.documentElement.scrollTop;
  //   }
  // }
  const drawerWidth = 280;
  const { open: openDrawer } = useDrawerContext();

  const [bedPoints, setBedPoints] = useState([]);
  const [roomPoints, setRoomPoints] = useState([]);
  const [filteredBedPoints, setFilteredBedPoints] = useState([]);
  const [filteredRoomPoints, setFilteredRoomPoints] = useState([]);
  // floorplan and its onclick
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [clickedPoint, setClickedPoint] = useState();
  const [clickedPointElderly, setClickedPointElderly] = useState();
  // checkbox
  const [showBedPoints, setShowBedPoints] = useState(true);
  // form
  const [floor, setFloor] = useState(1);
  const [requiredError, setRequiredError] = useState(false);

  const { submit, error } = useSubmit();
  const { open, setOpen, handleClose } = useAlert();

  useEffect(() => {
    const fetchFacility = async () => {
      const resp = await fetch("/api/management/facility");
      const respData = await resp.json();

      if (resp.ok) {
        const roomData = respData.filter(
          (item) =>
            !isNaN(item.roomNumber) || typeof item.roomNumber === "undefined"
        );
        const bedData = respData.filter(
          (item) =>
            typeof item.roomNumber === "string" && isNaN(item.roomNumber)
        );
        setRoomPoints(roomData);
        setBedPoints(bedData);
        setFilteredBedPoints(
          bedData.filter((data) => data.roomFloor === floor)
        );
        setFilteredRoomPoints(
          roomData.filter((data) => data.roomFloor === floor)
        );
      }
    };
    fetchFacility();
  }, [open, floor]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleShow = () => {
    setShowBedPoints(!showBedPoints);
  };

  const handlePointClick = (pt) => {
    setRequiredError(false);
    setClickedPoint(pt);

    if (bedPoints.includes(pt) && pt.bedInUse === true) {
      fetchBedResidentData(pt);
    }
  };

  const fetchBedResidentData = async (pt) => {
    const { roomName, roomNumber } = pt;
    const resp = await fetch(
      `/api/management/residents?room=${roomName}&bed=${roomNumber}`
    );
    const respData = await resp.json();

    if (resp.ok) {
      setClickedPointElderly(...respData);
    }
  };

  const checkUndefined = (rn) => {
    if (rn === undefined) return "";
    return rn;
  };

  const handleActive = (pt, e) => {
    setClickedPoint({ ...pt, active: e.target.value });
  };

  const handleFloor = (e) => {
    setFloor(e.target.value);
  };

  const handleReason = (pt, value) => {
    setClickedPoint({ ...pt, disableReason: value });
  };

  const handleSave = async () => {
    if (!clickedPoint.active && !clickedPoint.disableReason) {
      setRequiredError(true);
    } else {
      await submit(
        "/api/management/facility/" + clickedPoint._id,
        clickedPoint,
        "PATCH"
      );
      setOpen(true);
      setRequiredError(false);
    }
  };

  const { OverviewHeader } = PageOverviewHeader();

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
      {/* Floor plan */}

      <Stack sx={{ mt: 3, mr: 5, mb: 4.5 }}>
        <OverviewHeader title="Room status" />
      </Stack>

      <Stack sx={{ ml: 5 }}>
        <Grid container direction={"row"}>
          <Grid item sx={{ mr: 5 }}>
            <img
              style={{ width: 1000, height: 600, position: "relative" }}
              src={Floorplan}
              alt="Floorplan"
              onLoad={handleImageLoad}
            />

            {isImageLoaded &&
              filteredRoomPoints.map((pt, idx) => (
                <Tooltip
                  title={`${pt.roomFloor}/F ${pt.roomName} ${checkUndefined(
                    pt.roomNumber
                  )}`}
                  placement="top"
                  key={`${pt.floor}/F ${pt.roomName} ${checkUndefined(
                    pt.roomNumber
                  )} `}
                >
                  <IconButton
                    disableRipple
                    onClick={() => handlePointClick(pt)}
                    sx={{
                      position: "absolute",
                      left: openDrawer === true ? pt.x + drawerWidth : pt.x,
                      top: pt.y,
                      color: pt.active === true ? "#26a69a" : "#ef5350",
                    }}
                  >
                    {pt.active === true ? (
                      <CheckCircleIcon
                        fontSize="large"
                        sx={{ "&:hover": { fontSize: "45px" } }}
                      />
                    ) : (
                      <CancelIcon
                        fontSize="large"
                        sx={{ "&:hover": { fontSize: "45px" } }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              ))}

            {isImageLoaded &&
              showBedPoints &&
              filteredBedPoints.map((pt, idx) => (
                <Grow key={idx} in={showBedPoints}>
                  {
                    <Avatar
                      key={idx}
                      onClick={() => handlePointClick(pt)}
                      sx={{
                        position: "absolute",
                        left: openDrawer === true ? pt.x + drawerWidth : pt.x,
                        top: pt.y,
                        width: 30,
                        height: 30,
                        bgcolor: pt.active ? pt.bedInUse && "green" : "red",
                        "&:hover": {
                          width: 40,
                          height: 40,
                          left:
                            openDrawer === true
                              ? pt.x + drawerWidth - 10
                              : pt.x - 10,
                          top: pt.y - 10,
                        },
                      }}
                    >
                      <IconButton>
                        <Typography variant="subtitle2" color="black">
                          {`${pt.roomName}${checkUndefined(pt.roomNumber)}`}
                        </Typography>
                      </IconButton>
                    </Avatar>
                  }
                </Grow>
              ))}
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item sx={{ ml: 5, mb: 3, mr: 5 }} flexGrow={1}>
            <Stack mb={3}>
              <Typography>Options</Typography>
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
              <FormControlLabel
                label="Bed Details"
                control={
                  <Checkbox checked={showBedPoints} onChange={handleShow} />
                }
              />
            </Stack>

            {clickedPoint ? (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={1}
                >{`Selected Room: ${clickedPoint.roomFloor}/F ${
                  clickedPoint.roomName
                } ${checkUndefined(clickedPoint.roomNumber)}
                  `}</Typography>

                {/* Active */}
                <Stack gap={4}>
                  <Paper sx={{ p: 2 }}>
                    <Stack direction="row" alignItems={"center"} mb={1}>
                      {clickedPoint.active === true ? (
                        <CheckCircleIcon sx={{ color: "#26a69a" }} />
                      ) : (
                        <CancelIcon sx={{ color: "#ef5350" }} />
                      )}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", ml: 1 }}
                      >
                        Active
                      </Typography>
                    </Stack>

                    <Controls.Selection
                      name="active"
                      label="Active"
                      value={clickedPoint.active}
                      inputLabelName="Active"
                      items={[
                        { name: "active", value: true, label: "Yes" },
                        { name: "active", value: false, label: "No" },
                      ]}
                      onChange={(e) => handleActive(clickedPoint, e)}
                    />
                    {clickedPoint.active === false && (
                      <Stack>
                        <Controls.OutlinedInput
                          error={requiredError}
                          name="disableReason"
                          label="Reason"
                          variant="standard"
                          value={clickedPoint.disableReason || ""}
                          onChange={(e) =>
                            handleReason(clickedPoint, e.target.value)
                          }
                          helperText={
                            requiredError &&
                            "The reason to unactive is required"
                          }
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack sx={{ p: 1 }}>
                            <Typography>Unactive Period</Typography>

                            <Controls.DateTime
                              label="Start Time"
                              value={parseISO(clickedPoint.disableStart)}
                              onChange={(newValue) => {
                                setClickedPoint({
                                  ...clickedPoint,
                                  disableStart: newValue,
                                });
                              }}
                            />

                            <Typography sx={{ m: "auto", my: 1 }}>
                              to
                            </Typography>

                            <Controls.DateTime
                              label="End Time"
                              value={parseISO(clickedPoint.disableEnd)}
                              onChange={(newValue) => {
                                setClickedPoint({
                                  ...clickedPoint,
                                  disableEnd: newValue,
                                });
                              }}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </Stack>
                    )}
                    <Controls.Buttons
                      text="Save changes"
                      onClick={handleSave}
                    />
                  </Paper>

                  {/* Assign bed/room */}
                  <Paper sx={{ p: 2 }}>
                    {roomPoints.some((p) => p._id === clickedPoint._id) ? (
                      // RoomPoints
                      <>
                        <Stack direction="row" alignItems={"center"}>
                          {clickedPoint.allowBook && clickedPoint.active ? (
                            <CheckCircleIcon sx={{ color: "#26a69a" }} />
                          ) : (
                            <CancelIcon sx={{ color: "#ef5350" }} />
                          )}

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", ml: 1 }}
                          >
                            Allow room booking
                          </Typography>
                        </Stack>

                        {/* RoomPoints allowBook and active */}
                        {clickedPoint.allowBook && clickedPoint.active ? (
                          <Typography variant="subtitle2">
                            Please proceed to Activity Management for room
                            reservation
                          </Typography>
                        ) : // Room points booked and active
                        clickedPoint.active ? (
                          <Stack>
                            <Typography variant="subtitle2">
                              Activity
                            </Typography>

                            <Typography>Involved caregivers</Typography>
                            <AvatarGroup total={10}>
                              <Avatar
                                alt="Remy Sharp"
                                src="https://mui.com/static/images/avatar/1.jpg"
                              />
                              <Avatar
                                alt="Travis Howard"
                                src="https://mui.com/static/images/avatar/2.jpg"
                              />
                              <Avatar
                                alt="Agnes Walker"
                                src="https://mui.com/static/images/avatar/4.jpg"
                              />
                              <Avatar
                                alt="Trevor Henderson"
                                src="https://mui.com/static/images/avatar/5.jpg"
                              />
                            </AvatarGroup>

                            <Typography>Involved residents</Typography>
                            <AvatarGroup total={50}>
                              <Avatar alt="Remy Sharp" src={MaleElderly} />
                              <Avatar alt="Travis Howard" src={MaleElderly} />
                              <Avatar alt="Agnes Walker" src={FemaleElderly} />
                              <Avatar
                                alt="Trevor Henderson"
                                src={MaleElderly}
                              />
                            </AvatarGroup>
                          </Stack>
                        ) : (
                          // Room points not active
                          <Typography
                            variant="subtitle2"
                            fontStyle={"italic"}
                            color="#808191"
                          >
                            Reason: Status unactive
                          </Typography>
                        )}
                      </>
                    ) : // Bed points
                    // Active and inuse
                    clickedPoint.bedInUse && clickedPoint.active ? (
                      <>
                        <Stack direction="row" alignItems={"center"}>
                          <BedOutlinedIcon sx={{ color: "#26a69a" }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", ml: 1 }}
                          >
                            Bed has been assigned to elderly
                          </Typography>
                        </Stack>
                        {clickedPointElderly && (
                          <>
                            <Typography
                              variant="subtitle2"
                              fontStyle={"italic"}
                              color="#808191"
                            >
                              {`Room: ${clickedPoint.roomName}, Bed: ${clickedPoint.roomNumber}`}
                            </Typography>
                            <Stack my={1} gap={0.2}>
                              <Typography>
                                {`Resident ID: ${clickedPointElderly.residentID}`}
                              </Typography>
                              <Typography>{`Name: ${clickedPointElderly.lastName}, ${clickedPointElderly.firstName}`}</Typography>
                              <Typography>{`Gender: ${clickedPointElderly.sex}`}</Typography>
                            </Stack>
                            <Typography variant="subtitle2">
                              Please refer to Residents Management for detailed
                              information
                            </Typography>
                          </>
                        )}
                      </>
                    ) : clickedPoint.active ? (
                      // Not in use and active
                      <>
                        <Stack direction="row" alignItems={"center"}>
                          <BedOutlinedIcon sx={{ color: "#26a69a" }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", ml: 1 }}
                          >
                            Bed can be assigned
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">
                          Please proceed to Residents Management for assigning
                          bed
                        </Typography>
                      </>
                    ) : (
                      // Not active
                      <>
                        <Stack direction="row" alignItems={"center"}>
                          <CancelIcon sx={{ color: "#ef5350" }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", ml: 1 }}
                          >
                            Bed cannot be assigned
                          </Typography>
                        </Stack>
                        <Typography
                          variant="subtitle2"
                          fontStyle={"italic"}
                          color="#808191"
                        >
                          Reason: Status unactive
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Stack>
              </>
            ) : (
              // No point is clicked
              //<Box sx={{ p: 10, mt: 2, border: "2px dashed #2c387e" }}>
              <Stack sx={{ alignItems: "center", p: 10 }}>
                <Icon>
                  <ErrorOutlineIcon />
                </Icon>
                <Typography sx={{ mt: 1 }}>
                  Click on a room to view its status
                </Typography>
              </Stack>
              //</Box>
            )}
          </Grid>
        </Grid>
      </Stack>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={"Update successfully"}
      />
    </>
  );

  // <Grid container spacing={2}>
  //     <Grid item>
  //       {!editRoom && <Button onClick={handleStartClick}>Start</Button> }
  //       {editRoom && <Button onClick={handleFinishClick}>Finish</Button> }
  //     </Grid>
  //     <Grid item>
  //       <div onClick={handleClickOnImage}>
  //         <img
  //           style={{ width: 1000, height: 600 }}
  //           src={Floorplan}
  //           alt="Floorplan"
  //           size="100"
  //         />
  //         {editRoom && plotCoordinates.map((plot, index) => (
  //           <Avatar key={index} sx={{position: 'absolute', width: 30, height: 30, top: plot.y -14, left: plot.x-15}}>
  //             A
  //           </Avatar>
  //         ))}

  //       </div>
  //     </Grid>
  //   </Grid>
};

export default ManagementFacility;
