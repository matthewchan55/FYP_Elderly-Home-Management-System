import { Typography, Stack } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Controls } from "./controls/Controls";
import { useGetOrDelete } from "../hook/useGetOrDelete";
import useAlert from "../hook/useAlert";

export default function TableDelete() {
  const { getOrDelete, error } = useGetOrDelete();
  const {open, setOpen, handleClose} = useAlert();

  const TableDeleteDialog = ({
    row,
    rowName,
    rowLabel,
    deleteID,
    closePopup,
    path,
  }) => {

    const handleDelete = async () => {
      await getOrDelete(path + deleteID, "DELETE");
      setOpen(true);
      closePopup(false);
    };

    return (
      <>
        <Stack sx={{ alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            You are about to delete this record
          </Typography>
          <Stack sx={{ mb: 2, gap: 0.5 }}>
            {row &&
              rowLabel.map((rowl, index) => (
                <Typography key={index}>{`${rowl}: ${
                  row[rowName[index]]
                }`}</Typography>
              ))}
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
              onClick={() => closePopup(false)}
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
      </>
    );
  };

  return { TableDeleteDialog, open, handleClose, error};
}
