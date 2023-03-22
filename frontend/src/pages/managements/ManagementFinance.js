import { Typography, Stack, Box, Tab, Paper } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import PageOverviewHeader from "../../components/PageOverviewHeader";
import ResidentAccountSummary from "../../components/managements/ResidentAccountSummary";
import ResidentCost from "../../components/managements/ResidentCost";

const ManagementFinance = () => {
  const { OverviewHeader } = PageOverviewHeader();
  // Fetch Data
  const [elderlyList, setElderlyList] = useState();
  const [rasList, setRasList] = useState();

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

  const fetchElderlyList = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      const sortList = sortRoomBed(respData);
      setElderlyList(sortList);
    }
  };

  const fetchRasList = async () => {
    const resp = await fetch("/api/management/finance/ras");
    const respData = await resp.json();

    if (resp.ok) {
      const sortList = sortRoomBed(respData);
      setRasList(sortList);
    }
  };

  useEffect(() => {
    fetchElderlyList();
    fetchRasList();
  }, []);

  // Tab
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <PageHeader
        title="Financial Management"
        subtitle="View resident account summary, staff payroll or manage elderly home finance"
        icon={
          <AttachMoneyIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />

      <Stack sx={{ mt: 3, mr: 5, mb: 2 }}>
        <OverviewHeader title="Financial overview" />
      </Stack>

      <Box sx={{ width: "95%", pl: 3, pt: 2 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="residents"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "capitalize",
                  fontSize: "16px",
                },
              }}
            >
              <Tab label="Statistics" value="1" />
              <Tab label="Resident account summary" value="2" />
              <Tab label="Resident cost management" value="3" />
              <Tab label="Staff payroll" value="4" />
              <Tab label="Manage inventory cost" value="5" />
              <Tab label="Manage services cost" value="6" />
            </TabList>
          </Box>

          {/* Tab Content */}
          <TabPanel value="1" sx={{ p: 0 }}>
            {/* 1. Preview */}
            {1}
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            {/* 2. Table */}
            <ResidentAccountSummary eld={elderlyList} fin={rasList}/>
          </TabPanel>
          {/* 3. Routine Record */}
          <TabPanel value="3" sx={{ p: 0 }}>
            <ResidentCost eld={elderlyList} fin={rasList}/>
          </TabPanel>
          {/* 4. Medication Record */}
          <TabPanel value="4" sx={{ p: 0 }}>
            4
          </TabPanel>
          <TabPanel value="5" sx={{ p: 0 }}>
            5
          </TabPanel>
          <TabPanel value="6" sx={{ p: 0 }}>
            6
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default ManagementFinance;
