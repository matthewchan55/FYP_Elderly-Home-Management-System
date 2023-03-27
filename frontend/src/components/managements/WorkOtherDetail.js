import { useState, useEffect } from "react";
import { styled, Box, Typography, AccordionDetails } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import TableActionButton from "../TableActionButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MyDataGrid from "../DataGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { Controls } from "../controls/Controls";

export default function WorkOtherDetail({ data, resData }) {
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
        headerName: "Shift",
        field: "shift",
        maxWidth: 50,
        hideable: false,
        headerClassName: "grey",
      },
    {
      headerName: "Routine Category",
      field: "routineCategory",
      hideable: false,
      maxWidth: 80,
      headerClassName: "grey",
    },
    {
      headerName: "Routine Performer",
      field: "routinePerformer",
      hideable: false,
      headerClassName: "grey",
    },

    {
      headerName: "Status",
      type: "boolean",
      field: "complete",
      maxWidth: 70,
      headerClassName: "grey",
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
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
      return routineRecord.routineComplete.flatMap(
        ({ residentID, ...rest }) => {
          const specialnotes = rest.notes || "";

          const residentInfo =
            resData &&
            resData.find((resident) => resident.residentID === residentID);

          const filteredResidentInfo = residentInfo
            ? {
                residentID: residentID,
                residentName: `${residentInfo.lastName}, ${residentInfo.firstName}`,
                bed: `${residentInfo.room}-${residentInfo.bed}`,
              }
            : { residentID: "N/A", residentName: "N/A", bed: "N/A" };

          return Object.entries(rest)
            .filter(([shift]) => shift !== "notes")
            .map(([shift, complete]) => ({
              date: stringDate(routineRecord.routineDate),
              ...filteredResidentInfo,
              routineName: routineRecord.routineName,
              routineCategory: routineRecord.routineCategory,
              routinePerformer: routineRecord.routinePerformer,
              shift,
              complete,
              specialnotes,
            }));
        }
      );
    });
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
        d.routineCategory !== "cleaning (elderly)" &&
        d.routineCategory !== "health care"
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
