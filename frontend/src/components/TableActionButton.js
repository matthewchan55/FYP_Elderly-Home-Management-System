import { Tooltip, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useState } from "react";
import { useAuthContext } from "../hook/useAuthContext";


export default function TableActionButton() {

  const [rowData, setRowData] = useState();
  const [rowDelete, setRowDelete] = useState();
  const [deleteID, setDeleteID] = useState();

  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] =useState(false);

  const [deleteError, setDeleteError] = useState();
  const [openDeleteErrorAlert, setOpenDeleteErrorAlert] = useState(false);
  const { user } = useAuthContext();

  // handle when edit button is clicked
  const handleEditClick = (row) => {
    setRowData(row);
    setOpenEditPopup(true);
  };

  // handle when delete button is clicked
  const handleDeleteClick = (row) => {
    if (row._id === user._id) {
      setDeleteError("You cannot delete your own account");
      setOpenDeleteErrorAlert(true);
    } else {
      setRowDelete(row);
      setDeleteID(row._id);
      setOpenDeletePopup(true);
    }
  };


  const ActionButton = ({row}) => {
    return (
      <>
        <Tooltip title="Edit user">
          <IconButton onClick={() => handleEditClick(row)}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete user">
          <IconButton onClick={() => handleDeleteClick(row)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  return { ActionButton, openEditPopup, setOpenEditPopup, openDeletePopup, setOpenDeletePopup, openDeleteErrorAlert, setOpenDeleteErrorAlert, rowData, rowDelete, deleteID, deleteError };
}
