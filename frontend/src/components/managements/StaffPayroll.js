import { Typography, Grid, Divider, Stack } from "@mui/material";
import StaffList from "./StaffList";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Controls } from "../controls/Controls";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StaffPayroll = () => {
  const [staffList, setStaffList] = useState();
  const [selectedStaff, setSelectedStaff] = useState();

  const fetchStaff = async () => {
    const resp = await fetch("/api/management/staff");
    const respData = await resp.json();

    if (resp.ok) {
      setStaffList(respData);
      setSelectedStaff(respData[0]);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={2}>
        <StaffList
          data={staffList}
          selected={selectedStaff}
          setSelected={setSelectedStaff}
        />
      </Grid>
      <Divider orientation="vertical" flexItem />

      {selectedStaff && (
        <Grid item xs={12} md alignItems="center">
          <Grid container mb={2}>
            <Grid item md={8} xs={12}>
              <Stack gap={1}>
                <Typography>{`Name: ${selectedStaff.lastName}, ${selectedStaff.firstName}`}</Typography>
                <Stack direction="row" gap={5}>
                  <Typography>{`Gender: ${selectedStaff.sex}`}</Typography>
                  <Typography>{`Staff ID: ${selectedStaff.staffID}`}</Typography>
                </Stack>

                <Stack direction="row" alignItems={"center"}>
                  <Box borderRight={"1px solid grey"}>
                    <Typography>Contact</Typography>
                  </Box>

                  <Stack ml={5}>
                    <Typography>{`Phone Num: ${selectedStaff.phoneNum}`}</Typography>
                    <Typography>{`Address: ${selectedStaff.address}`}</Typography>
                    <Typography>{`Email: ${selectedStaff.email}`}</Typography>
                  </Stack>
                </Stack>
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
                  <Controls.Bold>Estimated salary:</Controls.Bold>
                  <Typography></Typography>
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

                  <CheckCircleIcon sx={{ color: "#26a69a" }} />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default StaffPayroll;
