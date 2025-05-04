import axios from "axios";
import { Appointment } from "../types/Appointment";

export const createAppointment = async (data: Appointment) => {
    try {
      const response = await axios.post('http://localhost:3000/api/appointments', data);
      return response.data; // Devuelve la cita creada
    } catch (error) {
      console.error('Error al crear la cita:', error);
      throw error; // Puedes manejar el error de otra forma si lo deseas
    }
  };     