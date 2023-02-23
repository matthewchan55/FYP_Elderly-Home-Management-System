import { Alert, Snackbar, LinearProgress } from "@mui/material";

const SmallAlert = (props) => {
  //const [progress, setProgress] = useState(100);
  const { open, onClose } = props;

  //  useEffect(() => {
  //    const timer = setInterval(() => {
  //      setProgress((oldProgress) => {
  //        return oldProgress - 10;
  //      });
  //    }, 300);
  //    return () => {
  //      clearInterval(timer);
  //    };
  //  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
    >
      <Alert onClose={onClose}>Updated Successfully!</Alert>
      {/* <LinearProgress variant="determinate" color="success" value={progress} /> */}
    </Snackbar>
  );
};

export default SmallAlert;
