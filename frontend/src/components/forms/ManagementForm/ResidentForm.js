import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import { useState } from "react";
import { Controls } from "../../controls/Controls";
import SmallAlert from "../../SmallAlert";
import useAlert from "../../../hook/useAlert";
import useMultiStepForm from "../../../hook/useMultiStepForm";
import ResidentElderly from "./ResidentElderly";
import ResidentRelatives from "./ResidentRelatives";
import ResidentRoom from "./ResidentRoom";
import { useSubmit } from "../../../hook/useSubmit";

const INITIAL_DATA = {
  residentID: "",
  lastName: "",
  firstName: "",
  sex: "",
  HKID: "",
  active: true,
  age: "",
  height: "",
  weight: "",
  address: "",
  relativesName: "",
  relativesPhone: "",
  relativesHKID: "",
  relativesAddress: "",
  residentEmail: "",
  floor: "",
  zone: "",
  room: "",
  bed: "",
};

const ResidentForm = ({ path, method, rowData }) => {
  const [data, setData] = useState(rowData ? rowData : INITIAL_DATA);
  const [complete, setComplete] = useState(false);
  const { open, setOpen, handleClose } = useAlert();
  const { submit, error, setError } = useSubmit();

  const stepLabel = [
    "Elderly Information",
    "Relatives Information",
    "Room Information",
  ];

  const reset = () => {
    goTo(0);
    setComplete(false);
    setError(null);
    setData(null);
  };

  function updateField(INITIAL_DATA) {
    setData((prev) => {
      return { ...prev, ...INITIAL_DATA };
    });
  }

  const { currentStepIndex, step, next, back, goTo, isLastStep } =
    useMultiStepForm([
      <ResidentElderly {...data} method={method} updateField={updateField} />,
      <ResidentRelatives {...data} updateField={updateField} />,
      <ResidentRoom {...data} updateField={updateField} />,
    ]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!isLastStep) return next();

    await submit(path, data, method);

    setOpen(true);
    setComplete(true);
    updateFacility(data.floor, data.room, data.bed);
  }

  async function updatePrev(nfloor, nroom, nbed) {
    const { floor, room, bed } = rowData;
    if (nfloor === floor && nroom === room && nbed === bed) return;

    await fetch(
      `/api/management/facility/bed?roomFloor=${floor}&roomName=${room}&roomNumber=${bed}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedInUse: false }),
      }
    );
  }

  async function updateNew(nfloor, nroom, nbed) {
    await fetch(
      `/api/management/facility/bed?roomFloor=${nfloor}&roomName=${nroom}&roomNumber=${nbed}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedInUse: true }),
      }
    );
  }

  const updateFacility = async (nfloor, nroom, nbed) => {
    //const [prevResult, newResult]=
    rowData
      ? await Promise.allSettled([
          updatePrev(nfloor, nroom, nbed),
          updateNew(nfloor, nroom, nbed),
        ])
      : updateNew(nfloor, nroom, nbed);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={currentStepIndex} sx={{ mb: 2, mt: 1 }}>
        {stepLabel.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>
            <strong>{error}</strong>
          </AlertTitle>
          Please confirm your information
        </Alert>
      )}

      <form autoComplete="off" onSubmit={onSubmit}>
        {step}
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Button
            color="inherit"
            disabled={currentStepIndex === 0}
            onClick={back}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />

          {!complete ? (
            <Button
              disabled={currentStepIndex === stepLabel.length - 1}
              color="inherit"
              type="submit"
            >
              {"Next"}
            </Button>
          ) : (
            method === "POST" && (
              <Button color="inherit" onClick={reset}>
                {error ? "Reset" : "Add more residents"}
              </Button>
            )
          )}
        </Box>
        {isLastStep && (
          <Controls.Buttons
            type="submit"
            text={method === "POST" ? "Add new residents" : "Save changes"}
            fullWidth
          />
        )}
      </form>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={
          error
            ? "Failed - Please check your information again"
            : method === "POST"
            ? "Success - Added resident successfully!"
            : "Update successfully!"
        }
      />
    </Box>
  );
};

export default ResidentForm;
