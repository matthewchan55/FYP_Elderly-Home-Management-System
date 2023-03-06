// MUI import
import {
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckIcon from "@mui/icons-material/Check";

// react import
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Popup from "../../components/Popup";
import { Controls } from "../../components/controls/Controls";
import EmptyForm from "../../components/forms/EmptyForm";
import ProfileForm from "../../components/forms/ProfileForm";
import { useGetOrDelete } from "../../hook/useGetOrDelete";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../../components/SmallAlert";
import { useAuthContext } from "../../hook/useAuthContext";
import moment from "moment";
import useDataGrid from "../../hook/useDataGrid";
import DragAndDropForm from "../../components/forms/DragAndDropForm";

const ManagementStaff = () => {
  // popup state
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openStaffPopup, setOpenStaffPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [openImportPopup, setOpenImportPopup] = useState(false);

  // table state
  const [staffData, setStaffData] = useState(null);
  const [staffProfile, setStaffProfile] = useState();
  const [staffDelete, setStaffDelete] = useState(null);
  const [staffIDforDelete, setStaffIDforDelete] = useState();
  const apiRef = useGridApiRef();

  // react import
  const { user } = useAuthContext();
  const { getOrDelete, error, setError } = useGetOrDelete();
  const { open, setOpen, handleClose } = useAlert();

  const tableHeaders = [
    {
      headerName: "ID",
      field: "_id",
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      headerName: "Staff ID",
      field: "staffID",
      hideable: false,
      editable: false,
      width: "85",
    },
    { headerName: "Account", field: "account", width: "125", hideable: false },
    {
      headerName: "Last Name",
      field: "lastName",
      width: "100",
    },
    {
      headerName: "First Name",
      field: "firstName",
      width: "100",
    },
    {
      headerName: "Gender",
      field: "sex",
      width: "75",
      renderCell: (params) =>
        params.value === "Not available" ? "N/A" : params.value,
    },
    {
      headerName: "Staff Type",
      field: "userType",
      type: "singleSelect",
    },
    {
      headerName: "Active",
      field: "active",
      type: "boolean",
      width: "60",
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
    },
    { headerName: "Address", field: "address", width: "200" },
    {
      headerName: "Email Address",
      field: "email",
      width: "200",
    },
    {
      headerName: "Phone Number",
      field: "phoneNum",
      width: "125",
    },
    { headerName: "HKID", field: "HKID" },
    {
      headerName: "Employment Date",
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
    { headerName: "Updated By", field: "updatedBy", width: "200" },
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      disableExport: true,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit user">
            <IconButton onClick={() => handleEditClick(params.row)}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete user">
            <IconButton onClick={() => handleDeleteClick(params.row)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchStaff = async () => {
      const resp = await fetch("/api/management/staff");
      const respData = await resp.json();

      if (resp.ok) {
        setStaffData(respData);
      }
    };
    fetchStaff();
  }, [openPopUp, openStaffPopup, openDeletePopup]);

  const { CustomDataGrid } = useDataGrid(apiRef, tableHeaders, staffData);

  // handle when edit button is clicked
  const handleEditClick = (staff) => {
    setStaffProfile(staff);
    setOpenStaffPopup(true);
  };

  // handle when delete button is clicked
  const handleDeleteClick = (staff) => {
    if (staff._id === user._id) {
      setError("You cannot delete your own account");
      setOpen(true);
    } else {
      setStaffDelete(staff);
      setStaffIDforDelete(staff._id);
      setOpenDeletePopup(true);
    }
  };

  // open the alert message and close the dialog
  const handleDelete = async () => {
    await getOrDelete("/api/management/staff/" + staffIDforDelete, "DELETE");
    setOpen(true);
    setOpenDeletePopup(false);
  };

  return (
    <>
      <PageHeader
        title="Staff Management"
        subtitle="View staff profile or manage staff status"
        icon={
          <ManageAccountsIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
      {/* Management overview  */}
      <Stack sx={{ mt: 3, mr: 3 }}>
        <Stack direction="row">
          <Typography variant="h5" sx={{ flexGrow: 1, mt: 1, ml: 5 }}>
            Staff Overview
          </Typography>
          <Controls.Buttons
            text="Import"
            color="whiteGrey"
            variant="contained"
            onClick={() => setOpenImportPopup(true)}
            size="large"
            startIcon={<CloudUploadOutlinedIcon />}
          ></Controls.Buttons>

          <Controls.Buttons
            text="Add new staff"
            color="deepBlue"
            onClick={() => setOpenPopUp(true)}
            variant="outlined"
            size="large"
            startIcon={<PlaylistAddIcon />}
          />
        </Stack>
        <Box
          id="staffchart"
          flex={1}
          display="flex"
          pl={5}
          py={2}
          gap={8}
          width="80%"
        >
          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <PeopleAltIcon />
            <Typography fontSize={18} color="#808191">
              Total staff
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {staffData && staffData.length}
            </Typography>
          </Stack>

          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <CoPresentIcon />
            <Typography fontSize={18} color="#808191">
              Active staff
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {staffData && staffData.filter((sd) => sd.active === true).length}
            </Typography>
          </Stack>

          <Stack
            sx={{
              width: "25%",
              border: 1,
              borderRadius: "5px",
              borderColor: "#bdbdbd",
              p: 2,
            }}
          >
            <AccessibilityNewIcon />
            <Typography fontSize={18} color="#808191">
              Incomplete staff information
            </Typography>
            <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
              {staffData &&
                staffData.filter((sd) => Object.keys(sd).length < 17).length}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Table */}
      <Paper sx={{ m: 3 }}>{staffData && <CustomDataGrid />}</Paper>

      {/* pop up */}
      <Popup
        title="Add a staff"
        open={openPopUp}
        setOpen={setOpenPopUp}
        hideBackdrop
      >
        <EmptyForm path={"/api/user/signup"} />
      </Popup>
      <Popup
        title="Staff profile"
        open={openStaffPopup}
        setOpen={setOpenStaffPopup}
        hideBackdrop
      >
        <ProfileForm selectedUser={staffProfile} />
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
        <Stack sx={{ alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb:1 }}>
            You are about to delete this record
          </Typography>
          <Stack sx={{mb: 2, gap: 0.5}}>
            <Typography>
              {staffDelete && `Staff ID: ${staffDelete.staffID}`}
            </Typography>
            <Typography>
              {staffDelete && `Account: ${staffDelete.account}`}
            </Typography>
            <Typography>
              {staffDelete && `Last Name: ${staffDelete.lastName}`}
            </Typography>
            <Typography>
              {staffDelete && `First Name: ${staffDelete.firstName}`}
            </Typography>
          </Stack>

          <Typography variant="subtitle2">
            Please confirm as the operation cannot be undone.
          </Typography>
          <Stack direction="row" sx={{ marginTop: 2 }}>
            <Controls.Buttons
              startIcon={<CloseIcon />}
              text="Cancel"
              color="neutral"
              size="large"
              onClick={() => setOpenDeletePopup(false)}
            />
            <Controls.Buttons
              text="Delete"
              color="errorRed"
              startIcon={<DeleteOutlineOutlinedIcon />}
              size="large"
              onClick={handleDelete}
            />
          </Stack>
        </Stack>
      </Popup>
      <DragAndDropForm open={openImportPopup} setOpen={setOpenImportPopup} />
    </>
  );
};

export default ManagementStaff;
