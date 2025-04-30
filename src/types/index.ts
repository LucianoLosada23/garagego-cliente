import {object , array, string, boolean, InferOutput, number} from "valibot"

export const ClientSchema = object({
    cuit: string(),
    name: string(),
    lastname: string(),
    email: string(),
    phone: string(),
})


export const Client = object({
    id : number(),
    cuit: string(),
    name: string(),
    lastname: string(),
    email: string(),
    phone: string(),
    isActive: boolean(),
})


export const ClientsSchema = array(Client) 

export type ClientsType = InferOutput<typeof ClientsSchema>
export type Client = InferOutput<typeof Client>