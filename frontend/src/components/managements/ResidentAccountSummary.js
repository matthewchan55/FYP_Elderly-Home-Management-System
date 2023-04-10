import { Grid, Divider, Typography, Stack, Box, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";
import { Controls } from "../controls/Controls";
import { parseISO, format } from "date-fns";
import ResidentList from "./ResidentList";

const ResidentAccountSummary = ({ eld }) => {
  const [selectedElderly, setSelectedElderly] = useState(eld[0]);
  const [selectedElderlyFinance, setSelectedElderlyFinance] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateText, setDateText] = useState(formatDate(currentDate));

  const currentMonth = new Date().getMonth() + 1;

  function formatDate(date) {
    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function stringDate(date, f) {
    if(date){
      const dateFormat = f === "date" ? "dd-MM-yyyy" : "dd-MM-yyyy HH:mm";
      const dateObj = parseISO(date);
      return format(dateObj, dateFormat);
    }

    return "N/A"
  }

  function sumUpColumns(obj, field) {
    let totalCost = 0;
    console.log(obj, field)
    for (let i = 0; i < obj.length; i++) {
      totalCost += obj[i][field];
    }
    return totalCost;
  }

  function calculateBalance(a, b) {
    return parseFloat(a - b).toFixed(2);
  }

  function handlePrevClick() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setDateText(formatDate(newDate));
  }

  // Event handler for clicking the next button
  function handleNextClick() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setDateText(formatDate(newDate));
  }

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
    fetchCurrentRas(selectedElderly.residentID, currentDate.getMonth() + 1);
  }, [selectedElderly, currentDate]);

  console.log(selectedElderlyFinance)

  return (
    <Grid container direction="row">
      {/* Left: elderly list */}
      <Grid item xs={12} md={2} minWidth="220px">
        <ResidentList
          data={eld}
          eld={selectedElderly}
          setEld={setSelectedElderly}
          sorted
        />
      </Grid>

      <Divider orientation="vertical" flexItem />

      {/* Right:account summary */}
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
                      {selectedElderlyFinance
                        ? calculateBalance(
                            sumUpColumns(
                              selectedElderlyFinance.itemSubscription,
                              "charge"
                            ),
                            sumUpColumns(
                              selectedElderlyFinance.itemSubscription,
                              "payment"
                            )
                          )
                        : 0.0}
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

          {/* Content: Full width => basic info=4, account summary=8, (if xs => both=12) */}
          {selectedElderlyFinance ? (
            <>
              <Grid
                container
                direction="row"
                justifyContent={"space-between"}
                alignItems="center"
                mb={1}
              >
                <Button
                  startIcon={<ChevronLeftIcon />}
                  onClick={handlePrevClick}
                >
                  <Typography>Previous</Typography>
                </Button>

                <Controls.Bold variant="h6">{dateText}</Controls.Bold>

                <Button
                  endIcon={<ChevronRightIcon />}
                  onClick={handleNextClick}
                  disabled={currentDate.getMonth() + 1 === currentMonth}
                >
                  <Typography>Next</Typography>
                </Button>
              </Grid>

              <Grid container direction="row">
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Box bgcolor={"#009688"} height="50px">
                      <Controls.Bold variant="h6">Payment Info</Controls.Bold>
                    </Box>
                  </Grid>
                  <Divider
                    orientation="vertical"
                    color="white"
                    flexItem
                  ></Divider>
                  <Grid item xs md>
                    <Box
                      bgcolor={"#009688"}
                      height="50px"
                      display={{ xs: "none", md: "block" }}
                    >
                      <Controls.Bold variant="h6">
                        Account Summary
                      </Controls.Bold>
                    </Box>
                  </Grid>
                </Grid>

                {/* Item: basic info */}
                <Grid item xs={12} md={4}>
                  <Stack>
                    <Stack direction="row">
                      <Controls.GridBox>
                        <Controls.Bold>Deadline Pay Date</Controls.Bold>
                      </Controls.GridBox>

                      <Controls.Bold color="red">
                        {stringDate(
                          selectedElderlyFinance.deadlinePayDate,
                          "dateTime"
                        )}
                      </Controls.Bold>
                    </Stack>
                    <Stack direction="row">
                      <Controls.GridBox>
                        <Controls.Bold>Pay Date</Controls.Bold>
                      </Controls.GridBox>
                      <Typography>
                        {stringDate(selectedElderlyFinance.payDate, "dateTime")}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Controls.GridBox>
                        <Controls.Bold>Payer Name</Controls.Bold>
                      </Controls.GridBox>
                      <Typography>{`${selectedElderlyFinance.payerName} (${selectedElderlyFinance.payerRelation})`}</Typography>
                    </Stack>

                    <Stack direction="row">
                      <Controls.GridBox>
                        <Controls.Bold>Payer Contact</Controls.Bold>
                      </Controls.GridBox>

                      <Typography>
                        {selectedElderlyFinance.payerContact}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Controls.GridBox>
                        <Controls.Bold>Payment Method</Controls.Bold>
                      </Controls.GridBox>

                      <Typography>{selectedElderlyFinance.payType}</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Account summary */}
                <Grid item xs={12} md={8}>
                  <Grid container>
                    {/* Last Month account summary */}
                    <Grid container direction="row">
                      <Grid item xs={10.35} md={10.35}>
                        <Controls.GridBox bgcolor="#607d8b" py={2}>
                          <Controls.Bold>Previous term balance</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox textAlign="end" py={2}>
                          <Typography>0.00</Typography>
                        </Controls.GridBox>
                      </Grid>
                    </Grid>

                    {/* Account summary title */}
                    <Grid item xs={12} md={12}>
                      <Controls.GridBox py={2}>
                        <Typography fontWeight="bold">
                          {`Charges and payment for ${dateText.replace(
                            / /g,
                            "/"
                          )}`}
                        </Typography>
                      </Controls.GridBox>
                    </Grid>

                    {/* Headers */}
                    <Grid container direction="row">
                      <Grid item xs={5} md={5}>
                        <Controls.GridBox bgcolor=" #607d8b" height="30px">
                          <Controls.Bold>Description</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox bgcolor=" #607d8b" height="30px">
                          <Controls.Bold>Trans Date</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox bgcolor=" #607d8b" height="30px">
                          <Controls.Bold>Charge</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox bgcolor=" #607d8b" height="30px">
                          <Controls.Bold>Payment</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox bgcolor=" #607d8b" height="30px">
                          <Controls.Bold>Balance</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                    </Grid>

                    {/* Item loop here */}
                    <Grid container>
                      {selectedElderlyFinance.itemSubscription.map(
                        (item, idx) => (
                          <Grid container diretion="row" key={idx}>
                            <Grid item xs={5} md={5}>
                              <Typography>{item.item}</Typography>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <Typography>
                                {stringDate(
                                  selectedElderlyFinance.transDate,
                                  "date"
                                )}
                              </Typography>
                            </Grid>
                            <Grid item xs md>
                              <Typography>{item.charge}</Typography>
                            </Grid>
                            <Grid item xs md>
                              <Typography>{item.payment}</Typography>
                            </Grid>
                            <Grid item xs md>
                              <Typography></Typography>
                            </Grid>
                          </Grid>
                        )
                      )}
                    </Grid>

                    {/* Total */}
                    <Grid container direction="row">
                      <Grid item xs={7} md={7}>
                        <Controls.GridBox py={2}>
                          <Controls.Bold>Subtotal</Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox py={2}>
                          <Typography>
                            {sumUpColumns(
                              selectedElderlyFinance.itemSubscription,
                              "charge"
                            )}
                          </Typography>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox py={2}>
                          <Typography>
                            {sumUpColumns(
                              selectedElderlyFinance.itemSubscription,
                              "payment"
                            )}
                          </Typography>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox py={2} textAlign="end">
                          <Typography>
                            {calculateBalance(
                              sumUpColumns(
                                selectedElderlyFinance.itemSubscription,
                                "charge"
                              ),
                              sumUpColumns(
                                selectedElderlyFinance.itemSubscription,
                                "payment"
                              )
                            )}
                          </Typography>
                        </Controls.GridBox>
                      </Grid>
                    </Grid>

                    <Grid container direction="row">
                      <Grid item xs={10.33} md={10.33}>
                        <Controls.GridBox py={2}>
                          <Controls.Bold>
                            Account balance as at today
                          </Controls.Bold>
                        </Controls.GridBox>
                      </Grid>
                      <Grid item xs md>
                        <Controls.GridBox textAlign="end" py={2}>
                          <Typography>
                            {calculateBalance(
                              sumUpColumns(
                                selectedElderlyFinance.itemSubscription,
                                "charge"
                              ),
                              sumUpColumns(
                                selectedElderlyFinance.itemSubscription,
                                "payment"
                              )
                            )}
                          </Typography>
                        </Controls.GridBox>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography> No record is found</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResidentAccountSummary;
