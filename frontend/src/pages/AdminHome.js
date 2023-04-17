import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controls } from "../components/controls/Controls";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import SegmentIcon from "@mui/icons-material/Segment";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const Home = () => {
  const colorSelected = "#FFFFFF";
  const colorUnselected = "#000000";
  const bgSelected = "#808191";
  const bgUnselected = "#FFFFFF";

  const [selectedChip, setSelectedChip] = useState(0);

  const handleChipClick = (index) => {
    setSelectedChip(index);
  };

  const getChipColor = (index) => {
    return index === selectedChip ? colorSelected : colorUnselected;
  };

  const getChipBGColor = (index) => {
    return index === selectedChip ? bgSelected : bgUnselected;
  };

  const getAbbvDate = () => {
    const today = new Date();
    const short = today.toLocaleString("en-us", { weekday: "short" });

    const month = today.toLocaleString("en-us", { month: "short" });
    const day = today.getDate();

    return `${short}, ${month} ${day}`;
  };

  const today = new Date();
  const getDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const getTime = (isodate) => {
    return new Date(isodate).toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [todayMA, setTodayMA] = useState();
  const [todayAct, setTodayAct] = useState();
  const [res, setRes] = useState();
  const [completedRoutineNum, setCompletedRoutineNum] = useState();
  const [completedMedNum, setCompletedMedNum] = useState();

  const [todayMAcg, setTodayMAcg] = useState();
  const [tmrMAcg, setTmrMAcg] = useState();

  const fetchMA = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      const result = respData.filter(
        (item) => item.medicalAppointmentInfo.length > 0
      );
      const todayma = result.reduce((acc, item) => {
        const maToday = item.medicalAppointmentInfo.filter(
          (ma) => ma.start.slice(0, 10) === getDate()
        );
        const maTodayWithNames = maToday.map((ma) => {
          return {
            ...ma,
            lastName: item.lastName,
            firstName: item.firstName,
          };
        });
        return acc.concat(maTodayWithNames);
      }, []);
      const sortedTodayMA = todayma.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );
      setTodayMA(sortedTodayMA);
    }
  };

  const fetchAct = async () => {
    const resp = await fetch("/api/management/activity");
    const respData = await resp.json();

    if (respData) {
      const todaySingle = respData.filter(
        (d) => d.startDate.slice(0, 10) === getDate()
      );
      const todayRecur = respData.filter(
        (d) =>
          d.scheduledOn === today.getDay() &&
          d.startDate <= getDate() &&
          getDate() <= d.endDate
      );
      //console.log(todaySingle.concat(todayRecur))
      setTodayAct(todaySingle.concat(todayRecur));
    }
  };

  const fetchRes = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      setRes(respData);

      const residentRoutineCount = respData.reduce(
        (acc, { todayResidentRoutine }) => {
          if (todayResidentRoutine) {
            acc++;
          }
          return acc;
        },
        0
      );
      setCompletedRoutineNum(residentRoutineCount);
      const medicationRoutineCount = respData.reduce(
        (acc, { todayMedicationRoutine }) => {
          if (todayMedicationRoutine) {
            acc++;
          }
          return acc;
        },
        0
      );
      setCompletedMedNum(medicationRoutineCount);
    }

  };

  const customRoutineList = (title, all, data) => {
    return (
      <>
        {console.log(title, data)}
        <Stack direction="row">
          <Box width="3px" height="25px" bgcolor="#607d8b" mr={2} />
          <Controls.Bold variant="h6">{title}</Controls.Bold>
        </Stack>
        <Divider width="60%" sx={{ my: 2 }} />
        <Stack direction="row" width={"90%"} gap={2}>
          <Stack alignItems={"center"}>
            <Controls.Bold>Total:</Controls.Bold>
            <Typography variant="h4">{all}</Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack alignItems={"center"}>
            <Controls.Bold>Completed:</Controls.Bold>
            <Typography variant="h4">{data}</Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack alignItems={"center"}>
            <Controls.Bold>Not complete:</Controls.Bold>
            <Typography variant="h4">{all - data}</Typography>
          </Stack>
        </Stack>
      </>
    );
  };

  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-fyp-scujj",
    showAttribution: false,
  });
  const presentChart = sdk.createChart({
    chartId: "6434c51e-fab7-458a-8ef2-884a3439e1b6",
  });
  const assignChart = sdk.createChart({
    chartId: "6434d043-5a35-42f5-86b7-197cfb739891",
  });

  useEffect(() => {
    fetchMA();
    fetchAct();
    fetchRes();
    presentChart.render(document.getElementById("present-data"));
    assignChart.render(document.getElementById("assign-data"));
  }, []);

  return (
    <>
      {/* date abd  */}
      <Grid container bgcolor={"#cfd8dc"} gap={10}>
        <Grid container justifyContent={"space-around"} mt={3}>
          <Controls.Bold variant="h5" color="#808191">
            {getAbbvDate()}
          </Controls.Bold>
          <Stack direction="row" gap={3}>
            {["Overview", "Planner", "Notification"].map((chip, index) => (
              <Chip
                key={index}
                label={chip}
                onClick={() => handleChipClick(index)}
                style={{
                  color: getChipColor(index),
                  backgroundColor: getChipBGColor(index),
                }}
              />
            ))}
          </Stack>
        </Grid>
        <Grid container display="flex" mx={8} mb={4}>
          <Grid item md>
            <Stack direction="row">
              <Box width="3px" height="25px" bgcolor="#ff8a65" mr={2} />
              <Controls.Bold variant="h6">
                Today's medical appointment
              </Controls.Bold>
            </Stack>
            <Divider width="60%" sx={{ my: 2 }} />
            <Stack direction="row" width={"80%"}>
              <Stack alignItems={"center"}>
                <Controls.Bold>Total:</Controls.Bold>
                <Typography variant="h4">
                  {todayMA && todayMA.length}
                </Typography>
              </Stack>
              <Divider orientation="vertical" sx={{ mx: 3 }} flexItem />

              <Stack>
                {todayMA && todayMA.length > 0 ? (
                  todayMA.map((ma) => (
                    <li>
                      {`${ma.start.slice(11, 16)}  ${ma.lastName}, ${
                        ma.firstName
                      } `}
                      {`- ${ma.place} (${ma.subject})`}
                    </li>
                  ))
                ) : (
                  <Typography>No medical appointment today</Typography>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item md>
            <Stack direction="row">
              <Box width="3px" height="25px" bgcolor="#ffe082" mr={2} />
              <Controls.Bold variant="h6">Today's activities</Controls.Bold>
            </Stack>
            <Divider width="60%" sx={{ my: 2 }} />
            <Stack direction="row" width={"80%"}>
              <Stack alignItems={"center"}>
                <Controls.Bold>Total:</Controls.Bold>
                <Typography variant="h4">
                  {todayAct && todayAct.length}
                </Typography>
              </Stack>
              <Divider orientation="vertical" sx={{ mx: 3 }} flexItem />
              <Stack>
                {todayAct && todayAct.length > 0 ? (
                  todayAct.map((act) => (
                    <li>
                      {`${
                        act.scheduledOn
                          ? getTime(act.scheduledStartTime)
                          : getTime(act.startDate)
                      } ${act.activityName}`}
                      <Stack direction="row" gap={3} mx={1} my={1}>
                        <Stack alignItems={"center"}>
                          <Typography color="#808191">
                            {`Involved staff:`}
                          </Typography>
                          <Typography variant="h6">
                            {act.activityInvolvedStaff.length}
                          </Typography>
                        </Stack>
                        <Stack alignItems={"center"}>
                          <Typography color="#808191">
                            {`Involved elderly:`}
                          </Typography>
                          <Typography variant="h6">
                            {act.activityInvolvedEld.length}
                          </Typography>
                        </Stack>
                      </Stack>
                    </li>
                  ))
                ) : (
                  <Typography>No activity today</Typography>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item md>
            {res &&
              completedRoutineNum !== undefined &&
              customRoutineList(
                "Today's Routines Completed",
                res.length,
                completedRoutineNum
              )}
          </Grid>
          <Grid item md>
            {res &&
              completedMedNum !== undefined &&
              customRoutineList(
                "Today's Medication Completed",
                res.length,
                completedMedNum
              )}
          </Grid>
        </Grid>
      </Grid>

      <Grid container mt={6} height="400px">
        <Grid item md={5}>
          <Stack direction="row" ml={5}>
            <div id="present-data" style={{ width: 360, height: 400 }}></div>
            <div id="assign-data" style={{ width: 360, height: 400 }}></div>
          </Stack>
        </Grid>
        <Grid item md={4} ml={5}>
          <Stack direction="row" alignItems={"center"}>
            <Controls.Bold flexGrow={1} variant="h5" my={3}>
              Away Staff
            </Controls.Bold>
            <SegmentIcon />
          </Stack>

          <Stack gap={5}>
            <Stack>
              <Controls.Bold>Today</Controls.Bold>
              <Divider />
              <Avatar
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            </Stack>
            <Stack>
              <Controls.Bold>Tomorrow</Controls.Bold>
              <Divider />
              <Stack direction="row">
                <Avatar
                  alt="Remy Sharp"
                  src="https://mui.com/static/images/avatar/1.jpg"
                />
                <Avatar
                  alt="Travis Howard"
                  src="https://mui.com/static/images/avatar/2.jpg"
                />
                <Avatar
                  alt="Trevor Henderson"
                  src="https://mui.com/static/images/avatar/5.jpg"
                />
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Divider orientation="vertical" height="100%" sx={{ mx: 5 }} flexItem />
        <Grid item md>
          <Controls.Bold variant="h5" my={3}>
            Notes
          </Controls.Bold>
          <Stack mt={10} alignItems={"center"}>
            <ControlPointIcon sx={{ fontSize: 40 }} />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
