import { useState, useEffect } from "react";
import {Box, Typography, AccordionDetails } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import TableActionButton from "../TableActionButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MyDataGrid from "../DataGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { Controls } from "../controls/Controls";

export default function WorkRoutineDetails({ data, resData }) {
  const [expanded, setExpanded] = useState("panel1");
  const [routineData, setRoutineData] = useState();

  // Data grid
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
      headerName: "Resident ID",
      field: "residentID",
      hideable: false,
      filterable: false,
      headerClassName: "grey",
    },
    {
      headerName: "Resident Name",
      field: "residentName",
      flex: 1,
      maxWidth: 130,
      hideable: false,
      filterable: false,
      headerClassName: "grey",
    },
    {
      headerName: "Bed",
      field: "bed",
      maxWidth: 80,
      hideable: false,
      filterable: false,
      headerClassName: "grey",
    },
    {
      headerName: "Routine Duty",
      field: "routineName",
      hideable: false,
      flex: 1,
      headerClassName: "grey",
    },

    {
      headerName: "Routine Category",
      field: "routineCategory",
      hideable: false,
      minWidth: 140,
      maxWidth: 140,
      headerClassName: "grey",
    },

    {
      headerName: "Routine Updated By",
      field: "routinePerformedBy",
      hideable: false,
      headerClassName: "grey",
      minWidth: 150,
      maxWidth: 150,
    },

    {
      headerName: "Status",
      type: "boolean",
      field: "status",
      maxWidth: 70,
      headerClassName: "grey",
      renderCell: (params) => (params.value ? (
        <CheckCircleIcon sx={{ color: "#26a69a" }} />
      ) : (
        <CancelIcon sx={{ color: "#ef5350" }} />
      )),
    },
    {
      headerName: "Special Notes",
      flex: 1,
      field: "specialnotes",
      headerClassName: "grey",
    },
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      disableExport: true,
      headerClassName: "grey",
      renderCell: (params) => (
        <ActionButton
          row={params.row}
          editTitle="Edit user"
          deleteTitle="Delete user"
        />
      ),
    },
  ];

  // Accordion
  const Accordion = (props) => (
    <MuiAccordion
      disableGutters
      elevation={0}
      square
      {...props}
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.12);",
      }}
    />
  );

  const AccordionSummary = (props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
      sx={{
        backgroundColor: "rgba(0, 0, 0, .03)",
        flexDirection: "row-reverse",
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
          transform: "rotate(90deg)",
        },
        "& .MuiAccordionSummary-content": {
          marginLeft: 1,
        },
      }}
    />
  );

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function transformRoutineComplete(routine) {
    const transformedData = routine.flatMap((routineRecord) => {
      // spread the routine complete (array of objects)
      return routineRecord.routineComplete.map(({ id, ...rest }) => {

        const specialnotes = rest.notes || "";
        // find elderly
        const residentInfo =
          resData && resData.find((resident) => resident.residentID === id);
        const filteredResidentInfo = residentInfo
          ? {
              residentName: `${residentInfo.lastName}, ${residentInfo.firstName}`,
              bed: `${residentInfo.room}-${residentInfo.bed}`,
            }
          : {};
        return {
          date: stringDate(routineRecord.routineDate),
          residentID: id,
          ...filteredResidentInfo,
          routineName: routineRecord.routineName,
          routineCategory: routineRecord.routineCategory,
          routinePerformer: routineRecord.routinePerformer,
          status: rest.status,
          specialnotes,
        };
      });
    });
    //grouped by date
    const groupedData = groupByDate(transformedData);
    return groupedData;
  }

  function groupByDate(data) {
    const groupedData = data.reduce((acc, obj) => {
      const date = obj.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(obj);
      return acc;
    }, {});

    const result = Object.entries(groupedData).map(([date, objs]) => ({
      date,
      objs,
    }));
    result.sort((a, b) => {
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateB - dateA;
    });
    return result;
  }

  function stringDate(date) {
    const dateFormat = "dd-MM-yyyy";
    const dateObj = parseISO(date);
    return format(dateObj, dateFormat);
  }

  const filterRoutineData = (data) => {
    const filtered = data.filter(
      (d) =>
        d.routineCategory === "cleaning (elderly)" ||
        d.routineCategory === "health care"
    );
    const result = transformRoutineComplete(filtered);
    setRoutineData(result);
  };

  useEffect(() => {
    filterRoutineData(data);
  }, []);

  return (
    <>
      <Controls.Bold>{`Detailed routine records: ${
        routineData && routineData.length
      }`}</Controls.Bold>
      {routineData &&
        routineData.map((item, idx) => (
          <Accordion
            expanded={expanded === `panel${idx + 1}`}
            onChange={handleChange(`panel${idx + 1}`)}
            key={idx}
          >
            <AccordionSummary>
              <Typography>{item.date}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, .125)" }}
            >
              <Box
                sx={{
                  width: "100%",
                  "& .grey": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <MyDataGrid
                  api={apiRef}
                  th={tableHeaders}
                  data={item.objs}
                  name="_WorkRecords"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
}
