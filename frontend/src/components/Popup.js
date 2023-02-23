import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export default function Popup(props) {
  const { title, children, open, setOpen } = props;

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      hideBackdrop
      maxWidth="md"
      PaperProps={{ sx: { position: "fixed", top: 10, p: 2 } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={() => handleClose()} sx={{ bottom: 5 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>{children}</DialogContent>
      </DialogTitle>
    </Dialog>
  );
}
