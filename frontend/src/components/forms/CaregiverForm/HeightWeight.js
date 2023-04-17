import { Typography, InputAdornment, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { Controls } from "../../controls/Controls";

export const HeightWeight = ({
  eld,
  date,
  shift,
  addRoutineList,
  deselect,
  note,
  value,
}) => {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [notes, setNotes] = useState("");

  const handleAddList = () => {
    const bg = {
      date: date,
      routineName: "Height & Weight",
      id: eld.residentID,
      status: true,
      shift: shift,
      notes: notes,
      value: { Height: height, Weight: weight },
    };
    addRoutineList(bg);
    deselect();
  };

  const calculateBMI = () => {
    const bmi = weight / ((height / 100) * (height/ 100));
    const result = bmi.toFixed(2)
    if (bmi < 23) {
      setNotes(`${date} (${shift}): BMI ${result} (Underweight)`);
    } else if (bmi >= 30) {
      setNotes(`${date} (${shift}): BMI ${result} (Overweight/Obese)`);
    } else {
      setNotes(`${date} (${shift}): BMI ${result} (Normal)`);
    }
  };

  useMemo(() => {
    calculateBMI();
  }, [height, weight]);

  return (
    <>
      <Typography variant="h5" mb={2}>
        BMI Conditions:
      </Typography>

      <Typography>&lt;23: Underweight</Typography>
      <Typography>23-29.9: Normal</Typography>
      <Typography>&gt;=30: Overweight/Obese</Typography>

      <Stack gap={2}>
        <Typography variant="h6" mt={2}>
          Enter elderly height and weight:
        </Typography>

        <Controls.OutlinedInput
          label="Height"
          variant="standard"
          value={value.height || height}
          InputProps={{
            endAdornment: <InputAdornment position="start">cm</InputAdornment>,
          }}
          onChange={(e) => setHeight(e.target.value)}
          sx={{ ml: 2, width: "200px" }}
        />

        <Controls.OutlinedInput
          label="Weight"
          variant="standard"
          value={value.weight || weight}
          InputProps={{
            endAdornment: <InputAdornment position="start">kg</InputAdornment>,
          }}
          onChange={(e) => setWeight(e.target.value)}
          sx={{ ml: 2, width: "200px" }}
        />

        <Controls.OutlinedInput
          label="Special Notes"
          multiline
          rows={4}
          value={notes || note}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ margin: 0, my: 2 }}
        />
      </Stack>

      <Controls.Buttons
        text="Add to list"
        type="submit"
        onClick={handleAddList}
      />
    </>
  );
};
