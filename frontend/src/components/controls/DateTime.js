import { DateTimePicker } from "@mui/x-date-pickers";

export default function DateTime(props) {
  const { name, label, value, onChange, ...other } = props;
  return (
    <DateTimePicker
      name={name}
      label={label}
      value={value}
      orientation="landscape"
      format="dd-MM-yyyy HH:mm"
      ampm={false}
      onChange={onChange}
      sx={{ width: "80%", margin: 1 }}
      {...other}
    />
  );
}
