import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import TableActionButton from "../TableActionButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import useDataGrid from "../../hook/useDataGrid";
import { useGridApiRef } from "@mui/x-data-grid";

export default function CustomizedAccordions({ data }) {
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
    },
    {
      headerName: "Routine Duty",
      field: "routineName",
      hideable: false,
      flex: 1,
    },
    {
      headerName: "Shift",
      field: "shift",
      flex: 1,
      hideable: false,
    },
    {
      headerName: "Status",
      type: "boolean",
      field: "complete",
      renderCell: (params) => (params.value ? <CheckIcon /> : <CloseIcon />),
    },
    {
      headerName: "Special Notes",
      flex: 1,
      field: "specialnotes",
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
      return routineRecord.routineComplete.flatMap(({ residentID, ...rest}) => {
        const specialnotes = rest.notes || "";
  
        return Object.entries(rest)
          .filter(([shift]) => shift !== "notes")
          .map(([shift, complete]) => ({
            residentID,
            routineName: routineRecord.routineName,
            shift,
            complete,
            specialnotes,
          }));
      });
    });
  
    return transformedData;
  }





  const filterRoutineData = (data) => {
    const filtered = data.filter(
      (d) =>
        d.routineCategory === "cleaning (elderly)" ||
        d.routineCategory === "health care"
    );
    setRoutineData(filtered);
  };

  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    routineData && transformRoutineComplete(routineData),
    "_Routine Table"
  );

  useEffect(() => {
    filterRoutineData(data);
  }, []);


  return (
    <>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary>
          <Typography>27/3/2023 (Sun)</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, .125)" }}
        >
          {routineData && <CustomDataGrid/>}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary>
          <Typography>27/3/2023 (Sun)</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, .125)" }}
        >
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary>
          <Typography>27/3/2023 (Sun)</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, .125)" }}
        >
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
