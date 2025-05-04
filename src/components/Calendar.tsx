import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import "../style.css"
import FormAppointment from './FormAppointment';
import esLocale from '@fullcalendar/core/locales/es';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [open , setOpen] = useState<boolean>(false)


  useEffect(() => {
    axios.get('http://localhost:3000/api/appointments')
      .then((response) => {
        console.log("📦 Datos recibidos:", response.data); // Debug
  
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
  
        const apiEvents = response.data
          .filter((appointment: any) => {
            const appointmentDate = new Date(appointment.date);
            return (
              appointmentDate.getMonth() === currentMonth &&
              appointmentDate.getFullYear() === currentYear
            );
          })
          .map((appointment: any) => {
            // Concatenamos fecha y hora con seguridad
            const fullDateTimeString = `${appointment.date}T${appointment.hora}:00`; // HH:mm:ss
            const startDateTime = new Date(fullDateTimeString);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
  
            console.log("🗓️ Evento:", {
              id: appointment.id,
              title: `${appointment.vehicle?.marca || 'Sin marca'} ${appointment.vehicle?.modelo || ''}`,
              start: startDateTime.toISOString(),
              end: endDateTime.toISOString()
            });
  
            return {
              id: appointment.id,
              title: `${appointment.vehicle?.marca || 'Marca desconocida'} ${appointment.vehicle?.modelo || ''} - ${appointment.vehicle?.patente || ''} - ${appointment.vehicle?.cliente?.name || 'Nombre'} ${appointment.vehicle?.cliente?.lastname || 'Apellido'}`,
              start: startDateTime.toISOString(),
              end: endDateTime.toISOString(),
              color: '#2ba84a',
              backgroundColor: '#A8E6A1',
              status: appointment.status,
            };
          });
  
        setEvents(apiEvents);
      })
      .catch((error) => {
        console.error("❌ Error fetching appointments:", error);
      });
  }, []);
  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Título del evento');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    const updatedEvents = events.map((event) =>
      event.id === dropInfo.event.id
        ? {
            ...event,
            start: dropInfo.event.startStr,
            end: dropInfo.event.endStr,
          }
        : event
    );
    setEvents(updatedEvents);
  };

  
  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl max-w-6xl mx-auto ">
      <div className='flex justify-between p-4'>
      <h2 className="text-4xl font-semibold  text-primary-contrast">Turnos Dados</h2>

        {/* Botón agregado */}
        <div className="flex mb-4">
          <button
            className="bg-primary items-center text-body hover:bg-secondary text-[14px] font-medium px-8 py-2 cursor-pointer uppercase rounded-3xl flex gap-2"
            onClick={()=>setOpen(true)}
            >
            <img src="/plus.svg" className="text-white items-center" alt="Agregar" width={20} height={20} />
            Agregar Turnos
          </button>
        </div>
      </div>
     
      {/* Modal con el formulario */}
      <FormAppointment
        open={open}
        setOpen={setOpen} // Función para cerrar el modal
      />

      <div className="overflow-x-auto w-full h-[80vh]">
        <FullCalendar
          key={JSON.stringify(events)}  // Esto forzará un re-render cuando los eventos cambien
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"  // Cambié esto a la vista de mes
          events={events}
          height="100%"  // Ajustar el alto del calendario para que ocupe el espacio disponible
          eventTextColor="#000"  // Color del texto de los eventos
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',  // Asegúrate de que los controles de vista sean correctos
          }}
          editable={true}
          selectable={true}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          nowIndicator={true}
          locale={esLocale}
        />
      </div>
    </div>
  );
};

export default Calendar;
