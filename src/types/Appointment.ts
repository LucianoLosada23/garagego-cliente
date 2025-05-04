import { array, InferOutput, number, object, string } from 'valibot'

export const AppointmentRequest = object({
    vehicleId: number(),
    hora: string(),
    date: string(),
    status: string(),
    tipoServicioIds: array(number())
})

export type Appointment = InferOutput<typeof AppointmentRequest>