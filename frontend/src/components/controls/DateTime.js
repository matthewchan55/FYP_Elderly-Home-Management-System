import { DateTimePicker } from "@mui/x-date-pickers";

export default function DateTime(props) {
  const { label, value, onChange, ...other } = props;
  return (
    <DateTimePicker
      label={label}
      value={value}
      orientation="landscape"
      format="dd-MM-yyyy HH:mm"
      ampm={false}
      onChange={onChange}
      {...other}
    />
  );
}
