import { Form } from "../../../hook/useForm";
import { Typography, Stack, InputAdornment } from "@mui/material";
import { Controls } from "../../controls/Controls";
import useAlert from "../../../hook/useAlert";
import { useSubmit } from "../../../hook/useSubmit";
import { useState, useEffect } from "react";
import SmallAlert from "../../SmallAlert";
import { useGetOrDelete } from "../../../hook/useGetOrDelete";

const INITIAL_DATA = {
  serviceName: "",
  serviceCost: 0,
  serviceCategory: "",
};

const FinanceServiceCost = ({ service, right, setRight, fetchSc}) => {
  const [data, setData] = useState(service ? service : INITIAL_DATA);
  const [method, setMethod] = useState("");

  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();
  const { getOrDelete } = useGetOrDelete();

  function getPath() {
    return method === "POST"
      ? "/api/management/finance/servicecost"
      : "/api/management/finance/servicecost/" + service._id;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const path = getPath();
    //console.log(data)
    await submit(path, data, method);

    if (method === "PATCH") {
      setRight((prevRight) =>
        prevRight.map((item) => {
          if (item.item === service.serviceName) {
            return {
              ...item,
              item: data.serviceName,
              charge: data.serviceCost,
            };
          }
          return item;
        })
      );
    } else {
      setOpen(true);
    }
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: name === "serviceCost" ? parseFloat(value) : value,
    });
  };

  const handleDelete = async () => {
    const path = getPath();
    console.log(path);
    await getOrDelete(path, "DELETE");
    setOpen(true);
  };

  useEffect(() => {
    setData(service ? service : INITIAL_DATA);
    setMethod(service ? "PATCH" : "POST");
  }, [service]);

  return (
    <>
      <Stack p={3}>
        <Form>
          <Controls.Bold variant="h6">
            {service
              ? `Selected Items: ${service.serviceName}`
              : `Add New Service Cost`}
          </Controls.Bold>

          <Stack spacing={5} my={3}>
            <Stack>
              <Typography variant="subtitle1" color="#808191">
                Service Name
              </Typography>
              <Controls.OutlinedInput
                name="serviceName"
                variant="standard"
                value={data.serviceName}
                onChange={handleInputChanges}
                sx={{ width: "80%" }}
              />
            </Stack>
            <Stack>
              <Typography variant="subtitle1" color="#808191">
                Service Category
              </Typography>
              <Controls.Selection
                name="serviceCategory"
                value={data.serviceCategory}
                onChange={handleInputChanges}
                variant="standard"
                items={[
                  { name: "serviceCategory", value: "Basic", label: "Basic" },
                  {
                    name: "serviceCategory",
                    value: "Special",
                    label: "Special",
                  },
                  {
                    name: "serviceCategory",
                    value: "Additional",
                    label: "Additional",
                  },
                ]}
                sx={{ width: "80%" }}
              />
            </Stack>
            <Stack>
              <Typography variant="subtitle1" color="#808191">
                Service Cost
              </Typography>
              <Controls.OutlinedInput
                name="serviceCost"
                value={data.serviceCost}
                variant="standard"
                type="number"
                onChange={handleInputChanges}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position={"start"}>$</InputAdornment>
                  ),
                }}
                sx={{ width: "80%" }}
              />
            </Stack>
          </Stack>

          <Controls.Buttons
            type="submit"
            text={method === "POST" ? "Add service cost" : "Save changes"}
            onClick={handleSubmit}
          />
          {method !== "POST" && (
            <Controls.Buttons text="Delete" onClick={handleDelete} />
          )}
        </Form>
      </Stack>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={
          method === "POST"
            ? "Added new service items successfully"
            : method === "PATCH"
            ? `Update current service item - ${service.serviceName} successfully`
            : `Delete service item - ${service.serviceName}successfully`
        }
      />
    </>
  );
};

export default FinanceServiceCost;
