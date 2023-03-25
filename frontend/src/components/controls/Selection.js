import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function Selection(props) {
  const { name, label, size, value, defaultValue, onChange, inputLabelName, items, sx, ...others} = props;

  return (
    <FormControl size={size} sx={sx ? sx : { width: "80%", margin: 1 }}>
      {inputLabelName && <InputLabel>{inputLabelName}</InputLabel>}
      <Select name={name} label={label} value={value} defaultValue={defaultValue} onChange={onChange} {...others}>

        {items.map((item) => (
          <MenuItem name={item.name} key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  );
}
