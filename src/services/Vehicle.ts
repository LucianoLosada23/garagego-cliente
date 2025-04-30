import axios from "axios"; 
import { safeParse } from "valibot";
import { Vehicle, VehicleSchema, VehiclesSchema} from "../types/vehicle";


type  VehicleData = {
  [k: string]: FormDataEntryValue;
};


export async function getMarcas() {
  try {
    const url = "/json/vehiculos_argentinos_completo_actualizado.json"
    const { data } = await axios.get(url);
    return data
  } catch (error) {
    console.error('Error al obtener los datos del vehículo:', error);
  }
} 

export const getVehicle = async () => {
  try {
    const url = "http://localhost:3000/api/vehicles";
    const { data } = await axios.get(url);
    const result = safeParse(VehiclesSchema, data);

    if (result.success) {
      // Convertir 'año' y 'clienteId' a cadenas
      const modifiedData = result.output.map((vehicle: any) => ({
        ...vehicle,
        año: String(vehicle.año), // Convertir 'año' a cadena
        clienteId: String(vehicle.clienteId), // Convertir 'clienteId' a cadena
      }));

      return modifiedData;
    } else {
      // Si la validación falla, lanza un error con un mensaje personalizado
      throw new Error("Hubo un error");
    }
  } catch (error) {
    console.log(error);
  }
};

export const createVehicle = async (data: VehicleData) => {
  try {
    // Convertir los valores de 'año' y 'clienteId' a número
    const sanitizedData = {
      ...data,
      año: data.año ? Number(data.año) : 0,  // Asegurarse de que 'año' sea un número
      clienteId: data.clienteId ? Number(data.clienteId) : 0,  // Asegurarse de que 'clienteId' sea un número
    };

    const result = safeParse(VehicleSchema, sanitizedData);
    if (result.success) {
      const url = "http://localhost:3000/api/vehicles";
      await axios.post(url, result.output);
    } else {
      throw new Error("Datos No Válidos");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateVehicle = async (data : VehicleData, id : Vehicle["id"]) => {
  console.log(data, id)
  try {
    const sanitizedData = {
      ...data,
      año: data.año ? Number(data.año.toString()) : 0, // Convertir 'año' a número
      clienteId: data.clienteId ? Number(data.clienteId.toString()) : 0, // Convertir 'clienteId' a número
    };
    const result = safeParse(VehicleSchema, sanitizedData)
    if(result.success){
      const url = `http://localhost:3000/api/vehicles/${id}`;
      await axios.put(url, result.output)
    }
  } catch (error) {
    console.log(error)
  }
}