import {
  Stack,
  Typography,
  Box,
  Tab,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useGridApiRef } from "@mui/x-data-grid";
import ElderlyIcon from "@mui/icons-material/Elderly";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useState, useEffect } from "react";
import moment from "moment";
import PageHeader from "../../components/PageHeader";
import PageOverviewHeader from "../../components/PageOverviewHeader";
import useDataGrid from "../../hook/useDataGrid";

const ManagementResidents = () => {
  // Data
  const [resInfoData, setResInfoData] = useState(null);

  useEffect(() => {
    const fetchResInfoData = async () => {
      const resp = await fetch("/api/management/residents");
      const respData = await resp.json();

      if (resp.ok) {
        setResInfoData(respData);
      }
    };
    fetchResInfoData();
  }, []);

  // Table
  const apiRef = useGridApiRef();
  const tableHeaders = [
    {
      headerName: "Resident ID",
      field: "residentID",
      width: "90",
      hideable: false,
      editable: false,
    },
    { headerName: "Last Name", field: "lastName", minWidth: 100, flex:1},
    { headerName: "First Name", field: "firstName", minWidth: 100, flex:1},
    {
      headerName: "Gender",
      field: "sex",
      width: "70",
      renderCell: (params) =>
        params.value === "Not available" ? "N/A" : params.value,
    },
    { headerName: "HKID", field: "HKID" },
    {
      headerName: "Relatives Name",
      field: "relativesName",
      flex: 1,
      minWidth: 125,
    },
    { headerName: "Relatives Phone", field: "relativesPhone", minWidth: 125,    flex: 1 },
    { headerName: "Relatives HKID", field: "relativesHKID", minWidth: 125,    flex: 1 },
    {
      headerName: "Relatives Address",
      field: "relativesAddress",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Active",
      field: "active",
      type: "boolean",
      width: "70",
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
    },
    {
      headerName: "Enrollment Date",
      field: "createdAt",
      width: "130",
      type: "date",
      valueFormatter: (params) => moment(params?.value).format("YYYY/MM/DD"),
      renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      headerName: "Last updated at",
      field: "updatedAt",
      width: "130",
      type: "dateTime",
      valueFormatter: (params) =>
        moment(params?.value).format("YYYY/MM/DD HH:MM"),
      renderCell: (params) =>
        moment(params.row.updatedAt).format("YYYY-MM-DD HH:MM"),
    },
    { headerName: "Last updated by", field: "updatedBy", width: "150", flex:1},
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      disableExport: true,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit user">
            <IconButton>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete user">
            <IconButton>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Tab
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const {
    OverviewHeader,
    openAddPopup,
    setOpenAddPopup,
    openImportPopup,
    setOpenImportPopup,
  } = PageOverviewHeader();

  const { CustomDataGrid } = useDataGrid(apiRef, tableHeaders, resInfoData);
  return (
    <>
      <PageHeader
        title="Residents Management"
        subtitle="View elderly profile, routine and medication records"
        icon={<ElderlyIcon sx={{ fontSize: 60, justifyContent: "center" }} />}
      />

      {/* Residents Overview */}
      <Stack sx={{ mt: 3, mr: 3 }}>
        <OverviewHeader
          title="Residents Overview"
          addButtonTitle="Add new residents"
        />
      </Stack>

      {/* Residents Tab */}
      <Box sx={{ width: "100%", typography: "body1" }}>
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
              <Tab label="Profile Overview" value="1" />
              <Tab label="Routine records" value="2" />
              <Tab label="Medication records" value="3" />
            </TabList>
          </Box>

          {/* Content */}
          <TabPanel value="1">
            <Paper sx={{ m: 3 }}>{resInfoData && <CustomDataGrid />}</Paper>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default ManagementResidents;
