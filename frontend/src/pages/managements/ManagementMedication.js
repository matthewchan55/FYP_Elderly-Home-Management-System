import VaccinesIcon from "@mui/icons-material/Vaccines";
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import { Paper, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MedicationDrugManagement from "../../components/managements/MedicationDrugManagement";
import MedicationMedicalAppointment from "../../components/managements/MedicationMedicalAppointment";
import MedicationTodayOverview from "../../components/managements/MedicationTodayOverview";

// confirmatino Dialog from MUI
const ManagementMedication = () => {
  const [medList, setMedList] = useState();
  const [eldList, setEldList] = useState();
  const [selectedEld, setSelectedEld] = useState();

  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchMed = async () => {
    const resp = await fetch("/api/management/medication");
    const respData = await resp.json();

    if (resp.ok) {
      setMedList(respData);
    }
  };

  const fetchResident = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      setEldList(respData);
      setSelectedEld(respData[0]);
    }
  };

  useEffect(() => {
    fetchMed();
    fetchResident();
  }, []);

  return (
    <>
      <PageHeader
        title="Medication Management"
        subtitle="Manage medicines or define default medicine for residents"
        icon={<VaccinesIcon sx={{ fontSize: 60, justifyContent: "center" }} />}
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
              <Tab label="Medication overview" value="1" />

              <Tab label="Medical records" value="2" />
              <Tab label="Medical appointment" value="3" />
              <Tab label="Medicine Management" value="4" />
            </TabList>

            <TabPanel value="1">
              {eldList && <MedicationTodayOverview eld={eldList} />}
            </TabPanel>

            <TabPanel value="2"></TabPanel>
            <TabPanel value="3">
              {eldList && <MedicationMedicalAppointment eld={eldList} />}
            </TabPanel>
            <TabPanel value="4">
              {medList && <MedicationDrugManagement data={medList} />}
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  );
};

export default ManagementMedication;
