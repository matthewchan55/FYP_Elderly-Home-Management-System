import { Form, useForm } from "../../../hook/useForm";
import { Typography, Stack } from "@mui/material";
import { Controls } from "../../controls/Controls";
import useAlert from "../../../hook/useAlert";
import { useSubmit } from "../../../hook/useSubmit";
import { useState } from "react";

const FinanceServiceCost = ({ service }) => {
  const { userData, handleInputChanges } = useForm("");
  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);
  };

  console.log(service);

  return (
    <Stack p={3}>
      <Form>
        <Controls.Bold variant="h6">{`Selected Items: ${service.serviceName}`}</Controls.Bold>

        <Stack spacing={2} my={3}>
          <Stack>
            <Typography variant="subtitle1" color="#808191">
              Service Name
            </Typography>
            <Controls.OutlinedInput
              name="serviceName"
              value={service.serviceName}
              onChange={handleInputChanges}
              sx={{ width: "80%" }}
            />
          </Stack>
          <Stack>
            <Typography variant="subtitle1" color="#808191">
              Service Category
            </Typography>
            <Controls.OutlinedInput
              name="serviceCategory"
              value={service.serviceCategory}
              onChange={handleInputChanges}
              sx={{ width: "80%" }}
            />
          </Stack>
          <Stack>
            <Typography variant="subtitle1" color="#808191">
              Service Cost
            </Typography>
            <Controls.OutlinedInput
              name="serviceCost"
              value={service.serviceCost}
              onChange={handleInputChanges}
              sx={{ width: "80%" }}
            />
          </Stack>
        </Stack>

        <Controls.Buttons
          type="submit"
          text="Save changes"
          onClick={handleSubmit}
        />
      </Form>
    </Stack>
  );
};

export default FinanceServiceCost;
