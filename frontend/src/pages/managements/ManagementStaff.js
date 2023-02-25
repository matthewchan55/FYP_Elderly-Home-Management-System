// MUI import
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

// react import
import { useState, useEffect } from "react";
import useTable from "../../hook/useTable";
import { useSubmit } from "../../hook/useSubmit";
import PageHeader from "../../components/PageHeader";
import Popup from "../../components/Popup";
import { Controls } from "../../components/controls/Controls";
import EmptyForm from "../../components/EmptyForm";
import ProfileForm from "../../components/ProfileForm";

const ManagementStaff = () => {
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openStaffPopup, setOpenStaffPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const [staffData, setStaffData] = useState(null);
  const [staffProfile, setStaffProfile] = useState();
  const [staffIDforDelete, setStaffIDforDelete] = useState();

  //const {submit, error}= useSubmit();


  const tableHeaders = [
    { id: "staffID", label: "Staff ID" },
    { id: "lastName", label: "Last Name" },
    { id: "firstName", label: "First Name" },
    { id: "account", label: "Account" },
    { id: "userType", label: "Staff Type" },
    { id: "address", label: "Address" },
    { id: "phoneNum", label: "Phone Number" },
    { id: "HKID", label: "HKID" },
    { id: "actions", label: "", disableSorting: true },
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

  const [filters, setFilters] = useState({
    filtering: (items) => {
      return items;
    },
  });

  const handleSearch = (e) => {
    let target = e.target;
    setFilters({
      filtering: (items) => {
        if (target.value === "") return items;
        else return items.filter((x) => x.account.includes(target.value));
      },
    });
  };

  const handleEditClick = (staff) => {
    setStaffProfile(staff);
    setOpenStaffPopup(true);
  };

  // setdeletepopup false + usealert
  const handleDelete = async() => {
    const resp = await fetch("/api/user/management/staff/" + staffIDforDelete, {
      method: "DELETE"
    })

    const respData = await resp.json();
  }

  const { TableContainer, TableHeader, TablePaging, pagedRecords } = useTable(
    staffData,
    tableHeaders,
    filters
  );

  return (
    <>
      <PageHeader
        title="Staff Management"
        subtitle="View staff profile or manage staff status"
        icon={
          <ManageAccountsIcon sx={{ fontSize: 60, justifyContent: "center" }} />
        }
      />
      <Paper>
        {/* Tool bar */}
        <Toolbar>
          {/* Search bar */}
          <Controls.OutlinedInput
            label="Search staff"
            onChange={handleSearch}
            sx={{ width: "20%", margin: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* Add button */}
          <Controls.Buttons
            text="Add new staff"
            color="deepBlue"
            onClick={() => setOpenPopUp(true)}
            variant="outlined"
            startIcon={<PlaylistAddIcon />}
          />
        </Toolbar>

        {/* Staff Table */}
        <TableContainer>
          <TableHeader />
          <TableBody>
            {staffData &&
              pagedRecords().map((staff) => (
                <TableRow key={staff._id}>
                  {/* **object.value(staff).filter().map() */}
                  {/* may need to add more info of staff e.g. email/active or disable/hiredate (createdAt).../ last working date*/}
                  <TableCell>{staff.staffID}</TableCell>
                  <TableCell>{staff.lastName}</TableCell>
                  <TableCell>{staff.firstName}</TableCell>
                  <TableCell>{staff.account}</TableCell>
                  <TableCell>{staff.userType}</TableCell>
                  <TableCell>{staff.address}</TableCell>
                  <TableCell>{staff.phoneNum}</TableCell>
                  <TableCell>{staff.HKID}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(staff)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => {setStaffIDforDelete(staff._id); setOpenDeletePopup(true)}}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer>
        <TablePaging />
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
