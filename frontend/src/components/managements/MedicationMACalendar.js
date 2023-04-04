import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const MedicationMACalendar = () => {
  return (
    <Fullcalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={"dayGridMonth"}
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth, timeGridWeek, timeGridDay",
      }}
      events={[
        { title: "Elderly: Chan PO, PO", start: "2023-04-03T10:30:00", end:   "2023-04-03T16:30:00"},
        { title: "Elderly: Chan Tai, Man", start: "2023-04-03T10:30:00", end:   "2023-04-03T16:30:00"},
        { title: "Elderly: Chan Tai, Man", date: "2023-04-04"},
        { title: "Elderly: Chan S, S", start: "2023-04-08T10:30:00", end:   "2023-04-03T16:30:00"},
        { title: "Elderly: Lam Tsz, Tsz", start: "2023-04-08T10:30:00", end:   "2023-04-08T11:30:00"},
        { title: "Elderly: Chan C, S", start: "2023-04-10T10:30:00", end:   "2023-04-10T11:30:00"},
        { title: "Elderly: Chan A, S", start: "2023-04-15T10:30:00", end:   "2023-04-15T11:30:00"},
        { title: "Elderly: Chan A, S", start: "2023-04-20T08:30:00", end:   "2023-04-20T11:30:00"},
        { title: "Elderly: Chan A, S", start: "2023-04-08T10:30:00", end:   "2023-04-08T11:30:00"},
        { title: "event 2", date: "2023-05-17" }
      ]}
      nowIndicator
    />
  );
};

export default MedicationMACalendar;
