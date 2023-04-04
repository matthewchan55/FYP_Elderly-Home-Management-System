import { useState } from "react";
import useAlert from "../../../hook/useAlert";
import { useSubmit } from "../../../hook/useSubmit";
import {Form} from "../../../hook/useForm"

import { Grid } from "@mui/material";
import { Controls } from "../../controls/Controls";

const INITIAL_DATA = {
  activityName: "",
  activityCategory: "",
  activityFee: "",
  activityInvolvedStaff: "",
  activityInvolvedEld: "",
  startDate: "",
  endDate: "",
  scheduled: false,
  scheduledOn: "",
  scheduledStartTime: "",
  scheduledEndTime: "",
  attendEld: "",
  absentEld: "",
  PIC: "",
  floor: "",
  room: "",
};

const ActivityForm = ({ rowData }) => {
  const [data, setData] = useState(rowData ? rowData : INITIAL_DATA);

  const { open, setOpen, handleClose } = useAlert();
  const { submit, error } = useSubmit();

  const handleInputChanges = (e) => {
    const {name, value} = e.target;
    setData({
        ...data, 
        [name]: value
    })
  }

  
  return (
    <Form>
      <Grid container>
        <Grid item xs={12} md={6}>
            <Controls.OutlinedInput
                name="activityName"
                label="Activity Name"
                value={data.activityName || ''}
                onChange={handleInputChanges}
            />
        </Grid>


        <Grid item xs={12} md={6}>

        </Grid>
      </Grid>
    </Form>
  );
};

export default ActivityForm;
