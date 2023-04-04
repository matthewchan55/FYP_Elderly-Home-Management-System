import { Typography, Stack } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useEffect } from "react";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../../components/SmallAlert";
import moment from "moment";
import useDataGrid from "../../hook/useDataGrid";
import TableActionButton from "../../components/TableActionButton";
import { Controls } from "../controls/Controls";
import CheckIcon from "@mui/icons-material/Check";
import Popup from "../Popup";
import TableDelete from "../TableDelete";
import ActivityForm from "../forms/ManagementForm/ActivityForm";


const ActivityTable = ({ data, fetch }) => {
  const apiRef = useGridApiRef();
  const tableHeaders = [
    {
      headerName: "ID",
      field: "_id",
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      headerName: "Activity",
      field: "activityinfo",
      hideable: false,
      editable: false,
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack>
          <Typography>{params.row.activityName}</Typography>
          <Typography variant="subtitle2" color="#808191">
            {params.row.activityCategory}
          </Typography>
        </Stack>
      ),
    },
    {
      headerName: "Recurring",
      field: "scheduled",
      maxWidth: 80,
      renderCell: (params) => params.row.scheduled && <CheckIcon />,
    },
    {
      headerName: "Date / Period",
      field: "date",
      maxWidth: 110,
      hideable: false,
      renderCell: (params) =>
        params.row.scheduled ? (
          <Stack alignItems={"center"}>
            <span>{moment(params.row.startDate).format("YYYY-MM-DD")}</span>-
            <span>{moment(params.row.endDate).format("YYYY-MM-DD")}</span>
          </Stack>
        ) : (
          moment(params.row.startDate).format("YYYY-MM-DD")
        ),
    },
    {
      headerName: "Time",
      field: "period",
      maxWidth: 110,
      hideable: false,
      renderCell: (params) =>
        params.row.scheduled ? (
          <div>
            <span>
              {moment.utc(params.row.scheduledStartTime).format("HH:mm")}
            </span>
            <span>-</span>
            <span>
              {moment.utc(params.row.scheduledEndTime).format("HH:mm")}
            </span>
          </div>
        ) : (
          <div>
            <span>{moment(params.row.startDate).format("HH:mm")}</span>
            <span>-</span>
            <span>{moment(params.row.endDate).format("HH:mm")}</span>
          </div>
        ),
    },
    {
      headerName: "Floor",
      maxWidth: 70,
      field: "floor",
    },
    {
      headerName: "Room",
      minWidth: 120,
      field: "room",
    },
    {
      headerName: "Fee",
      maxWidth: 70,
      field: "activityFee",
    },
    {
      headerName: "Involved Staff",
      flex: 1,
      field: "activityInvolvedStaff",
      renderCell: (params) => (
        <Controls.Avatars
          type="staff"
          total={params.row.activityInvolvedStaff.length}
        />
      ),
    },
    {
      headerName: "Involved Elderly",
      flex: 1,
      field: "activityInvolvedEld",
      renderCell: (params) => (
        <Controls.Avatars
          type="elderly"
          total={params.row.activityInvolvedEld.length}
        />
      ),
    },
    {
      headerName: "Attend",
      maxWidth: 70,
      field: "attendEld",
    },
    {
      headerName: "Absent",
      maxWidth: 70,
      field: "absentEld",
    },
    {
      headerName: "Created At",
      minWidth: 135,
      field: "createdAt",
      type: "dateTime",
      renderCell: (params) =>
        moment(params.row.createdAt).format("YYYY-MM-DD HH:MM"),
    },
    {
      headerName: "Actions",
      field: "actions",
      filterable: false,
      sortable: false,
      disableExport: true,
      maxWidth: 100,
      renderCell: (params) => (
        <ActionButton
          row={params.row}
          editTitle="Edit activity"
          deleteTitle="Delete activity"
        />
      ),
    },
  ];


  const { CustomDataGrid } = useDataGrid(
    apiRef,
    tableHeaders,
    data,
    "_Activity Table"
  );

  const {
    ActionButton,
    openEditPopup,
    setOpenEditPopup,
    openDeletePopup,
    setOpenDeletePopup,
    //edit
    rowData,
    //delete
    rowDelete,
    deleteID,
  } = TableActionButton();


  const { TableDeleteDialog, open, handleClose, error } = TableDelete();

  
  useEffect(() => {
    fetch();
  }, [open])
  

  return (
    <>
      <Popup
        title="Activity Details"
        open={openEditPopup}
        setOpen={setOpenEditPopup}
        hideBackdrop
      >
        <ActivityForm rowData={rowData} />
      </Popup>

      {/* Delete activity */}
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
        <TableDeleteDialog
          row={rowDelete}
          rowName={["activityName", "activityCategory"]}
          rowLabel={["Activity Name", "Activity Category"]}
          deleteID={deleteID}
          closePopup={setOpenDeletePopup}
          path={"/api/management/activity/"}
        />
      </Popup>

      <CustomDataGrid />
    </>
  );
};

export default ActivityTable;
