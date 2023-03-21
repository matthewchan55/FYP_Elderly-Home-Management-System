import { Grid, Divider, Typography, Stack, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import FemaleElderly2 from "../../assets/female_elderly2.png";
import MaleElderly2 from "../../assets/male_elderly2.png";
import { useState, useEffect } from "react";

const ResidentAccountSummary = () => {
  const [elderlyList, setElderlyList] = useState();
  const [selectedElderly, setSelectedElderly] = useState();

  useEffect(() => {
    const fetchElderlyList = async () => {
      const resp = await fetch("/api/management/residents");
      const respData = await resp.json();

      if (resp.ok) {
        const sortList = respData.sort((a, b) => {
          if (a.room === b.room) {
            return a.bed > b.bed ? 1 : -1;
          } else {
            return a.room > b.room ? 1 : -1;
          }
        });

        setElderlyList(sortList);
        setSelectedElderly(sortList[0]);
      }
    };
    fetchElderlyList();
  }, []);

  return (
    <Grid container direction="row">
      <Grid item xs={2} md={2} minWidth="220px">
        <Box
          sx={{
            width: 200,
            height: 250,
            p: 3,
            border: "1px solid grey",
            borderRadius: "10px",
            mx: "auto",
          }}
        >
          {/*  check out MUI Card component */}
          {selectedElderly && selectedElderly.sex === "F" ? (
            <img
              key={"f"}
              src={FemaleElderly2}
              alt="Female"
              width="150"
              height="200"
            />
          ) : (
            <img
              key={"m"}
              src={MaleElderly2}
              alt="Male"
              width="150"
              height="200"
            />
          )}
        </Box>

        {/* Elderly List */}
        <Stack maxHeight="36vh" overflow="auto">
          {elderlyList &&
            elderlyList.map((el, idx) => (
              <Button
                key={idx}
                variant="text"
                onClick={() => setSelectedElderly(el)}
                sx={{
                  "& .MuiTypography-root": {
                    textTransform: "none",
                    color: "black",
                    textAlign: "left",
                  },
                }}
              >
                <Typography>{`${el.room}-${el.bed} | ${
                  el.sex === "Not available" ? "N/A" : el.sex
                } | ${el.age} | ${el.lastName}, ${el.firstName}`}</Typography>
              </Button>
            ))}
        </Stack>
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs md p={2}>
        {selectedElderly && (
          // Header
          <>
            <Stack direction="row" mb={2} alignItems={"center"}>
              <Stack flexGrow={1} gap={1}>
                <Typography>{`Name: ${selectedElderly.lastName}, ${selectedElderly.firstName} (Resident ID: ${selectedElderly.residentID})`}</Typography>
                <Typography>{`Room: ${selectedElderly.room}, ${selectedElderly.bed}`}</Typography>
                <Typography>{`Relative Name: ${
                  selectedElderly.relativesName || ""
                } Relative Contact: ${
                  selectedElderly.relativesPhone || ""
                }`}</Typography>
              </Stack>

              <Stack direction="row" mr={4} gap={8}>
                <Box
                  sx={{
                    width: "180px",
                    border: "1px solid grey",
                    borderRadius: "10px",
                    py:3, pl:5
                  }}
                >
                  <Typography>Amount Due:</Typography>
                  <Typography>$12,345</Typography>
                </Box>
                <Box
                  sx={{
                    width: "180px",
                    border: "1px solid grey",
                    borderRadius: "10px",mx:"auto",
                    py:3, pl:8.5
                  }}
                >
                  <Typography>Paid:</Typography>
                  <CheckCircleIcon sx={{ color: "#26a69a" }} />
                </Box>
              </Stack>
            </Stack>

            <Divider flexItem />

            {/* Content */}
            <Stack direction="row" mt={2}>
              <Stack flex={"0 0 40%"} gap={4}>
                <Stack direction="row">
                  <Typography flex={"0 0 30%"}>Pay Date</Typography>
                  <Typography>23-09-2023</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography flex={"0 0 30%"}>Payer Name</Typography>
                  <Typography>Chan Tai Mna</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography flex={"0 0 30%"}>Payer Contact</Typography>
                  <Typography>23-09-2023</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography flex={"0 0 30%"}>Payer Method</Typography>
                  <Typography>23-09-2023</Typography>
                </Stack>
              </Stack>

              <Stack gap={2}>
                <Typography>Previous term balance</Typography>
                <Typography>Charges and payment for March/2023</Typography>
                <Stack direction="row" gap={8}>
                  <Typography flex={"0 0 30%"}>Description</Typography>
                  <Typography flex={"0 0 15%"}>Trans Date</Typography>
                  <Typography>Charge</Typography>
                  <Typography>Payment</Typography>
                  <Typography>Balance</Typography>
                </Stack>
                {/* Item loop here */}
                <Stack>
                  <Stack direction="row" gap={8}>
                    <Typography flex={"0 0 30%"}>Description</Typography>
                    <Typography flex={"0 0 15%"}>Trans Date</Typography>

                    <Typography>Charge</Typography>
                    <Typography>Payment</Typography>
                    <Typography>Balance</Typography>
                  </Stack>
                  <Stack direction="row" gap={8}>
                    <Typography flex={"0 0 30%"}>Description</Typography>
                    <Typography flex={"0 0 15%"}>Trans Date</Typography>

                    <Typography>Charge</Typography>
                    <Typography>Payment</Typography>
                    <Typography>Balance</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" gap={8}>
                  <Typography flex={"0 0 30%"}>Subtotal</Typography>
                  <Typography>$12,232</Typography>
                  <Typography>$12,232</Typography>
                  <Typography>$12,232</Typography>
                </Stack>
                <Stack direction="row">
                  <Typography flexGrow={1}>
                    Account balance as at today
                  </Typography>
                  <Typography>$12,323</Typography>
                </Stack>
              </Stack>
            </Stack>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ResidentAccountSummary;
