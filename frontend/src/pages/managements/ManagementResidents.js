import {
  Stack,
  Typography,
  Box,
  Tab,
  Paper,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useGridApiRef } from "@mui/x-data-grid";
import ElderlyIcon from "@mui/icons-material/Elderly";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import { useState, useEffect } from "react";
import moment from "moment";
import PageHeader from "../../components/PageHeader";
import PageOverviewHeader from "../../components/PageOverviewHeader";
import useDataGrid from "../../hook/useDataGrid";
import TableActionButton from "../../components/TableActionButton";
import Popup from "../../components/Popup";
import EmptyResidentForm from "../../components/forms/emptyForm/EmptyResidentForm";

const ManagementResidents = () => {
  // Data
  const [resInfoData, setResInfoData] = useState(null);

  // Table
  const {
    OverviewHeader,
    openAddPopup,
    setOpenAddPopup,
    openImportPopup,
    setOpenImportPopup,
  } = PageOverviewHeader();

  const apiRef = useGridApiRef();
  const tableHeaders = [
    {
      headerName: "Resident ID",
      field: "residentID",
      flex: 1,
      minWidth: 100,
      maxWidth: 100,
      hideable: false,
      editable: false,
    },
    {
      headerName: "Last Name",
      field: "lastName",
      flex: 1,
      minWidth: 90,
      maxWidth: 120,
      hideable: false,
    },
    {
      headerName: "First Name",
      field: "firstName",
      flex: 1,
      minWidth: 90,
      maxWidth: 120,
      hideable: false,
    },
    {
      headerName: "Gender",
      field: "sex",
      type: "singleSelect",
      valueOptions: ["M", "F", "Not available"],
      flex: 1,
      minWidth: 80,
      maxWidth: 80,
      renderCell: (params) =>
        params.value === "Not available" ? "N/A" : params.value,
    },
    { headerName: "HKID", field: "HKID", minWidth: 100, maxWidth: 100 },
    {
      headerName: "Active",
      field: "active",
      type: "boolean",
      flex: 1,
      minWidth: 80,
      maxWidth: 80,
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
    },
    {
      headerName: "Relatives Name",
      field: "relativesName",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      headerName: "Relatives Phone",
      field: "relativesPhone",
      minWidth: 125,
      maxWidth: 125,
      flex: 1,
    },
    {
      headerName: "Relatives HKID",
      field: "relativesHKID",
      minWidth: 125,
      maxWidth: 125,
      flex: 1,
    },
    {
      headerName: "Relatives Address",
      field: "relativesAddress",
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: "Enrollment Date",
      field: "createdAt",
      flex: 1,
      maxWidth: 120,
      type: "date",
      valueFormatter: (params) => moment(params?.value).format("YYYY/MM/DD"),
      renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      headerName: "Last updated at",
      field: "updatedAt",
      flex: 1,
      minWidth: 130,
      maxWidth: 150,
      type: "dateTime",
      valueFormatter: (params) =>
        moment(params?.value).format("YYYY/MM/DD HH:MM"),
      renderCell: (params) =>
        moment(params.row.updatedAt).format("YYYY-MM-DD HH:MM"),
    },
    {
      headerName: "Last updated by",
      field: "updatedBy",
      flex: 1,
      minWidth: 125,
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      filterable: false,
      sortable: false,
      disableExport: true,
      renderCell: (params) => (
        <ActionButton
          row={params.row}
          editTitle="Edit elderly info"
          deleteTitle="Delete elderly info"
        />
      ),
    },
  ];

  const {
    ActionButton,
    openEditPopup,
    setOpenEditPopup,
    openDeletePopup,
    setOpenDeletePopup,
    openDeleteErrorAlert,
    setOpenDeleteErrorAlert,
    rowData,
    rowDelete,
    deleteID,
    deleteError,
  } = TableActionButton();

  useEffect(() => {
    const fetchResInfoData = async () => {
      const resp = await fetch("/api/management/residents");
      const respData = await resp.json();

      if (resp.ok) {
        setResInfoData(respData);
      }
    };
    fetchResInfoData();
  }, [openAddPopup, openEditPopup, openDeletePopup]);

  // Tab
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { CustomDataGrid } = useDataGrid(apiRef, tableHeaders, resInfoData, "_Resident Table");
  
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
            {/* Table */}
            <Paper sx={{ m: 3 }}>{resInfoData && <CustomDataGrid />}</Paper>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>

      {/* Popup */}
      <Popup
        title="Add a resident"
        open={openAddPopup}
        setOpen={setOpenAddPopup}
        hideBackdrop
      >
        <EmptyResidentForm path={"/api/management/residents"} />
      </Popup>
    </>
  );
};

export default ManagementResidents;
