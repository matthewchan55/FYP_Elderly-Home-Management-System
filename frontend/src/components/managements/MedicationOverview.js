import {
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { Controls } from "../controls/Controls";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import Searchbar from "../Searchbar";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import TableActionButton from "../TableActionButton";
import useDataGrid from "../../hook/useDataGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, InputBase } from "@mui/material";


const MedicationOverview = ({ data }) => {
  const [grouped, setGrouped] = useState();
  const [resData, setResData] = useState();
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
      headerName: "Default To Eld",
      flex: 1,
      field: "setDefaultTo",
      valueFormatter: (params) => params.value.join(", "),
    },
    {
      headerName: "Shift",
      flex: 1,
      field: "Shift",
      valueGetter: (params) => params.row.shift.join(", "),
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

  const chartTitle = {
    title: "Total medicine",
    sliceVisibilityThreshold: 0.01,
  };

  const groupedByCategory = (data) => {
    const groupedData = data.reduce((counts, drug) => {
      const productType =
        drug.route.charAt(0).toUpperCase() + drug.route.slice(1).toLowerCase();
      counts[productType] = (counts[productType] || 0) + 1;
      return counts;
    }, {});
    const header = ["Type of medicine", "Count"];
    const result = Object.entries(groupedData).map(([type, count]) => [
      type,
      count,
    ]);
    // add header
    result.unshift(header);
    setGrouped(result);
  };

  const fetchResident = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      setResData(respData);
    }
  };
  useEffect(() => {
    groupedByCategory(data);
    fetchResident();
  }, []);

  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    data,
    "_MedicationTable"
  );

  console.log(text);
  // later change to component
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function findRes(res) {
    const eld = resData.find((data) => data.residentID === res);

    const { lastName, firstName, room, bed } = eld;
    return (
      <Box direction="row" display={"flex"} alignItems="center" mt={1}>
        <Avatar {...stringAvatar(`${lastName} ${firstName}`)} />
        <Stack ml={2}>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Resident ID: ${res}`}</Typography>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Name: ${lastName}, ${firstName}`}</Typography>
          <Typography
            variant="subtitle2"
            color="#808191"
          >{`Bed: ${room}-${bed}`}</Typography>
        </Stack>
      </Box>
    );
  }

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

      <Grid item xs={12} md={4}>
        <Grid container gap={4}>
          <Grid item mr={3}>
            <Paper>
              <Stack direction="row">
                <Stack p={3}>
                  <Controls.Bold variant="h5" mb={2}>
                    Total number of drugs
                  </Controls.Bold>
                  <Controls.Bold variant="h4">
                    {data && data.length}
                  </Controls.Bold>
                </Stack>

                {grouped && (
                  <Chart
                    chartType="PieChart"
                    data={grouped}
                    options={chartTitle}
                    width="100%"
                    height="300px"
                  />
                )}
              </Stack>
            </Paper>
          </Grid>
          <Grid item mr={3} width={"100%"}>
            <Paper sx={{ p: 3 }}>
              <Controls.Bold variant="h5" mb={3}>
                Selected Medicine: Abacavir
              </Controls.Bold>
              <Grid container>
                <Grid item xs={6} md={5} p={2}>
                  <Stack gap={2}>
                    <Controls.Bold>Manufacturer</Controls.Bold>
                    <Controls.OutlinedInput
                      name="manufacturer"
                      value="Cipla usa inc."
                      variant="standard"
                      sx={{ margin: 0 }}
                    />
                    <Controls.Bold>Product usage</Controls.Bold>
                    <Controls.OutlinedInput
                      name="productUsage"
                      value="Oral"
                      variant="standard"
                      sx={{ margin: 0 }}
                    />
                    <Controls.Bold>Substance</Controls.Bold>
                    <Controls.OutlinedInput
                      name="substance"
                      value="Abacavir sulfate"
                      variant="standard"
                      sx={{ margin: 0 }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6} md={5} ml={5}>
                  <Controls.Bold mb={2}>Medicine Default To:</Controls.Bold>
                  {resData &&
                    data &&
                    data[0].setDefaultTo.map((res) => findRes(res))}
                  <Box display={"flex"} justifyContent="center" mt={2}>
                    <IconButton disableTouchRipple>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* 2. Med table */}
      <Grid item xs={12} md>
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

export default MedicationOverview;
