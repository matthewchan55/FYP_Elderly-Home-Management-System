import { Grid, Paper, Typography, Stack, Divider } from "@mui/material";
import { Controls } from "../controls/Controls";

import { useEffect, useState } from "react";
import Searchbar from "../Searchbar";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import TableActionButton from "../TableActionButton";
import useDataGrid from "../../hook/useDataGrid";
import { useGridApiRef } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, InputBase } from "@mui/material";

const MedicationDrugManagement = ({ data }) => {
  const [text, setText] = useState("");

  const apiRef = useGridApiRef();
  const { ActionButton } = TableActionButton();
  const tableHeaders = [
    {
      headerName: "ID",
      field: "_id",
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      headerName: "Medicine Name",
      field: "genericName",
      hideable: false,
      editable: false,
      flex: 1,
      minWidth: 90,
      maxWidth: 90,
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() +
        params.value.slice(1).toLowerCase(),
    },
    {
      headerName: "Manufactured by",
      field: "manufacturer",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() +
        params.value.slice(1).toLowerCase(),
    },
    {
      headerName: "Product Type",
      flex: 1,
      field: "productType",
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() +
        params.value.slice(1).toLowerCase(),
    },
    {
      headerName: "Product Usage",
      flex: 1,
      field: "route",
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() +
        params.value.slice(1).toLowerCase(),
    },
    {
      headerName: "Substance",
      flex: 1,
      field: "substanceName",
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() +
        params.value.slice(1).toLowerCase(),
    },
    {
      headerName: "Quantity",
      flex: 1,
      field: "quantity",
    },
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

  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    data,
    "_MedicationTable"
  );

  // to be deleted
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    padding: 5,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",

    // theme.breakpoints.down =]
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    flexGrow: "1",
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "85%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "22ch",
      },
    },
  }));

  return (
    <Grid container>
      {/* 1. Left info */}
      <Grid item xs={12} md={5}>
        
      </Grid>
      {/* 2. Med table */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ marginBottom: 3 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={"Search medicine by name..."}
              inputProps={{ "aria-label": "search" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Search>

          <Divider />
          <Stack alignItems={"center"} p={6}>
            <ContentPasteSearchIcon sx={{ fontSize: 100 }} />
            <Controls.Bold variant="h6">No medicine found</Controls.Bold>
            <Typography variant="subtitle2">
              {`"${text}" did not match any medicine from the OpenFDA.`}
            </Typography>
            <Typography variant="subtitle2">
              Would you like to create a new medicine?
            </Typography>
            <Stack direction="row" mt={2}>
              <Controls.Buttons
                text="View more medicine"
                color="neutral"
                variant="outlined"
              />
              <Controls.Buttons
                startIcon={<AddIcon />}
                text="Add new medicine"
                color="success"
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>

        {data && <CustomDataGrid />}
      </Grid>
    </Grid>
  );
};

export default MedicationDrugManagement;
