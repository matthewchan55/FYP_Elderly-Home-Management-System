import { Grid, Divider, Stack, Typography, Box } from "@mui/material";

import ResidentList from "./ResidentList";
import { useState } from "react";
import { Controls } from "../controls/Controls";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ResidentCost = ({ eld, fin }) => {
  const [selectedElderly, setSelectedElderly] = useState(eld[0]);
  const [selectedElderlyFinance, setSelectedElderlyFinance] = useState(fin[0]);

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={2} minWidth="220px">
        <ResidentList
          data={eld}
          finData={fin}
          eld={selectedElderly}
          setEld={setSelectedElderly}
          setEldFin={setSelectedElderlyFinance}
        />
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs md p={2}>
        <Grid container>
          {/* Header: Full width => info=8, box=4 (if xs => both=12)*/}
          <Grid item xs={12} alignItems="center">
            <Grid container mb={2}>
              <Grid item md={8} xs={12}>
                <Stack gap={1}>
                  <Typography>{`Name: ${selectedElderly.lastName}, ${selectedElderly.firstName} (Resident ID: ${selectedElderly.residentID})`}</Typography>
                  <Typography>{`Room: ${selectedElderly.room}, ${selectedElderly.bed}`}</Typography>
                  <Typography>{`Relative Name: ${
                    selectedElderly.relativesName || ""
                  } Relative Contact: ${
                    selectedElderly.relativesPhone || ""
                  }`}</Typography>
                </Stack>
              </Grid>

              <Grid item md xs={12} mb={2}>
                <Stack direction="row" gap={4}>
                  <Box
                    sx={{
                      width: "180px",
                      border: "1px solid grey",
                      borderRadius: "10px",
                      py: 3,
                      pl: 5,
                    }}
                  >
                    <Controls.Bold>Amount Due:</Controls.Bold>
                    <Typography>
                      .
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "180px",
                      border: "1px solid grey",
                      borderRadius: "10px",
                      py: 3,
                      pl: 9,
                    }}
                  >
                    <Controls.Bold>Paid:</Controls.Bold>
                    {selectedElderlyFinance && selectedElderlyFinance.paid ? (
                      <CheckCircleIcon sx={{ color: "#26a69a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef5350" }} />
                    )}
                  </Box>
                </Stack>
              </Grid>

              <Divider style={{ width: "100%" }} flexItem />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResidentCost;
