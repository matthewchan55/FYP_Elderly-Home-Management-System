import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Divider,
  Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export default function Popup(props) {
  const { title, children, open, setOpen, hideBackdrop} = props;

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      hideBackdrop={hideBackdrop}
      maxWidth="md"
      PaperProps={{ sx: { position: "fixed", top: 10, p: 2 } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex"}}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton disableRipple onClick={() => handleClose()} sx={{ bottom: 5 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider variant="middle"/>
        <DialogContent>{children}</DialogContent>
      </DialogTitle>
    </Dialog>
  );
}
