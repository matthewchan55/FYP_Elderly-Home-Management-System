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
  Box,
  Paper,
  AvatarGroup,
} from "@mui/material";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

  const [bedPoints, setBedPoints] = useState([]);
  const [roomPoints, setRoomPoints] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBedPoints, setShowBedPoints] = useState(false);
  const [clickedPoint, setClickedPoint] = useState();
  const [floor, setFloor] = useState(1);
  const [reason, setReason] = useState(null);
  const [requiredError, setRequiredError] = useState(false);

  const drawerWidth = 280;
  const { open: openDrawer } = useDrawerContext();
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
      }
    };
    fetchFacility();
  }, [open]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleShow = () => {
    setShowBedPoints(!showBedPoints);
  };

  const handlePointClick = (pt) => {
    setClickedPoint(pt);
  };

  const checkUndefined = (rn) => {
    if (rn === undefined) return "";
    return rn;
  };

  const changeActive = (pt, e) => {
    setClickedPoint({ ...pt, active: e.target.value });
  };

  const changeFloor = (e) => {
    setFloor(e.target.value);
  };

  const handleReason = (e) => {
    setReason((e) => e.target.value);
  };

  const handleSave = async () => {
    if (clickedPoint.active === false && reason === null) {
      setRequiredError(true);
    } else {
      const reasoned = { ...clickedPoint, disableReason: reason };
      await submit(
        "/api/management/facility/" + clickedPoint._id,
        reasoned,
        "PATCH"
      );
      setOpen(true);

      setRequiredError(false);
    }
    setReason(null);
  };

  return (
    <>
      <PageHeader
        title="Facility and Inventory Management"
        subtitle="View facility and inventory vacancy or manage rooms status"
        icon={
          <RoomPreferencesIcon
            sx={{ fontSize: 60, justifyContent: "center" }}
          />
        }
      />
      {/* Floor plan */}
      <Stack sx={{ ml: 5 }}>
        <Typography variant="h5" sx={{ flexGrow: 1, mt: 4, mr: 5, mb: 4.5 }}>
          Room status
        </Typography>

        <Grid container>
          <Grid item>
            <img
              style={{ width: 1000, height: 600, position: "relative" }}
              src={Floorplan}
              alt="Floorplan"
              onLoad={handleImageLoad}
            />

            {isImageLoaded &&
              roomPoints.map((pt, idx) => (
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
              bedPoints.map((pt, idx) => (
                <Avatar
                  key={idx}
                  onClick={() => handlePointClick(pt)}
                  sx={{
                    position: "absolute",
                    left: openDrawer === true ? pt.x + drawerWidth : pt.x,
                    top: pt.y,
                    width: 30,
                    height: 30,
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
              ))}
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item>
            <Stack sx={{ ml: 2 }}>
              <Typography>Options</Typography>
              <Controls.Selection
                name="floor"
                label="Floor"
                value={floor}
                inputLabelName="Floor"
                items={[
                  { name: "floor", value: "1", label: "1/F" },
                  { name: "floor", value: "2", label: "2/F" },
                  { name: "floor", value: "3", label: "3/F" },
                ]}
                onChange={changeFloor}
              />
              <FormControlLabel
                label="Bed Details"
                control={
                  <Checkbox checked={showBedPoints} onChange={handleShow} />
                }
              />
              {clickedPoint ? (
                <Stack gap={4}>
                  <Typography>{`Selected Room: ${clickedPoint.roomFloor}/F ${
                    clickedPoint.roomName
                  } ${checkUndefined(clickedPoint.roomNumber)}
                  `}</Typography>

                  <Paper sx={{ p: 2 }}>
                    <Stack direction="row">
                      {clickedPoint.active === true ? (
                        <CheckCircleIcon sx={{ color: "#26a69a" }} />
                      ) : (
                        <CancelIcon sx={{ color: "#ef5350" }} />
                      )}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        Active
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Controls.Selection
                        name="active"
                        label="Active"
                        value={clickedPoint.active}
                        inputLabelName="Active"
                        items={[
                          { name: "active", value: true, label: "Yes" },
                          { name: "active", value: false, label: "No" },
                        ]}
                        onChange={(e) => changeActive(clickedPoint, e)}
                      />
                      {clickedPoint.active === false && (
                        <Controls.OutlinedInput
                          error={requiredError}
                          name="disableReason"
                          label="Reason"
                          variant="standard"
                          defaultValue={clickedPoint.disableReason ? clickedPoint.disableReason: ""}
                          onChange={handleReason}
                          helperText={
                            requiredError &&
                            "The reason to unactive is required"
                          }
                        />
                      )}
                    </Stack>
                    <Controls.Buttons
                      text="Save changes"
                      onClick={handleSave}
                    />
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Stack direction="row">
                      <CheckCircleIcon sx={{ color: "#26a69a" }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Booked for use
                      </Typography>
                    </Stack>

                    <Typography variant="subtitle2">Activity</Typography>
                    <Typography variant="subtitle2">
                      Please proceed to Activity Management for room reservation
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
                      <Avatar alt="Trevor Henderson" src={MaleElderly} />
                    </AvatarGroup>
                  </Paper>
                </Stack>
              ) : (
                <Box sx={{ p: 10, mt: 2, border: "2px dashed #2c387e" }}>
                  <Stack sx={{ alignItems: "center" }}>
                    <Icon>
                      <ErrorOutlineIcon />
                    </Icon>
                    <Typography sx={{ mt: 1 }}>
                      Click on a room to view its status
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
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
  );
};

export default ManagementFacility;
