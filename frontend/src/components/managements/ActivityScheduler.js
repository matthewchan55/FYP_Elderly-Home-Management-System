import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import moment from "moment";

const ActivityScheduler = ({data, fetch}) => {
    const [events, setEvents] = useState();

    const eventsTransform = (d) => {

        const color = new Map([
            ['Rehabilitation', 'red'],
            ['Recreational', 'orange'],
            ['Educational', 'green'],
            ['Volunteer', 'purple'],
            ['Handicrafts', 'pink'],
            ['Outings', ''],
            ['Others', 'blue']
        ])

        const result = d.reduce(
            (acc, {activityName, activityCategory, startDate, endDate, scheduled, scheduledOn, scheduledStartTime, scheduledEndTime}) => {
                if(scheduled){
                    
                    acc.push({daysOfWeek: [`${scheduledOn}`], title: `${activityName} - ${activityCategory}`, startTime: moment.utc(scheduledStartTime).format("HH:mm:ss"), endTime: moment.utc(scheduledEndTime).format("HH:mm:ss"), startRecur: startDate.substring(0,10), endRecur: endDate.substring(0,10), color: color.get(activityCategory)
                
                    })
                } else {
                    acc.push({title: `${activityName} - ${activityCategory}`, start: startDate, end: endDate, color: color.get(activityCategory)})
                }
                return acc
            }, []
        )
        setEvents(result)
    }
  
    useEffect(() => {
      eventsTransform(data)
    }, [data])

  return (
    <Fullcalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={"dayGridMonth"}
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth, timeGridWeek, timeGridDay",
      }}
      events={events}
      nowIndicator
    />
  );
};

export default ActivityScheduler;
