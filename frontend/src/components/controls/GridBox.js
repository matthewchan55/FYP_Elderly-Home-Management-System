import { Box } from "@mui/material";

export default function GridBox(props) {
  const { bgcolor, height, ...other } = props;
  return (
    <Box
      bgcolor={bgcolor ? bgcolor : "#bdbdbd"}
      flex={"0 0 40%"}
      height={height ? height : "64px"}
      border={"1px solid white"}
      {...other}
    >
      {props.children}
    </Box>
  );
}
