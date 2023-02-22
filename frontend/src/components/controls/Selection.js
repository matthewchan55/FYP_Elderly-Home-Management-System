import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function Selection(props) {
  const { name, label, value, onChange, inputLabelName, items } = props;

  return (
    <FormControl sx={{ width: "80%", margin: 1 }}>
      <InputLabel>{inputLabelName}</InputLabel>
      <Select name={name} label={label} value={value} onChange={onChange}>

        {items.map((item) => (
          <MenuItem name={item.name} key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  );
}
