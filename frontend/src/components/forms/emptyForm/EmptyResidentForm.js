import { Grid, Alert, AlertTitle } from "@mui/material";
import { Controls } from "../../controls/Controls";
import { useForm, Form } from "../../../hook/useForm";
import { useSubmit } from "../../../hook/useSubmit";
import useAlert from "../../../hook/useAlert";
import SmallAlert from "../../SmallAlert";

const EmptyResidentForm = ({ path }) => {
  const { newData, handleEmptyInputChanges } = useForm();
  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const genderSelection = [
    { name: "sex", value: "M", label: "M" },
    { name: "sex", value: "F", label: "F" },
    { name: "sex", value: "Not available", label: "Not available" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(path, newData, "POST");
    setOpen(true);
  };

  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={
          error
            ? "Failed - Please check your information again"
            : "Success - Added resident successfully!"
        }
      />
      <Form>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ mb: 3 }}>
            {error && (
              <Alert severity="warning">
                <AlertTitle>
                  <strong>{error}</strong>
                </AlertTitle>
                Please confirm your information
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} md={6} sx={{ mb: 3 }}>
            <Controls.OutlinedInput
              required
              label="Resident ID"
              name="residentID"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="lastName"
              label="Last Name"
              defaultValue=""
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="firstName"
              defaultValue=""
              label="First Name"
              onChange={handleEmptyInputChanges}
            />
            <Controls.Selection
              name="sex"
              label="Gender"
              defaultValue=""
              onChange={handleEmptyInputChanges}
              inputLabelName="Gender"
              items={genderSelection}
            />
            <Controls.OutlinedInput
              name="HKID"
              defaultValue=""
              label="HKID"
              onChange={handleEmptyInputChanges}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ mb: 3 }}>
            <Controls.OutlinedInput
              name="relativesName"
              defaultValue=""
              label="Relatives Name"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="relativesPhone"
              defaultValue=""
              label="Relatives Phone"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="relativesHKID"
              defaultValue=""
              label="Relatives HKID"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="relativesAddress"
              defaultValue=""
              label="Relatives Address"
              onChange={handleEmptyInputChanges}
            />
            <Controls.OutlinedInput
              name="relativesEmail"
              defaultValue=""
              label="Relatives Email"
              onChange={handleEmptyInputChanges}
            />
          </Grid>
        </Grid>
        <Controls.Buttons
          type="submit"
          text="Add new resident"
          onClick={handleSubmit}
          fullWidth
        />
      </Form>
    </>
  );
};

export default EmptyResidentForm;
