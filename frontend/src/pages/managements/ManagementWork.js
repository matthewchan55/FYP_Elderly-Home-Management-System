import WorkIcon from "@mui/icons-material/Work";
import PageHeader from "../../components/PageHeader";
import { Paper, Box, Tab } from "@mui/material";
import { useState, useEffect } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import WorkOverviewToday from "../../components/managements/WorkOverviewToday";
import WorkRoutineDetail from "../../components/managements/WorkRoutineDetail";
import WorkOtherDetail from "../../components/managements/WorkOtherDetail";
import WorkScheduleCaregiver from "../../components/managements/WorkScheduleCaregiver";


// 1. Work overview (percentage and the TODAY's table to show how many works are done, not yet done)
// 2. Routine records  (past records and detailed ) (toElderly: true)
// 2. Work records (past records and detailed ) (toElderly: false)
// 3. schedule caregivers
// 4. schedule caregivers record

const ManagementWork = () => {
  const [records, setRecords] = useState();
  const [residentsData, setResidentsData] = useState();

  // fetch data
  const fetchTodayWork = async () => {
    const resp = await fetch("/api/management/work/todayworkrecords");
    const respData = await resp.json();

    if (resp.ok) {
      setRecords(respData);
    }
  };

  const getResidentData = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      setResidentsData(respData);
    }
  };

  useEffect(() => {
    fetchTodayWork();
    getResidentData();
  }, []);

  // Tab
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <PageHeader
        title="Work Management"
        subtitle="View work records"
        icon={<WorkIcon sx={{ fontSize: 60, justifyContent: "center" }} />}
      />
      <Paper sx={{borderRadius: "10px"}}>
        <Box sx={{ bgcolor: "background.paper" }}>
          <TabContext value={tabValue}>
            <TabList
              centered
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "capitalize",
                  fontSize: "16px",
                },
              }}
            >
              <Tab label="Today's work overview" value="1" />
              <Tab label="Detailed routine records" value="2" />
              <Tab label="Detailed other work records" value="3" />
              <Tab label="Schedule caregivers" value="4" />
            </TabList>


            <TabPanel value="1">{records && <WorkOverviewToday data={records}/>}</TabPanel>
            <TabPanel value="2">{records && <WorkRoutineDetail data={records} resData={residentsData}/>}</TabPanel>
            <TabPanel value="3">{records && <WorkOtherDetail data={records} resData={residentsData}/>}</TabPanel>
            <TabPanel value="4">{<WorkScheduleCaregiver/>}</TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  );
};

export default ManagementWork;
