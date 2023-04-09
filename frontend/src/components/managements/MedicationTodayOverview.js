import { Divider, Grid, Stack, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Controls } from "../controls/Controls";

import { useEffect, useState } from "react";

const MedicationTodayOverview = ({ eld }) => {
  const today = new Date();

  const [shiftA, setShiftA] = useState([]);
  const [shiftP, setShiftP] = useState([]);
  const [shiftN, setShiftN] = useState([]);

  const [completedMedication, setCompletedMedication] = useState();

  const fetchTodayMed = async () => {
    const resp = await fetch(
      "/api/management/medication/todaymedicationrecords"
    );
    const respData = await resp.json();

    if (resp.ok) {
      const result = groupCompletedMedication(respData);
      setCompletedMedication(result);
    }
  };

  const groupCompletedMedication = (data) => {
    const result = data.reduce((acc, item) => {
      const medicationComplete = item.medicationComplete.map((rec) => {
        const record = { id: rec.id, shift: rec.shift };
        return record;
      });
      return [...acc, ...medicationComplete];
    }, []);
    return result;
  };

  function checkCompleted(id, shift) {

      const result =
        completedMedication.length > 0 &&
        completedMedication.some(
          (item) => item.id === id && item.shift === shift
        );
      return result;
 
  }

  const groupMedByShift = (data) => {
    const newShiftA = [];
    const newShiftP = [];
    const newShiftN = [];

    data.forEach((item) => {
      item.defaultMedicationItems &&
        item.defaultMedicationItems.forEach((shift) => {
          if (shift.A) {
            if (completedMedication && checkCompleted(item.residentID, "A")) {
              newShiftA.push({
                id: item.residentID,
                medicine: [...shift.A],
                status: true,
              });
            } else {
              newShiftA.push({ id: item.residentID, medicine: [...shift.A] });
            }
          }
          if (shift.P) {
            if (completedMedication && checkCompleted(item.residentID, "P")) {
              newShiftP.push({
                id: item.residentID,
                medicine: [...shift.P],
                status: true,
              });
            } else {
              newShiftP.push({ id: item.residentID, medicine: [...shift.P] });
            }
          }
          if (shift.N) {
            if (completedMedication && checkCompleted(item.residentID, "N")) {
              newShiftN.push({
                id: item.residentID,
                medicine: [...shift.N],
                status: true,
              });
            } else {
              newShiftN.push({ id: item.residentID, medicine: [...shift.N] });
            }
          }
        });
    });

    setShiftA(newShiftA);
    setShiftP(newShiftP);
    setShiftN(newShiftN);
  };

  const CustomShiftTable = ({ shift, title }) => {
    function getDate() {
      return `${today.getFullYear()}/${
        today.getMonth() + 1
      }/${today.getDate()}`;
    }

    return (
      <Grid item xs md>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Controls.TodayBox justifyContent={"center"}>
              <Controls.Bold variant="h5">{`${getDate()} - ${title}`}</Controls.Bold>
            </Controls.TodayBox>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item md={4}>
            <Controls.TodayBox pb={2.3} justifyContent={"center"}>
              <Controls.Bold >Elderly Info</Controls.Bold>
            </Controls.TodayBox>
          </Grid>
          <Grid item md={5}>
            <Controls.TodayBox pb={2.3} justifyContent={"center"}>
              <Controls.Bold >Medication List</Controls.Bold>
            </Controls.TodayBox>
          </Grid>
          <Grid item md>
            <Controls.TodayBox pb={2.3} justifyContent={"center"}>
              <Controls.Bold>Completed</Controls.Bold>
            </Controls.TodayBox>
          </Grid>
        </Grid>

        {shift.map((item, idx) => (
          <Grid container key={`${title}-${idx}`}>
            <Grid item xs md={4}>
              <Controls.TodayBox>{item.id}</Controls.TodayBox>
            </Grid>
            <Grid item xs md={5}>
              <Controls.TodayBox>
                <Stack>
                  {item.medicine.map((med) => (
                    <li key={med}>{med}</li>
                  ))}
                </Stack>
              </Controls.TodayBox>
            </Grid>
            <Grid item xs md>
              <Controls.TodayBox justifyContent={"center"}>
                {item.status === true && (
                  <CheckCircleIcon sx={{ fontSize: 40, color: "#26a69a" }} />
                )}
              </Controls.TodayBox>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  };

  useEffect(() => {
    fetchTodayMed();
    groupMedByShift(eld);
  }, []);

  console.log(shiftA);
  return (
    <Grid container gap={4}>
      {completedMedication && shiftA && shiftP && shiftN && (
        <>
          <CustomShiftTable shift={shiftA} title={"A"} />
          <CustomShiftTable shift={shiftP} title={"P"} />
          <CustomShiftTable shift={shiftN} title={"N"} />
        </>
      )}
    </Grid>
  );
};

export default MedicationTodayOverview;
