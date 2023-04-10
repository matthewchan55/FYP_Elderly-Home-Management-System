import {TextField} from "@mui/material"

export default function OutlinedInput(props) {
  const { name, label, value, onChange, ...other} = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{ width: "80%", margin: 1 }}
      autoComplete='off'
      {...other}
    />
  );
}
