// MUI import
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// react import
import { useState, useEffect } from "react";
import useTable from "../../hook/useTable";
import PageHeader from "../../components/PageHeader";
import { Controls } from "../../components/controls/Controls";

const ManagementStaff = () => {
  useEffect(() => {
    const fetchStaff = async () => {
      const resp = await fetch("/api/user/management/staff");
      const respData = await resp.json();

      if (resp.ok) {
        setStaffData(respData);
      }
    };

    fetchStaff();
  }, []);

  const tableHeaders = [
    { id: "staffID", label: "Staff ID" },
    { id: "lastName", label: "Last Name" },
    { id: "firstName", label: "First Name" },
    { id: "account", label: "Account" },
    { id: "userType", label: "Staff Type" },
    { id: "address", label: "Address" },
    { id: "phoneNum", label: "Phone Number" },
    { id: "HKID", label: "HKID" },
  ];

  const [staffData, setStaffData] = useState(null);
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

  const { TableContainer, TableHeader, TablePaging, pagedRecords } = useTable(
    staffData,
    tableHeaders,
    filters
  );

  console.log(staffData);

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
        {/* Search bar */}
        <Toolbar>
          <Controls.OutlinedInput
            label="Search staff"
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
        {/* Staff Table */}
        <TableContainer>
          <TableHeader />
          <TableBody>
            {staffData &&
              pagedRecords().map((staff) => (
                <TableRow key={staff._id}>
                  <TableCell>{staff.staffID}</TableCell>
                  <TableCell>{staff.lastName}</TableCell>
                  <TableCell>{staff.firstName}</TableCell>
                  <TableCell>{staff.account}</TableCell>
                  <TableCell>{staff.userType}</TableCell>
                  <TableCell>{staff.address}</TableCell>
                  <TableCell>{staff.phoneNum}</TableCell>
                  <TableCell>{staff.HKID}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer>
        <TablePaging />
      </Paper>
    </>
  );
};

export default ManagementStaff;
