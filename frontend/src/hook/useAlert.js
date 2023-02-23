import { useState } from "react";

export default function useAlert() {
    
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return { open, setOpen, handleClose };
}
