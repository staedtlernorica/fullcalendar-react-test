import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'

let x = []

export default class DemoApp extends React.Component {

  state = {
    weekendsVisible: true,
    currentEvents: []
  }
  
  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}

            initialEvents={this.state.eventData}


            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          />
        </div>
      </div>
    )
  }


  getData() {
    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;

    // Open (or create) the database
    const request = indexedDB.open("CarsDatabase", 1);

    request.onsuccess = function (event) {

      const db = request.result;
      const transaction = db.transaction("cars", "readonly");
      const store = transaction.objectStore("cars");

      const subaru = store.getAll();

      subaru.onsuccess = function () {
        console.log(subaru.result)
        console.log(typeof(subaru.result))

        // calendar.render()

        return(subaru.result)
      };
    }
  }


  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  saveEvent(e) {

    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;

    // Open (or create) the database
    const request = indexedDB.open("CarsDatabase", 1);

    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    // Create the schema on create and version upgrade
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("cars", { keyPath: "id" });

    };

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("cars", "readwrite");

      const store = transaction.objectStore("cars");

      // Add some data
      store.put(e);

      console.log(store.getAll())

      transaction.oncomplete = function () {
        db.close();
      };
    };

  }

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {

      // SHOW NEWLY CREATED EVENT ON CALENDAR
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })


      // SAVE NEWLY CREATED EVENT TO INDEXEDDB
      this.saveEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

