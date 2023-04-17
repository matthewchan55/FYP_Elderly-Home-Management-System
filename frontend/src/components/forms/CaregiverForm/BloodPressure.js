import { Typography, InputAdornment, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { Controls } from "../../controls/Controls";

export const BloodPressure = ({ eld, date, shift, addRoutineList, deselect, note, value}) => {
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [notes, setNotes] = useState("");


  const handleAddList = () => {
    const bloodPressure = {date: date, routineName: "Blood pressure measurement", id: eld.residentID, status: true, shift: shift, notes: notes, value: {Readings: `${systolic}/${diastolic} mmHg`}}
    addRoutineList(bloodPressure)
    deselect()
  }


  const calculateBloodPressure = () => {
    const gender = eld.sex;
    if (
      (gender === "M" && systolic > 133 && diastolic > 69) ||
      (gender === "F" && systolic > 139 && diastolic > 68)
    ) {
      setNotes(
        `${date} (${shift}): ${systolic}/${diastolic} exceeds normal range. Needs consultation.`
      );
    }
  };

  useMemo(() => {
    calculateBloodPressure();
  }, [systolic, diastolic]);

  return (
    <>
      <Typography variant="h6">
        Normal blood pressure for Male: 133/69 mmHg
      </Typography>
      <Typography variant="h6">
        Normal blood pressure for Female: 139/68 mmHg
      </Typography>
      <Stack gap={2}>
        <Typography variant="h6" mt={2}>
          Enter elderly blood pressure readings:
        </Typography>
        <Stack direction="row" alignItems={"flex-end"}>
          <Controls.OutlinedInput
            label="Systolic"
            variant="standard"
            value={value.systolic || systolic}
            onChange={(e) => setSystolic(e.target.value)}
            sx={{ margin: 0, width: "50px" }}
          />
          <Typography>/</Typography>
          <Controls.OutlinedInput
            label="Diastolic"
            variant="standard"
            value={value.diastolic || diastolic}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">mmHg</InputAdornment>
              ),
            }}
            onChange={(e) => setDiastolic(e.target.value)}
            sx={{ ml: 2, width: "100px" }}
          />
        </Stack>
        <Controls.OutlinedInput
          label="Special Notes"
          multiline
          rows={4}
          value={notes || note}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ margin: 0, my: 2 }}
        />
      </Stack>

      <Controls.Buttons text="Add to list" type="submit" onClick={handleAddList}/>
    </>
  );
};
