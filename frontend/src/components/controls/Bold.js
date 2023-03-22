import { Typography } from "@mui/material";

export default function Bold(props) {
  const { variant, ...others } = props;

  return (
    <Typography variant={variant} fontWeight={"bold"} {...others}>
      {props.children}
    </Typography>
  );
}
