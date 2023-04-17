import {
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
  Box,
} from "@mui/material";
import { useState } from "react";
import { Controls } from "../../controls/Controls";

export const UrinaryCatheter = ({
  eld,
  date,
  shift,
  addRoutineList,
  deselect,
  note,
  value,
}) => {
  const [state, setState] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { stepOne, stepTwo, stepThree } = state;
  const error = [stepOne, stepTwo, stepThree].filter((v) => v).length !== 3;
  const [notes, setNotes] = useState("");

  const handleAddList = () => {
    const uc = {
      date: date,
      routineName: "Urinary catheter care",
      id: eld.residentID,
      status: true,
      shift: shift,
      notes: notes,
    };
    addRoutineList(uc);
    deselect();
  };

  return (
    <>
      <Typography variant="h6" mb={2}>Urinary catheter steps</Typography>

      <Box sx={{ display: "flex" }}>
        <FormControl
          required
          error={error}
          component="fieldset"

          variant="standard"
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stepOne}
                  onChange={handleChange}
                  name="stepOne"
                />
              }
              label=" Step 1: Cleanse urinary opening with mild soap and water"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={stepTwo}
                  onChange={handleChange}
                  name="stepTwo"
                />
              }
              label="Step 2: Empty and change drainage bag"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={stepThree}
                  onChange={handleChange}
                  name="stepThree"
                />
              }
              label="Step 3: Clean drainage bag"
            />
          </FormGroup>
          <FormHelperText>All steps are required</FormHelperText>
        </FormControl>
      </Box>
      <Controls.OutlinedInput
          label="Special Notes"
          multiline
          rows={4}
          value={notes || note}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ margin: 0, my: 2 }}
        />

      <Controls.Buttons
        text="Add to list"
        type="submit"
        onClick={handleAddList}
      />
    </>
  );
};
