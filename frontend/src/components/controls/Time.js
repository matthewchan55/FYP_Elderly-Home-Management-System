import { TimePicker } from "@mui/x-date-pickers";

export default function Time(props) {
  const { name, label, value, onChange, ...other } = props;
  return (
    <TimePicker
      name={name}
      label={label}
      value={value}
      ampm={false}
      onChange={onChange}
      sx={{ width: "35%", margin: 1 }}
      {...other}
    />
  );
}
