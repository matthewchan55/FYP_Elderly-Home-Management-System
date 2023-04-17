import { Typography, InputAdornment, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { Controls } from "../../controls/Controls";

export const BloodGlucose = ({
  eld,
  date,
  shift,
  addRoutineList,
  deselect,
  note,
  value,
}) => {
  const [bloodGlucose, setBloodGlucose] = useState(0);
  const [testType, setTestType] = useState("Fasting");
  const [notes, setNotes] = useState("");

  const handleAddList = () => {
    const bg = {
      date: date,
      routineName: "Blood glucose measurement",
      id: eld.residentID,
      status: true,
      shift: shift,
      notes: notes,
      value: { "Test Type": testType, "Blood Glucose": bloodGlucose },
    };
    addRoutineList(bg);
    deselect();
  };

  const calculateBloodGlucose = () => {
    if (testType === "Fasting" && bloodGlucose >= 100 && bloodGlucose <= 125) {
      setNotes(
        `${date} (${shift}): ${testType}: ${bloodGlucose}mg/dL (Pre-diabetic condition)`
      );
    } else if (testType === "Fasting" && bloodGlucose > 125) {
      setNotes(
        `${date} (${shift}): Diabetes confirmed. Please schedule for a doctor arrangement`
      );
    } else if (testType === "Random" && bloodGlucose > 200) {
      setNotes(
        `${date} (${shift}): Diabetes confirmed. Please schedule for a doctor arrangement`
      );
    } else {
      setNotes(`${date} (${shift}):  ${bloodGlucose}mg/dL (${testType})`);
    }
  };

  useMemo(() => {
    calculateBloodGlucose();
  }, [bloodGlucose, testType]);

  return (
    <>
      <Typography variant="h5" mb={2}>
        Diabetes Conditions:
      </Typography>
      <Typography variant="h6">
        Random blood sugar test: &gt;200mg/dL
      </Typography>
      <Typography variant="h6">
        Fasting blood sugar test: &gt;100mg/dL; &gt;125mg/dL = Diabetes
      </Typography>
      <Stack gap={2}>
        <Typography variant="h6" mt={2}>
          Enter elderly blood glucose readings:
        </Typography>

        <Controls.Selection
          label="Blood sugar test"
          value={value.type || testType}
          onChange={(e) => setTestType(e.target.value)}
          variant="standard"
          items={[
            {
              name: "testType",
              value: "Fasting",
              label: "Fasting",
            },
            {
              name: "testType",
              value: "Random",
              label: "Random",
            },
          ]}
          sx={{ ml: 2, width: "200px" }}
        />
        <Controls.OutlinedInput
          label="Blood sugar"
          variant="standard"
          value={value.bloodGlucose || bloodGlucose}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">mg/dL</InputAdornment>
            ),
          }}
          onChange={(e) => setBloodGlucose(e.target.value)}
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
