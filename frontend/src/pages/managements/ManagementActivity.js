import { Paper, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import ActivityScheduler from "../../components/managements/ActivityScheduler";
import ActivityTable from "../../components/managements/ActivityTable";


const ManagementActivity = () => {
  const [activityData, setActivityData] = useState();

  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchActivity = async () => {
    const resp = await fetch("/api/management/activity");
    const respData = await resp.json();

    if (resp.ok) {
      setActivityData(respData);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <>
      <PageHeader
        title="Activity Management"
        subtitle="View activity records or manage activity status"
        icon={
          <DirectionsRunIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
      <Paper sx={{ borderRadius: "10px" }}>
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
              <Tab label="Assign activity" value="1" />
              <Tab label="Activity Overview" value="2" />
            </TabList>

            <TabPanel value="1">
              {activityData && <ActivityScheduler data={activityData} fetch={fetchActivity}/>}
            </TabPanel>
            <TabPanel value="2">
              {activityData && <ActivityTable data={activityData} fetch={fetchActivity}/>}
            </TabPanel>

          </TabContext>
        </Box>
      </Paper>
    </>
  );
};

export default ManagementActivity;
