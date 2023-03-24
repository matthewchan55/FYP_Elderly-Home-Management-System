import { Grid, Divider, Stack, Typography } from "@mui/material";
import ResidentList from "./ResidentList";
import { useState, useEffect } from "react";
import ResidentCostTransfer from "./ResidentCostTransfer";
import FinanceServiceCost from "../forms/ManagementForm/FinanceServiceCost";

const ResidentCost = ({ eld }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [serviceCost, setServiceCost] = useState();
  const [selectedElderly, setSelectedElderly] = useState(eld[0]);
  const [selectedElderlyFinance, setSelectedElderlyFinance] = useState();
  const [selectedServiceCost, setSelectedServiceCost] = useState();

  const fetchServiceCost = async () => {
    const resp = await fetch("/api/management/finance/servicecost");
    const respData = await resp.json();

    if (resp.ok) {
      setServiceCost(respData);
      setSelectedServiceCost(respData[0])
    }
  };

  const fetchCurrentRas = async (id, month) => {
    const resp = await fetch(
      `/api/management/finance/ras?residentID=${id}&month=${month}`
    );
    const respData = await resp.json();

    if (resp.ok) {
      setSelectedElderlyFinance(respData[0]);
    }
  };

  useEffect(() => {
    fetchServiceCost();
    fetchCurrentRas(selectedElderly.residentID, currentDate.getMonth() + 1);
  }, []);

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

              <Divider style={{ width: "100%" }} flexItem />
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            {serviceCost && selectedElderlyFinance && (
              <ResidentCostTransfer
                total={serviceCost}
                subscribedItems={selectedElderlyFinance.itemSubscription}
                path={`/api/management/finance/ras/${selectedElderlyFinance._id}`}
                setService={setSelectedServiceCost}
              />
            )}
          </Grid>

          <Divider orientation="vertical" flexItem />
          <Grid item xs={12} md>
            {selectedServiceCost && (
              <FinanceServiceCost service={selectedServiceCost}/>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResidentCost;
