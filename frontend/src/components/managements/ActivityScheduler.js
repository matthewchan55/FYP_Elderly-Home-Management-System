import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import moment from "moment";
import {  Stack } from "@mui/material";
import Popup from "../Popup";
import ActivityForm from "../forms/ManagementForm/ActivityForm";
import { Controls } from "../controls/Controls";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const ActivityScheduler = ({ data, fetch }) => {
  const [events, setEvents] = useState();
  const [openActivityPopup, setOpenActivityPopup] = useState(false);

  const eventsTransform = (data) => {
    const color = new Map([
      ["Rehabilitation", "red"],
      ["Recreational", "orange"],
      ["Educational", "green"],
      ["Volunteer", "purple"],
      ["Handicrafts", "pink"],
      ["Outings", ""],
      ["Others", "blue"],
    ]);

    const result = data.reduce(
      (
        acc,
        {
          activityName,
          activityCategory,
          startDate,
          endDate,
          scheduled,
          scheduledOn,
          scheduledStartTime,
          scheduledEndTime,
        }
      ) => {
        if (scheduled) {
          acc.push({
            daysOfWeek: [`${scheduledOn}`],
            title: `${activityName} - ${activityCategory}`,
            startTime: moment.utc(scheduledStartTime).format("HH:mm:ss"),
            endTime: moment.utc(scheduledEndTime).format("HH:mm:ss"),
            startRecur: startDate.substring(0, 10),
            endRecur: endDate.substring(0, 10),
            color: color.get(activityCategory),
          });
        } else {
          acc.push({
            title: `${activityName} - ${activityCategory}`,
            start: startDate,
            end: endDate,
            color: color.get(activityCategory),
          });
        }
        return acc;
      },
      []
    );
    setEvents(result);
  };

  useEffect(() => {
    fetch();
  }, [openActivityPopup]);

  useEffect(() => {
    eventsTransform(data);
  }, [data]);

  return (
    <>
      <Popup
        title="Add an activity"
        open={openActivityPopup}
        setOpen={setOpenActivityPopup}
        hideBackdrop
      >
        <ActivityForm />
      </Popup>

      <Stack direction="row" alignItems={"center"}mb={3} gap={1}>
      <EventAvailableIcon sx={{ fontSize: 30, justifyContent: "center" }} />
        <Controls.Bold flexGrow={1} variant="h5">Activity Overview</Controls.Bold>
        <Controls.Buttons
          text="Add an activity"
          size="large"
          onClick={() => setOpenActivityPopup(true)}
        />
      </Stack>

      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        events={events}
        height={800}
        dayMaxEventRows={3}
        nowIndicator
      />
    </>
  );
};

export default ActivityScheduler;
