import {TextField} from "@mui/material"

export default function DisabledInput(props) {
  const { name, label, value, onChange, ...other} = props;
  return (
    <TextField
      disabled
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{ width: "80%", margin: 1 }}
      {...other}
    />
  );
}
