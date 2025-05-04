import { array, number, object, string } from 'valibot';

export const categoryServiceSchema = object({
  id: number(),
  nombre: string(),
});

export const categoryServicesSchema = array(categoryServiceSchema);