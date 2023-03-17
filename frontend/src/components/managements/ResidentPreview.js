import {
  Typography,
  Grid,
  Stack,
  Paper,
  Box,
  Button,
} from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import DataThresholdingOutlinedIcon from "@mui/icons-material/DataThresholdingOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";

import { useState, useEffect } from "react";
import FemaleElderly from "../../assets/female_elderly.png";
import MaleElderly from "../../assets/male_elderly.png";
import Searchbar from "../Searchbar";
import { Controls } from "../controls/Controls";
import PageOverview from "../PageOverview";

export default function ResidentPreview(data, floorInfo) {
  const [clickedProfile, setClickedProfile] = useState();
  const [openClickElderlyPopup, setOpenClickElderlyPopup] = useState(false);

  const findProfile = (id) => {
    const click = data.filter((data) => data.residentID === id);
    setClickedProfile(...click);
    setOpenClickElderlyPopup(true);
  };

  const ResidentOverview = () => {
    const [floor, setFloor] = useState(null);
    const [filteredFloor, setFilteredFloor] = useState([]);

    const handleFloorOnchange = () => {
      if (floor === null || floor === "all") {
        setFilteredFloor(floorInfo);
      } else {
        const keys = Object.keys(floorInfo);
        const filteredKeys = keys.filter((k) => k.charAt(0) === floor);

        const filtered = Object.keys(floorInfo)
          .filter((key) => filteredKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = floorInfo[key];
            return obj;
          }, {});

        setFilteredFloor(filtered);
      }
      console.log(filteredFloor);
    };

    const changeFloor = (e) => {
      setFloor(e.target.value);
    };

    useEffect(() => {
      handleFloorOnchange();
    }, [floor]);

    const icon = [
      <ElderlyIcon />,
      <DataThresholdingOutlinedIcon />,
      <AssignmentTurnedInOutlinedIcon />,
      <VaccinesOutlinedIcon />,
    ];

    const title = [
      "Total active residents",
      "Incomplete resident information",
      "Finish today's routine",
      "Finish today's medication",
    ];

    const titleValue = [
      data.filter((d) => d.active === true).length,
      data.filter((d) => Object.keys(d).length < 24).length,
      data.length,
      data.length,
    ];

    return (
      <>
        {/* Preview header */}
        <PageOverview icon={icon} title={title} titleValue={titleValue} />

        {/* Preview table */}
        <Paper sx={{ p: 2 }}>
          <Stack sx={{ m: 1, width: "80%" }}>
            <Searchbar
              title={"Search elderly..."}
            />
            <Controls.Selection
              name="floor"
              label="Floor"
              defaultValue="all"
              inputLabelName="Floor"
              items={[
                { name: "floor", value: "all", label: "All Floor" },
                { name: "floor", value: "1", label: "1/F" },
                { name: "floor", value: "2", label: "2/F" },
                { name: "floor", value: "3", label: "3/F" },
              ]}
              onChange={changeFloor}
            />
          </Stack>

          {filteredFloor && (
            <Grid container spacing={3}>
              {Object.keys(filteredFloor)
                .sort()
                .map((k, index) => (
                  <Grid item md={12} xl={6} key={index}>
                    <Box
                      key={index}
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
                      {filteredFloor[k].map((info) => (
                        <Button
                          key={info}
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
      </>
    );
  };

  return {
    ResidentOverview,
    openClickElderlyPopup,
    setOpenClickElderlyPopup,
    clickedProfile,
  };
}
