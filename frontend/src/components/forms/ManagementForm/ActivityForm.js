import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import useAlert from "../../../hook/useAlert";
import { useSubmit } from "../../../hook/useSubmit";
import { Form } from "../../../hook/useForm";
import { Controls } from "../../controls/Controls";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import parseISO from "date-fns/parseISO";
import SmallAlert from "../../SmallAlert";


const INITIAL_DATA = {
  activityName: "",
  activityCategory: "",
  activityFee: "",
  activityInvolvedStaff: [],
  activityInvolvedEld: [],
  startDate: "",
  endDate: "",
  scheduled: false,
  scheduledOn: "",
  scheduledStartTime: "",
  scheduledEndTime: "",
  attendEld: "",
  absentEld: "",
  PIC: "",
  floor: "1",
  room: "",
};

const ActivityForm = ({ rowData }) => {
  const [data, setData] = useState(rowData ? rowData : INITIAL_DATA);
  const [staffData, setStaffData] = useState();
  const [eldData, setEldData] = useState();

  const [staff, setStaff] = useState([]);
  const [eld, setEld] = useState([]);

  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleCheckbox = (e) => {
    const check = e.target.checked;
    setData({ ...data, scheduled: check });
  };

  const handleChange = (event, type) => {
    const {
      target: { value },
    } = event;
    setStaff(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setData({ ...data, activityInvolvedStaff: value });
  };
  const handleEldChange = (event, type) => {
    const {
      target: { value },
    } = event;
    setEld(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setData({ ...data, activityInvolvedEld: value });
  };

  const changeFloor = (e) => {
    setData({ ...data, floor: e.target.value });
  };

  const fetchStaff = async () => {
    const resp = await fetch("/api/management/staff");
    const respData = await resp.json();

    if (resp.ok) {
      const item = respData.map((item) => {
        return {
          key: item.staffID,
          name: "activityInvolvedStaff",
          value: item.staffID,
          label: `${item.firstName}, ${item.lastName} (Staff ID: ${item.staffID})`,
        };
      });
      setStaffData(item);
    }
  };
  const fetchEld = async () => {
    const resp = await fetch("/api/management/residents");
    const respData = await resp.json();

    if (resp.ok) {
      const item = respData.map((item) => {
        return {
          key: item.residentID,
          name: "activityInvolvedEld",
          value: item.residentID,
          label: `${item.firstName}, ${item.lastName} (Resident ID: ${item.residentID})`,
        };
      });
      setEldData(item);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit("/api/management/activity", data, "POST");

    setOpen(true);
  };

  useEffect(() => {
    fetchStaff();
    fetchEld();
  }, []);

  console.log(data)
  return (
    <>
      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title={`Added activity - ${data.activityName} successfully!`}
      />
      <Form>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Controls.OutlinedInput
              name="activityName"
              label="Activity Name"
              value={data.activityName || ""}
              onChange={handleInputChanges}
            />
            <Controls.Selection
              name="activityCategory"
              label="Category"
              value={data.activityCategory}
              onChange={handleInputChanges}
              inputLabelName="Category"
              items={[
                {
                  name: "activityCategory",
                  value: "Rehabilitation",
                  label: "Rehabilitation",
                },
                {
                  name: "activityCategory",
                  value: "Recreational",
                  label: "Recreational",
                },
                {
                  name: "activityCategory",
                  value: "Educational",
                  label: "Educational",
                },
                {
                  name: "activityCategory",
                  value: "Volunteer",
                  label: "Volunteer",
                },
                {
                  name: "activityCategory",
                  value: "Handicrafts",
                  label: "Handicrafts",
                },
                {
                  name: "activityCategory",
                  value: "Outings",
                  label: "Outings",
                },
                { name: "activityCategory", value: "Others", label: "Others" },
              ]}
            />
            <Controls.OutlinedInput
              name="activityFee"
              label="Activity Fee"
              value={data.activityFee || ""}
              onChange={handleInputChanges}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {!data.scheduled ? (
                <>
                  <Controls.DateTime
                    label="Start Time"
                    value={rowData ? parseISO(data.startDate) : data.startDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        startDate: newValue,
                      });
                    }}
                  />
                  <Controls.DateTime
                    label="End Time"
                    value={rowData ? parseISO(data.endDate) : data.endDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        endDate: newValue,
                      });
                    }}
                  />
                </>
              ) : (
                <>
                  <Controls.Date
                    name="startDate"
                    label="Start Date"
                    value={rowData ? parseISO(data.startDate) : data.startDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        startDate: newValue,
                      });
                    }}
                  />
                  <Controls.Date
                    name="endDate"
                    label="End Date"
                    value={rowData ? parseISO(data.endDate) : data.endDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        endDate: newValue,
                      });
                    }}
                  />

                  <Stack direction="row" gap={1} alignItems={"center"}>
                    <Controls.Time
                      name="scheduledStartTime"
                      label="Start Time"
                      value={
                        rowData
                          ? parseISO(data.scheduledStartTime)
                          : data.scheduledStartTime
                      }
                      onChange={(newValue) => {
                        setData({
                          ...data,
                          scheduledStartTime: newValue,
                        });
                      }}
                    />
                    <Typography>-</Typography>
                    <Controls.Time
                      name="scheduledEndTime"
                      label="End Time"
                      value={
                        rowData
                          ? parseISO(data.scheduledEndTime)
                          : data.scheduledEndTime
                      }
                      onChange={(newValue) => {
                        setData({
                          ...data,
                          scheduledEndTime: newValue,
                        });
                      }}
                    />
                  </Stack>

                  <Controls.Selection
                    disabled={!data.scheduled}
                    name="scheduledOn"
                    label="Recurring On"
                    value={data.scheduledOn}
                    onChange={handleInputChanges}
                    inputLabelName="Recurring On"
                    items={[
                      { name: "scheduledOn", value: 1, label: "Mon" },
                      { name: "scheduledOn", value: 2, label: "Tue" },
                      { name: "scheduledOn", value: 3, label: "Wed" },
                      { name: "scheduledOn", value: 4, label: "Thur" },
                      { name: "scheduledOn", value: 5, label: "Fri" },
                      { name: "scheduledOn", value: 6, label: "Sat" },
                      { name: "scheduledOn", value: 7, label: "Sun" },
                    ]}
                  />
                </>
              )}
            </LocalizationProvider>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.scheduled}
                  onChange={handleCheckbox}
                  value={data.scheduled || ""}
                />
              }
              label="Recurring events"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controls.OutlinedInput
              name="PIC"
              label="PIC"
              value={data.PIC || ""}
              onChange={handleInputChanges}
            />
            <Controls.Selection
              name="floor"
              label="Floor"
              defaultValue="1"
              inputLabelName="Floor"
              items={[
                { name: "floor", value: "1", label: "1/F" },
                { name: "floor", value: "2", label: "2/F" },
                { name: "floor", value: "3", label: "3/F" },
              ]}
              onChange={changeFloor}
            />
            <Controls.OutlinedInput
              name="room"
              label="Room"
              value={data.room || ""}
              onChange={handleInputChanges}
            />

            <FormControl sx={{ m: 1, width: "80%" }}>
              <InputLabel id="staff-select">Select staff(s)</InputLabel>
              <Select
                labelId="staff-select"
                multiple
                value={staff}
                input={<OutlinedInput label="Select staff(s)" />}
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: { style: { maxHeight: 250, maxWidth: 300 } },
                }}
              >
                {staffData &&
                  staffData.map((item) => (
                    <MenuItem
                      key={item.key}
                      name={item.name}
                      value={item.value}
                    >
                      <Checkbox checked={staff.indexOf(item.value) > -1} />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: "80%" }}>
              <InputLabel id="eld-select">Select resident(s)</InputLabel>
              <Select
                labelId="eld-select"
                multiple
                value={eld}
                input={<OutlinedInput label="Select resident(s)" />}
                onChange={handleEldChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: { style: { maxHeight: 250, maxWidth: 300 } },
                }}
              >
                {eldData &&
                  eldData.map((item) => (
                    <MenuItem
                      key={item.key}
                      name={item.name}
                      value={item.value}
                    >
                      <Checkbox checked={eld.indexOf(item.value) > -1} />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Controls.Buttons
            type="submit"
            text="Save changes"
            onClick={handleSubmit}
          />
        </Grid>
      </Form>
    </>
  );
};

export default ActivityForm;
