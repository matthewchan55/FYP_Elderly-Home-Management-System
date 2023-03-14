import { Typography, Grid, Stack, Paper, Box, Button } from "@mui/material";
import FemaleElderly from "../../assets/female_elderly.png";
import MaleElderly from "../../assets/male_elderly.png";
import ResidentForm from "../forms/ManagementForm/ResidentForm";
import ElderlyIcon from "@mui/icons-material/Elderly";
import DataThresholdingOutlinedIcon from "@mui/icons-material/DataThresholdingOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";

import { useState, useEffect } from "react";
import Popup from "../Popup";
import ResidentPreviewRender from "./ResidentPreviewRender";

export default function ResidentPreview(data, floorInfo) {
  //const [floorInfo, setFloorInfo] = useState([]);
  const [clickedProfile, setClickedProfile] = useState();
  const [openClickPopup, setOpenClickPopup] = useState(false);

  // const {
  //   ResidentOverview,
  //   clickedProfile,
  //   openClickPopup,
  //   setOpenClickPopup,
  // } = ResidentPreviewRender(data, floorInfo);

  const findProfile = (id) => {
    const click = data.filter((data) => data.residentID === id);
    setClickedProfile(...click);
    setOpenClickPopup(true);
  };

  // useEffect(() => {
  //   function createRoom() {
  //     const uniqueStringsSet = new Set();
  //     const roomElderly = {};

  //     for (let i = 0; i < data.length; i++) {
  //       const { floor, zone, room, bed, lastName, firstName, sex, residentID } =
  //         data[i];
  //       const roomStr = `${floor} - ${zone} - ${room}`;
  //       if (!uniqueStringsSet.has(roomStr)) {
  //         uniqueStringsSet.add(roomStr);
  //         roomElderly[roomStr] = [];
  //       }

  //       roomElderly[roomStr] = [
  //         ...roomElderly[roomStr],
  //         [bed, lastName, firstName, residentID, sex],
  //       ];
  //       roomElderly[roomStr].sort();
  //     }
  //     setFloorInfo(roomElderly);
  //   }
  //   createRoom();

  // }, [data]);

  const ResidentOverview = () => {
    return (
      <>
        {/* Preview header */}
        <Box
          id="residentchart"
          flex={1}
          display="flex"
          pl={5}
          py={2}
          pb={8}
          gap={8}
          width="90%"
        >
          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <ElderlyIcon />
            <Typography fontSize={18} color="#808191">
              Total active residents
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {data && data.filter((d) => d.active === true).length}
            </Typography>
          </Stack>

          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <DataThresholdingOutlinedIcon />
            <Typography fontSize={18} color="#808191">
              Incomplete resident information
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {data && data.filter((d) => Object.keys(d).length < 24).length}
            </Typography>
          </Stack>

          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <AssignmentTurnedInOutlinedIcon />
            <Typography fontSize={18} color="#808191">
              Finish today's routine
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {data && data.length}
            </Typography>
          </Stack>
          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <VaccinesOutlinedIcon />
            <Typography fontSize={18} color="#808191">
              Finish today's medication
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {data && data.length}
            </Typography>
          </Stack>
        </Box>

        {/* Preview table */}
        <Paper>
          {floorInfo && (
            <Grid container spacing={3}>
              {Object.keys(floorInfo)
                .sort()
                .map((k, index) => (
                  <Grid item md={12} xl={6} key={index}>
                    <Box
                      sx={{
                        backgroundColor: "#eeeeee",
                        width: "100%",
                        height: "40px",
                        textAlign: "center",
                      }}
                    >
                      <Typography component={"span"} key={index}>
                        <strong>{k}</strong>
                      </Typography>
                    </Box>

                    <Stack key={k} direction="row" spacing={5} sx={{ p: 2 }}>
                      {floorInfo[k].map((info) => (
                        <Button
                          disableRipple
                          onClick={() => findProfile(info[3])}
                          sx={{
                            "& .MuiTypography-root": {
                              textTransform: "none",
                              color: "black",
                              textAlign: "left",
                            },
                          }}
                        >
                          <Stack key={info} sx={{ maxWidth: "150px" }}>
                            <>
                              {info[info.length - 1] === "F" ? (
                                <img
                                  key={info}
                                  src={FemaleElderly}
                                  alt="Female"
                                  width="150"
                                  height="200"
                                />
                              ) : (
                                <img
                                  key={info}
                                  src={MaleElderly}
                                  alt="Male"
                                  width="150"
                                  height="200"
                                />
                              )}
                              <Stack>
                                <Typography
                                  key={info[0]}
                                >{`Bed: ${info[0]}`}</Typography>
                                <Typography
                                  key={info[1]}
                                >{`Name: ${info[1]}, ${info[2]}`}</Typography>
                              </Stack>
                            </>
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                  </Grid>
                ))}
            </Grid>
          )}
        </Paper>
        <Popup
          title="Elderly profile"
          open={openClickPopup}
          setOpen={setOpenClickPopup}
          hideBackdrop
        >
          {clickedProfile && (
            <ResidentForm
              path={"/api/management/residents/" + clickedProfile._id}
              method="PATCH"
              rowData={clickedProfile}
            />
          )}
        </Popup>
      </>
    );
  };


  return {ResidentOverview, openClickPopup}
}
