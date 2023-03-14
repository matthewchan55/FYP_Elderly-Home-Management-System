import { Typography, Grid, Stack, Paper, Box, Button } from "@mui/material";
import FemaleElderly from "../../assets/female_elderly.png";
import MaleElderly from "../../assets/male_elderly.png";
import { useState } from "react";

export default function ResidentPreviewRender(data, floorInfo) {
  const [clickedProfile, setClickedProfile] = useState();
  const [openClickPopup, setOpenClickPopup] = useState(false);

  const findProfile = (id) => {
    const click = data.filter((data) => data.residentID === id);
    setClickedProfile(...click);
    setOpenClickPopup(true);
  };

  const ResidentOverview = () => {
    return (
      <Paper>
        {floorInfo && (
          <Grid container spacing={3}>
            {Object.keys(floorInfo)
              .sort()
              .map((k, index) => (
                <Grid item md={12} xl={6} key={index}>
                  <Box sx={{ backgroundColor: "#eeeeee", width: "100%" }}>
                    <Typography component={"span"} key={index}>
                      {k}
                    </Typography>
                  </Box>

                  <Stack key={k} direction="row" spacing={5} sx={{ p: 2 }}>
                    {floorInfo[k].map((info) => (
                      <Button
                        disableRipple
                        onClick={() => findProfile(info[3])}
                        sx={{
                          "&:hover": {
                            background: "none",
                          },
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
    );
  };

  return {
    ResidentOverview,
    clickedProfile,
    openClickPopup,
    setOpenClickPopup,
  };
}
