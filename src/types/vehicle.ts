import { array, InferOutput, number, object, string } from "valibot"


export const VehicleSchema = object({
    marca: string(),
    modelo: string(),
    patente: string(),
    nroChasis: string(),
    color: string(),
    año: number(),
    motor : string(),
    clienteId : number(),
})

export const Vehicle = object({
    id : number(),
    marca: string(),
    modelo: string(),
    patente: string(),
    nroChasis: string(),
    color: string(),
    año: number(),
    motor : string(),
    clienteId : number(),
    cliente: object({
        name: string(),
        lastname: string(),
      }),
})

export const VehicleString = object({
    id : number(),
    marca: string(),
    modelo: string(),
    patente: string(),
    nroChasis: string(),
    color: string(),
    año: string(),
    motor : string(),
    clienteId : string(),
    cliente: object({
        name: string(),
        lastname: string(),
      }),
})

export const VehiclesSchema = array(Vehicle) 

export type ClientsType = InferOutput<typeof VehiclesSchema>
export type Vehicle = InferOutput<typeof Vehicle>
export type VehicleString = InferOutput<typeof VehicleString>