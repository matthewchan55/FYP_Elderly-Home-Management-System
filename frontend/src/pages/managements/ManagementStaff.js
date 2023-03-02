// MUI import
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Paper, Toolbar, IconButton, Typography, Stack } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

// react import
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Popup from "../../components/Popup";
import { Controls } from "../../components/controls/Controls";
import EmptyForm from "../../components/EmptyForm";
import ProfileForm from "../../components/ProfileForm";
import { useGetOrDelete } from "../../hook/useGetOrDelete";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../../components/SmallAlert";
import { useAuthContext } from "../../hook/useAuthContext";
import moment from "moment";

const ManagementStaff = () => {
  // popup state
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openStaffPopup, setOpenStaffPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  // table state
  const [staffData, setStaffData] = useState(null);
  const [staffProfile, setStaffProfile] = useState();
  const [staffIDforDelete, setStaffIDforDelete] = useState();
  const [pageSize, setPageSize] = useState(10);

  const { user } = useAuthContext();
  const { getOrDelete, error, setError } = useGetOrDelete();
  const { open, setOpen, handleClose } = useAlert();

  const tableHeaders = [
    {
      headerName: "ID",
      field: "_id",
      hide: true,
      hideable: false,
      editable: false,
      filterable: false,
    },
    {
      headerName: "Staff ID",
      field: "staffID",
      hideable: false,
      editable: false,
    },
    { headerName: "Account", field: "account", width: "150", hideable: false },
    { headerName: "Last Name", field: "lastName", width: "150" },
    { headerName: "First Name", field: "firstName", width: "150" },
    { headerName: "Gender", field: "sex" },
    { headerName: "Staff Type", field: "userType" },
    { headerName: "Address", field: "address", width: "300" },
    { headerName: "Phone Number", field: "phoneNum" },
    { headerName: "HKID", field: "HKID" },
    {
      headerName: "Employment Date",
      field: "createdAt",
      width: "150",
      renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      headerName: "Last updated at",
      field: "updatedAt",
      width: "150",
      renderCell: (params) =>
        moment(params.row.updatedAt).format("YYYY-MM-DD HH:MM"),
    },
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchStaff = async () => {
      const resp = await fetch("/api/user/management/staff");
      const respData = await resp.json();

      if (resp.ok) {
        setStaffData(respData);
      }
    };
    fetchStaff();
  }, [openPopUp, openStaffPopup, openDeletePopup]);

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
      setStaffIDforDelete(staff._id);
      setOpenDeletePopup(true);
    }
  };

  // open the alert message and close the dialog
  const handleDelete = async () => {
    await getOrDelete(
      "/api/user/management/staff/" + staffIDforDelete,
      "DELETE"
    );
    setOpen(true);
    setOpenDeletePopup(false);
  };

  function CustomToolbar() {
    return (
      <Toolbar>
        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarColumnsButton />
            <GridToolbarExport />
          </GridToolbarContainer>
        </Stack>

        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "flex-end" }}
        >
          <Controls.Buttons
            text="Add new staff"
            color="deepBlue"
            onClick={() => setOpenPopUp(true)}
            variant="outlined"
            size="large"
            startIcon={<PlaylistAddIcon />}
          />
        </Stack>
      </Toolbar>
    );
  }

  return (
    <>
      <PageHeader
        title="Staff Management"
        subtitle="View staff profile or manage staff status"
        icon={
          <ManageAccountsIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
      <Paper sx={{ m: 3 }}>
        {staffData && (
          <DataGrid
            columns={tableHeaders}
            rows={staffData}
            getRowId={(row) => row._id}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            localeText={{
              toolbarColumns: "Columns",
              toolbarFilters: "Search by",
              toolbarExport: "Export",
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            componentsProps={{
              panel: {
                sx: {
                  top: "-70px !important",
                },
              },
            }}
            sx={{ height: "700px", width: "100%" }}
          />
        )}
      </Paper>

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
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            You are about to delete this record
          </Typography>
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
      ;
    </>
  );
};

export default ManagementStaff;
