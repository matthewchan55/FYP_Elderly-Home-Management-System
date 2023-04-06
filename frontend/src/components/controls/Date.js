import { DatePicker } from "@mui/x-date-pickers";

export default function Date(props) {
  const { name, label, value, onChange, ...other } = props;
  return (
    <DatePicker
      name={name}
      label={label}
      value={value}
      orientation="landscape"
      format="dd-MM-yyyy"
      ampm={false}
      onChange={onChange}
      sx={{ width: "80%", margin: 1 }}
      {...other}
    />
  );
}
