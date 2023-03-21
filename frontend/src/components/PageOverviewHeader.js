import { Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import { Controls } from "./controls/Controls";
import { useState } from "react";

export default function PageOverviewHeader() {
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openImportPopup, setOpenImportPopup] = useState(false);

  const OverviewHeader = ({ title, addButtonTitle }) => {
    return (
      <Stack direction="row">
        <Typography variant="h5" sx={{ flexGrow: 1, mt: 1, ml: 5 }}>
          {title}
        </Typography>
        {addButtonTitle && (
          <>
            <Controls.Buttons
              text="Import"
              color="whiteGrey"
              variant="contained"
              onClick={() => setOpenImportPopup(true)}
              size="large"
              startIcon={<CloudUploadOutlinedIcon />}
            />
            <Controls.Buttons
              text={addButtonTitle}
              color="deepBlue"
              onClick={() => setOpenAddPopup(true)}
              variant="outlined"
              size="large"
              startIcon={<PlaylistAddIcon />}
            />
          </>
        )}
      </Stack>
    );
  };

  return {
    OverviewHeader,
    openAddPopup,
    setOpenAddPopup,
    openImportPopup,
    setOpenImportPopup,
  };
}
