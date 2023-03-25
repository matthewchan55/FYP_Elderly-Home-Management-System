import { Grid, Divider, Stack, Typography, Box } from "@mui/material";
import ResidentList from "./ResidentList";
import { useState, useEffect } from "react";
import ResidentCostTransfer from "./ResidentCostTransfer";
import { Controls } from "../controls/Controls";

const ResidentCost = ({ eld }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedElderly, setSelectedElderly] = useState(eld[0]);
  const [selectedElderlyFinance, setSelectedElderlyFinance] = useState();

  const fetchCurrentRas = async (id, month) => {
    console.log(id, month);
    const resp = await fetch(
      // right items
      `/api/management/finance/ras?residentID=${id}&month=${month}`
    );
    const respData = await resp.json();

    if (resp.ok) {
      setSelectedElderlyFinance(respData[0]);
    } else {
      setSelectedElderlyFinance("");
    }
  };

  useEffect(() => {
    //fetchServiceCost();
    fetchCurrentRas(selectedElderly.residentID, currentDate.getMonth() + 1);
  }, [selectedElderly]);



  function getTotalCost() {
    const totalCost = selectedElderlyFinance.itemSubscription.reduce(
      (acc, obj) => acc + obj.charge,
      0
    );
    return `$${totalCost}.00`;
  }

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={2} minWidth="220px">
        <ResidentList
          data={eld}
          eld={selectedElderly}
          setEld={setSelectedElderly}
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
              {selectedElderlyFinance && (
                <Grid item md xs={12} mb={2}>
                  <Stack direction="row" gap={4}>
                    <Box
                      sx={{
                        width: "180px",
                        border: "1px solid grey",
                        borderRadius: "10px",
                        py: 3,
                        pl: 3,
                      }}
                    >
                      <Controls.Bold>Total subscribed services</Controls.Bold>
                      <Controls.Bold
                        fontSize={30}
                        mr={3}
                        textAlign="center"
                        color="#009688"
                      >
                        {selectedElderlyFinance.itemSubscription.length}
                      </Controls.Bold>
                    </Box>

                    <Box
                      sx={{
                        width: "180px",
                        border: "1px solid grey",
                        borderRadius: "10px",
                        py: 4,
                        pl: 4,
                      }}
                    >
                      <Controls.Bold>Expected cost</Controls.Bold>
                      <Controls.Bold
                        fontSize={26}
                        mr={4}
                        mt={2}
                        textAlign="center"
                        color="#009688"
                      >
                        {getTotalCost()}
                      </Controls.Bold>
                    </Box>
                  </Stack>
                </Grid>
              )}

              <Divider style={{ width: "100%" }} flexItem />
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            {selectedElderlyFinance ? (
              <ResidentCostTransfer
                subscribedItems={selectedElderlyFinance.itemSubscription}
                path={`/api/management/finance/ras/${selectedElderlyFinance._id}`}
              />
            ) : (
              <Typography>No record found</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResidentCost;
