import axios from "axios"; 
import { safeParse } from "valibot";
import { categoryServicesSchema } from "../types/categoryServices";


export const getCategoryServices = async () => {
    try{
    const url = "http://localhost:3000/api/typeService";
    const {data} = await axios.get(url)
    const result = safeParse( categoryServicesSchema , data)
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