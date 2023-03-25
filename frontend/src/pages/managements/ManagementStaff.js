// MUI import
import { Paper, Typography, Stack, Box } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CheckIcon from "@mui/icons-material/Check";

// react import
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Popup from "../../components/Popup";
import { Controls } from "../../components/controls/Controls";
import StaffForm from "../../components/forms/ManagementForm/StaffForm";
import ProfileForm from "../../components/forms/ProfileForm";
import { useGetOrDelete } from "../../hook/useGetOrDelete";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../../components/SmallAlert";
import moment from "moment";
import useDataGrid from "../../hook/useDataGrid";
import DragAndDropForm from "../../components/forms/DragAndDropForm";
import PageOverviewHeader from "../../components/PageOverviewHeader";
import TableActionButton from "../../components/TableActionButton";
import PageOverview from "../../components/PageOverview";




const ManagementStaff = () => {
  // table state
  const [staffData, setStaffData] = useState(null);
  const apiRef = useGridApiRef();

  // react import
  const {
    OverviewHeader,
    openAddPopup,
    setOpenAddPopup,
    openImportPopup,
    setOpenImportPopup,
  } = PageOverviewHeader();

  const {
    ActionButton,
    openEditPopup,
    setOpenEditPopup,
    openDeletePopup,
    setOpenDeletePopup,
    openDeleteErrorAlert,          //only needed for staff delete own account
    setOpenDeleteErrorAlert,       //only needed for staff delete own account
    deleteError,                   //only needed for staff delete own account
    rowData,
    rowDelete,
    deleteID,
  } = TableActionButton();

  const { getOrDelete, error } = useGetOrDelete();
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
      flex: 1,
      minWidth: 90,
      maxWidth: 90,
    },
    {
      headerName: "Account",
      field: "account",
      flex: 1,
      hideable: false,
    },
    {
      headerName: "Last Name",
      flex: 1,
      field: "lastName",
    },
    {
      headerName: "First Name",
      flex: 1,
      field: "firstName",
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
    {
      headerName: "Staff Type",
      field: "userType",
      type: "singleSelect",
      valueOptions: ["admin", "caregivers"],
      flex: 1,
      minWidth: 90,
      maxWidth: 90,
    },
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
      headerName: "Address",
      field: "address",
      flex: 1,
      minWidth: 150,
      maxWidth: 170,
    },
    {
      headerName: "Email Address",
      field: "email",
      minWidth: 130,
      maxWidth: 130,
      flex: 1,
    },
    {
      headerName: "Phone Number",
      field: "phoneNum",
      flex: 1,
    },
    { headerName: "HKID", field: "HKID", minWidth: 100, maxWidth: 100 },
    {
      headerName: "Employment Date",
      field: "createdAt",
      flex: 1,
      type: "date",
      valueFormatter: (params) => moment(params?.value).format("YYYY/MM/DD"),
      renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      headerName: "Last updated at",
      field: "updatedAt",
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      type: "dateTime",
      valueFormatter: (params) =>
        moment(params?.value).format("YYYY/MM/DD HH:MM"),
      renderCell: (params) =>
        moment(params.row.updatedAt).format("YYYY-MM-DD HH:MM"),
    },
    { headerName: "Updated By", field: "updatedBy", flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      disableExport: true,
      flex: 1,
      renderCell: (params) => (
        <ActionButton
          row={params.row}
          editTitle="Edit user"
          deleteTitle="Delete user"
        />
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
  }, [openAddPopup, openEditPopup, openDeletePopup]);


  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    staffData,
    "_Staff Table"
  );

  // open the alert message and close the dialog
  const handleDelete = async () => {
    await getOrDelete("/api/management/staff/" + deleteID, "DELETE");
    setOpen(true);
    setOpenDeletePopup(false);
  };

  // PageOverview
  const icon = [ <PeopleAltIcon />, <CoPresentIcon />,  <AccessibilityNewIcon />];
  const title = ["Total staff", "Active staff", "Incomplete staff information"];
  const titleValue = [staffData && staffData.length, staffData && staffData.filter((sd) => sd.active === true).length, staffData && staffData.filter((sd) => Object.keys(sd).length < 17).length]

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
      <Stack sx={{ mt: 3, mr: 5 }}>
        <OverviewHeader title="Staff Overview" addButtonTitle="Add new staff" />
        <PageOverview icon={icon} title={title} titleValue={titleValue}/>
      </Stack>

      {/* Table */}
      <Paper sx={{mx:3}}>{staffData && <CustomDataGrid />}</Paper>

      {/* pop up */}
      <Popup
        title="Add a staff"
        open={openAddPopup}
        setOpen={setOpenAddPopup}
        hideBackdrop
      >
        <StaffForm path={"/api/user/signup"} />
      </Popup>

      <Popup
        title="Staff profile"
        open={openEditPopup}
        setOpen={setOpenEditPopup}
        hideBackdrop
      >
        <ProfileForm selectedUser={rowData} />
      </Popup>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={error ? error : "Delete successfully!"}
      />
      <SmallAlert
        error={deleteError}
        open={openDeleteErrorAlert}
        onClose={() => setOpenDeleteErrorAlert(false)}
        title={deleteError}
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
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            You are about to delete this record
          </Typography>
          <Stack sx={{ mb: 2, gap: 0.5 }}>
            <Typography>
              {rowDelete && `Staff ID: ${rowDelete.staffID}`}
            </Typography>
            <Typography>
              {rowDelete && `Account: ${rowDelete.account}`}
            </Typography>
            <Typography>
              {rowDelete && rowDelete.lastName
                ? `Last Name: ${rowDelete.lastName}`
                : "Last Name: /"}
            </Typography>
            <Typography>
              {rowDelete && rowDelete.firstName
                ? `First Name: ${rowDelete.firstName}`
                : "First Name: /"}
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
