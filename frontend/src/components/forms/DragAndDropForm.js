import { DropzoneDialog } from "mui-file-dropzone";
import { useDropzone } from "react-dropzone";
import Popup from "../Popup";
import { useCallback, useState } from "react";
import { Typography, Box } from "@mui/material";

const DragAndDropForm = ({ open,setOpen }) => {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((file) => {
    setFiles(file);
    console.log(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    // <DropzoneDialog
    //   dialogTitle={dialogTitle}
    //   dialogProps={{
    //     hideBackdrop: true,
    //   }}
    //   maxWidth="md"
    //   acceptedFiles={["image/*"]}
    //   cancelButtonText={"cancel"}
    //   submitButtonText={"submit"}
    //   open={open}
    //   onClose={onClose}
    //   onSave={handleSubmitImages}
    //   showPreviews={true}
    //   showFileNamesInPreview={true}
    // />
    <Popup
      open={open}
      setOpen={setOpen}
      hideBackdrop
      title="Import written staff records"
    >
      <Box
        style={{
          padding: "16px",
          cursor: "pointer",
          background: "#fafafa",
          color: "#bdbdbd",
          border: "1px dashed #ccc",
          width: "500px",
          height: "300px"
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Typography>
            Please drop your files here...
        </Typography>
      </Box>
    </Popup>
  );
};

export default DragAndDropForm;
