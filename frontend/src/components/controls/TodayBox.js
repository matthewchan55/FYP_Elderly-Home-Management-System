import { Box } from "@mui/material";

export default function TodayBox(props) {
  const { ...other } = props;
  return (
    <Box
      pl={1}
      border={"1px solid grey"}
      height={45}
      display={"flex"}
      alignItems={"center"}
      {...other}
    >
      {props.children}
    </Box>
  );
}
