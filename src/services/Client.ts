import axios from "axios"; 
import { safeParse } from "valibot";
import { Client, ClientSchema, ClientsSchema} from "../types";

type ClientData = {
  [k: string]: FormDataEntryValue;
};


export const getClients = async () => {
    try{
    const url = "http://localhost:3000/api/clients";
    const {data} = await axios.get(url)
    const result = safeParse( ClientsSchema , data)
    if(result.success){
        return result.output
      }else {
        // Si la validación falla, lanza un error con un mensaje personalizado
        throw new Error("Hubo un error");
      }
    } catch (error) {
      console.log(error)
    }
}

export const checkCuitExists = async (cuit: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/check-cuit/${cuit}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Error al verificar el CUIT', error);
    return false;  // Si ocurre un error, asumimos que el CUIT no existe
  }
};

export const createClient = async (data: ClientData) => {
  try{
    const result = safeParse(ClientSchema, data)
    if(result.success){
      const url = "http://localhost:3000/api/clients";
      await axios.post(url, result.output)
    }else{
      throw new Error("Datos No Válidos");
    }
  }catch (error) {
    console.log(error)
  }
}


export const updateClient = async (data : ClientData , id : Client["id"]) => {
  try {
    const result = safeParse(ClientSchema, data)
    if(result.success){
      const url = `http://localhost:3000/api/clients/${id}`;
      await axios.put(url, result.output)
    }
  } catch (error) {
    console.log(error)
  }
}