import ResidentList from "./ResidentList";
import {
  Grid,
  Divider,
  Stack,
  Typography,
  Box,
  Tab,
  Paper,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useEffect } from "react";
import { Controls } from "../controls/Controls";
import ResidentDefaultRoutineItems from "./ResidentDefaultRoutineItems";

const ResidentRoutineManagement = ({ data }) => {
  // res list
  const [sortedResData, setSortedResData] = useState();
  const [unsortedResData, setUnsortedResData] = useState();
  const [selectedEld, setSelectedEld] = useState();

  const [routineData, setRoutineData] = useState();
  const [selectedRoutine, setSelectedRoutine] = useState();

  const [left, setLeft] = useState();
  const [right, setRight] = useState();

  const [tabValue, setTabValue] = useState("1");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchRoutine = async (routine) => {
    const resp = await fetch("/api/management/work/routine");
    const respData = await resp.json();

    if (resp.ok) {
      setRoutineData(respData);
      // routine info
      const leftList = respData.filter((d) => d.specialDailyBasis === true);
      setSelectedRoutine(
        routine ? respData.find((r) => r._id === routine._id) : leftList[0]
      );

      // left items
      const leftListItem = leftList.map((d) => d.routineName);
      setLeft(leftListItem);
    }
  };

  const sortResidentsAsc = (d) => {
    // for multiple select
    setUnsortedResData(d);
    // for resident list
    const copy = [...d];
    const sorted = sortRoomBed(copy);
    setSortedResData(sorted);
    setSelectedEld(sorted[0]);
    // right items (first eld)
    setRight(sorted[0].defaultRoutineItems);
  };

  function sortRoomBed(data) {
    const sortList = data.sort((a, b) => {
      if (a.room === b.room) {
        return a.bed > b.bed ? 1 : -1;
      } else {
        return a.room > b.room ? 1 : -1;
      }
    });
    return sortList;
  }

  const updateEld = (updated) => {
    setSelectedEld(updated);
  };

  const updateRoutine = (updated) => {
    setSelectedRoutine(updated);
  };

  useEffect(() => {
    sortResidentsAsc(data);
    fetchRoutine();
  }, []);

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} md={2} minWidth="220px">
          <ResidentList
            data={sortedResData}
            eld={selectedEld}
            setEld={setSelectedEld}
            sorted
          />
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs md p={2}>
          {/*  eld info */}
          <Grid container mb={2} alignItems={"center"} display={"flex"}>
            <Grid item md={7} xs={12}>
              {selectedEld && (
                <Stack gap={1}>
                  <Typography>{`Name: ${selectedEld.lastName}, ${selectedEld.firstName} (Resident ID: ${selectedEld.residentID})`}</Typography>
                  <Typography>{`Room: ${selectedEld.room}, ${selectedEld.bed}`}</Typography>
                  <Typography>{`Relative Name: ${
                    selectedEld.relativesName || ""
                  } Relative Contact: ${
                    selectedEld.relativesPhone || ""
                  }`}</Typography>
                </Stack>
              )}
            </Grid>
            <Grid item md xs={12} mb={1}>
              <Stack direction="row" gap={3}>
                <Box
                  sx={{
                    width: "225px",
                    border: "1px solid grey",
                    borderRadius: "10px",
                    py: 3,
                    pl: 3,
                  }}
                >
                  <Controls.Bold>Finish Today Routines</Controls.Bold>

                  {selectedEld && selectedEld.todayResidentRoutine ? (
                    <CheckCircleIcon sx={{ mx: 8, fontSize: 40, color: "#26a69a" }} />
                  ) : (
                    <CancelIcon sx={{  mx: 8,fontSize: 40, color: "#ef5350" }} />
                  )}
                </Box>
                <Box
                  sx={{
                    width: "225px",
                    border: "1px solid grey",
                    borderRadius: "10px",
                    py: 3,
                    pl: 3,
                  }}
                >
                  <Controls.Bold>Default Routine Items</Controls.Bold>
                  <Controls.Bold
                    fontSize={30}
                    mr={3}
                    textAlign="center"
                    color="#009688"
                  >
                    {selectedEld && selectedEld.defaultRoutineItems.length}
                  </Controls.Bold>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider flexItem />

          <Grid container>
            <TabContext value={tabValue}>
              <Box
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  display: "flex",
                  height: "50vh",
                  width: 150,
                }}
              >
                <TabList
                  orientation="vertical"
                  variant="scrollable"
                  onChange={handleTabChange}
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="residentroutine"
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "capitalize",
                      fontSize: "16px",
                    },
                  }}
                >
                  <Tab label="Today's routine items" value="1" />
                  <Tab label="Default routine items" value="2" />
                </TabList>
              </Box>

              {/* Tab Content */}
              <TabPanel value="1" sx={{ width: "88%" }}>
                {selectedEld &&
                  selectedEld.todayRoutineItems.map((item, idx) => (
                    <Paper key={idx} sx={{ p: 3, m:1 }}>
                      <Stack>
                        <Stack direction="row" alignItems="center">
                          <CheckCircleIcon
                            sx={{ fontSize: 40, color: "#26a69a" }}
                          />
                          <Controls.Bold ml={1}>{item.routineName}</Controls.Bold>
                        </Stack>
                        <Stack ml={6}>
                          {item.value &&
                            Object.entries(item.value).map(([key, value]) => (
                              <Stack key={key} direction="row">
                                <Typography>{`${key}: `}</Typography>
                                <Typography>{value}</Typography>
                              </Stack>
           
                            ))}
                          <Typography>{`Shift: ${item.shift}`}</Typography>
                          <Typography>{`Notes: ${item.notes}`}</Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
              </TabPanel>
              <TabPanel value="2" sx={{ width: "88%" }}>
                <ResidentDefaultRoutineItems
                  tabLeft={left}
                  tabRight={right}
                  selectedEld={selectedEld}
                  setSelectedEld={updateEld}
                  selectedRoutine={selectedRoutine}
                  setSelectedRoutine={updateRoutine}
                  routineData={routineData}
                  unsortedRes={unsortedResData}
                />
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ResidentRoutineManagement;
