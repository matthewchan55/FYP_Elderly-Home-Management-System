import { Controls } from "../../controls/Controls";
import { useState } from "react";

export const Default = ({
  routine,
  eld,
  date,
  shift,
  addRoutineList,
  deselect,
  note,
  value,
}) => {
  const [notes, setNotes] = useState("");

  const handleAddList = () => {
    const item = {
      date: date,
      routineName: routine,
      id: eld.residentID,
      status: true,
      shift: shift,
      notes: notes,
    };
    addRoutineList(item);
    deselect();
  };

  return (
    <>
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
