import { Stack, Box, Tab, Paper } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useGridApiRef } from "@mui/x-data-grid";
import ElderlyIcon from "@mui/icons-material/Elderly";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useState, useEffect } from "react";
import moment from "moment";
import PageHeader from "../../components/PageHeader";
import PageOverviewHeader from "../../components/PageOverviewHeader";
import useDataGrid from "../../hook/useDataGrid";
import TableActionButton from "../../components/TableActionButton";
import Popup from "../../components/Popup";
import ResidentForm from "../../components/forms/ManagementForm/ResidentForm";
import ResidentPreview from "../../components/managements/ResidentPreview";
import TableDelete from "../../components/TableDelete";
import SmallAlert from "../../components/SmallAlert";

const ManagementResidents = () => {
  // Data
  const [resInfoData, setResInfoData] = useState(null);
  const [floorInfo, setFloorInfo] = useState([]);

  // Table
  const {
    OverviewHeader,
    openAddPopup,
    setOpenAddPopup,
    //openImportPopup,
    //setOpenImportPopup,
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
      headerName: "Active",
      field: "active",
      type: "boolean",
      minWidth: 60,
      maxWidth: 80,
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
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

    { headerName: "Age", field: "age", minWidth: 50, maxWidth: 50 },
    { headerName: "Height (cm)", field: "height", minWidth: 90, maxWidth: 90 },
    { headerName: "Weight (kg)", field: "weight", minWidth: 90, maxWidth: 90 },
    { headerName: "Address", field: "address", flex: 1, minWidth: 150 },
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
      minWidth: 120,
      maxWidth: 120,
      flex: 1,
    },
    {
      headerName: "Relatives HKID",
      field: "relativesHKID",
      minWidth: 120,
      maxWidth: 120,
      flex: 1,
    },
    {
      headerName: "Relatives Address",
      field: "relativesAddress",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Relatives Email",
      field: "relativesEmail",
      flex: 1,
      minWidth: 150,
    },
    { headerName: "Floor", field: "floor", minWidth: 50, maxWidth: 50 },
    { headerName: "Zone", field: "zone", minWidth: 50, maxWidth: 50 },
    { headerName: "Room", field: "room", minWidth: 60, maxWidth: 60 },
    { headerName: "Bed No.", field: "bed", minWidth: 65, maxWidth: 65 },
    {
      headerName: "Enrollment Date",
      field: "createdAt",
      flex: 1,
      minWidth: 120,
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
      minWidth: 100,
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
    rowData,
    rowDelete,
    deleteID,
  } = TableActionButton();
  const { TableDeleteDialog, open, handleClose, error } = TableDelete();

  // Tab
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // First Tab
  const {
    ResidentOverview,
    openClickElderlyPopup,
    setOpenClickElderlyPopup,
    clickedProfile,
  } = ResidentPreview(resInfoData, floorInfo);

  useEffect(() => {
    const fetchResInfoData = async () => {
      const resp = await fetch("/api/management/residents");
      const respData = await resp.json();

      if (resp.ok) {
        setResInfoData(respData);
        createRoom(respData);
      }
    };

    const createRoom = (data) => {
      const uniqueStringsSet = new Set();
      const roomElderly = {};

      for (let i = 0; i < data.length; i++) {
        const { floor, zone, room, bed, lastName, firstName, sex, residentID } =
          data[i];
        const roomStr = `${floor} - ${zone} - ${room}`;
        if (!uniqueStringsSet.has(roomStr)) {
          uniqueStringsSet.add(roomStr);
          roomElderly[roomStr] = [];
        }

        roomElderly[roomStr] = [
          ...roomElderly[roomStr],
          [bed, lastName, firstName, residentID, sex],
        ];
        roomElderly[roomStr].sort();
      }
      setFloorInfo(roomElderly);
    };

    fetchResInfoData();
  }, [openAddPopup, openEditPopup, openDeletePopup, openClickElderlyPopup]);

  // Second Tab
  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    resInfoData,
    "_Resident Table"
  );

  return (
    <>
      <PageHeader
        title="Residents Management"
        subtitle="View elderly profile, routine and medication records"
        icon={<ElderlyIcon sx={{ fontSize: 60, justifyContent: "center" }} />}
      />

      {/* Residents Overview */}
      <Stack sx={{ mt: 3, mr: 5 }}>
        <OverviewHeader
          title="Residents Overview"
          addButtonTitle="Add new residents"
        />
      </Stack>

      {/* Residents Tab */}
      <Box sx={{ width: "100%"}}>
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
              <Tab label="Resident overview" value="1" />
              <Tab label="Resident records" value="2" />
              <Tab label="Routine records" value="3" />
              <Tab label="Medication records" value="4" />
            </TabList>
          </Box>

          {/* Tab Content */}
          <TabPanel value="1" sx={{p:0}}>
            {/* 1. Preview */}
            {resInfoData && <ResidentOverview />}
          </TabPanel>
          <TabPanel value="2" sx={{p:0}}>
            {/* 2. Table */}
            <Paper sx={{ m: 3 }}>{resInfoData && <CustomDataGrid />}</Paper>
          </TabPanel>
          {/* 3. Routine Record */}
          <TabPanel value="3" sx={{p:0}}>Routine Record</TabPanel>
          {/* 4. Medication Record */}
          <TabPanel value="4" sx={{p:0}}>Medication Record</TabPanel>
        </TabContext>
      </Box>

      {/* Popup */}
      <Popup
        title="Add a resident"
        open={openAddPopup}
        setOpen={setOpenAddPopup}
        hideBackdrop
      >
        <ResidentForm path={"/api/management/residents"} method="POST" />
      </Popup>

      <Popup
        title="Elderly profile"
        open={openEditPopup}
        setOpen={setOpenEditPopup}
        hideBackdrop
      >
        {rowData && (
          <ResidentForm
            path={"/api/management/residents/" + rowData._id}
            method="PATCH"
            rowData={rowData}
          />
        )}
      </Popup>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={error ? error : "Delete successfully!"}
      />
      <Popup
        title={
          <ErrorOutlineIcon
            sx={{
              backgroundColor: "rgba(255, 0, 0, 0.1);",
              color: "#ef5350",
              borderRadius: "50%",
              fontSize: "4rem",
              padding: 2,
            }}
          />
        }
        open={openDeletePopup}
        setOpen={setOpenDeletePopup}
        center
      >
        <TableDeleteDialog
          row={rowDelete}
          rowName={["residentID", "lastName", "firstName", "active"]}
          rowLabel={["Resident ID", "Last Name", "First Name", "Active"]}
          deleteID={deleteID}
          closePopup={setOpenDeletePopup}
          path={"/api/management/residents/"}
        />
      </Popup>

      <Popup
        title="Elderly profile"
        open={openClickElderlyPopup}
        setOpen={setOpenClickElderlyPopup}
        hideBackdrop
      >
        {clickedProfile && (
          <ResidentForm
            path={"/api/management/residents/" + clickedProfile._id}
            method="PATCH"
            rowData={clickedProfile}
          />
        )}
      </Popup>
    </>
  );
};

export default ManagementResidents;
