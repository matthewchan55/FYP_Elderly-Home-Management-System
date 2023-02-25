import { Alert, Snackbar, LinearProgress } from "@mui/material";

const SmallAlert = (props) => {
  //const [progress, setProgress] = useState(100);
  const { error, open, onClose, title } = props;

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
        horizontal: "right",
      }}
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
    >
      <Alert onClose={onClose} severity={error? "error": "success"}>{title}</Alert>
      {/* <LinearProgress variant="determinate" color="success" value={progress} /> */}
    </Snackbar>
  );
};

export default SmallAlert;
