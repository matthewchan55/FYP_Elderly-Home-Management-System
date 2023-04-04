import VaccinesIcon from "@mui/icons-material/Vaccines";
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import { Paper, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MedicationOverview from "../../components/managements/MedicationOverview";
import MedicationMedicalAppointment from "../../components/managements/MedicationMedicalAppointment";


// confirmatino Dialog from MUI
const ManagementMedication = () => {
  const [medList, setMedList] = useState();

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

  useEffect(() => {
    fetchMed();
  }, []);

  console.log(medList)
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
              <Tab label="Medical appointment" value="2" />
              <Tab label="Residents medication management" value="3" />
              <Tab label="Medical records" value="4" />
            </TabList>

            <TabPanel value="1">
              {medList && <MedicationOverview data={medList} />}
            </TabPanel>
            <TabPanel value="2"><MedicationMedicalAppointment/></TabPanel>
            <TabPanel value="3"></TabPanel>
            <TabPanel value="4"></TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  );
};

export default ManagementMedication;
