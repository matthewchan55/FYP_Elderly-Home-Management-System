import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useState, useEffect } from "react";

const MedicationMedicalAppointment = ({ eld }) => {
  const [event, setEvent] = useState();
  const [todayEvent, setTodayEvent] = useState();

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0"); 
  const today = `${year}-${month}-${day}`;

  const groupAppointmentEvents = (data) => {
    const color = new Map([
      ["UCH", "purple"],
      ["HHH", "orange"],
      ["TKOH", "green"],
      ["KH", "red"],
      ["KWH", "pink"],
      ["QEH", "blue"],
      ["HKEH", ""],
    ]);

    const result = data.reduce((acc, item) => {
      const maInfo = item.medicalAppointmentInfo.map((info) => {
        const record = {
          title: `${info.place}(${info.subject}) - ${item.lastName}, ${item.firstName}`,
          start: info.start,
          end: info.end,
          color: color.get(info.place)
        };
        return record;
      });
      return [...acc, ...maInfo];
    }, []);
    //return result
    setEvent(result);

    const todayEvent = result.filter((item) => item.start.slice(0,10) === today)
    setTodayEvent(todayEvent)
  };

  useEffect(() => {
    groupAppointmentEvents(eld);
  }, []);

  return (
    // add cards on top of calendar showing today event
    <Fullcalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={"timeGridWeek"}
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth, timeGridWeek, timeGridDay",
      }}
      events={event}
      nowIndicator
      height={650}
      slotMinTime= '08:00:00'
      slotMaxTime= '21:00:00'
      slotDuration={'00:15:00'}
      allDaySlot={false}
    />
  );
};

export default MedicationMedicalAppointment;
