
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import {VehicleString } from '../types/vehicle';
import { createVehicle, updateVehicle } from '../services/Vehicle';
import { getClients } from '../services/Client';

type CustomDialogProps = { 
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row?: VehicleString | null;
  onAddVehicleSuccess: () => Promise<void>;
};

type FormValues = {
  marca: string;
  modelo: string;
  patente: string;
  nroChasis: string;
  color: string;
  año: string;
  motor: string;
  clienteId: string;
};

const FormVehicle = ({ open, setOpen, row, onAddVehicleSuccess }: CustomDialogProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      marca: row?.marca || '',
      modelo: row?.modelo || '',
      patente: row?.patente || '',
      nroChasis: row?.nroChasis || '',
      color: row?.color || '',
      año: row?.año || '',
      motor: row?.motor || '',
      clienteId: row?.clienteId || '',
    }
  });

  const [isChecking, setIsChecking] = useState(false);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [clientes, setClientes] = useState<{ id: number; name: string; lastname: string; cuit: string }[]>([]);

    // Cargar datos del JSON
    useEffect(() => {
      const loadData = async () => {
        const response = await fetch('/json/vehiculos_argentinos_completo_actualizado.json'); // Ruta al archivo JSON
        const data = await response.json();
        setMarcas(data);
      };
  
      loadData();
    }, []);
  
    // Manejar cambio de marca para cargar los modelos
    const handleMarcaChange = (marca: string) => {
      const selectedMarca = marcas.find((item) => item.marca === marca);
      setModelos(selectedMarca ? selectedMarca.modelos : []);
    };

 // Resetear el formulario al cambiar entre editar y crear
 useEffect(() => {
  if (row) {
    // Si estamos editando, cargar los datos del vehículo
    reset({
      marca: row.marca,
      modelo: row.modelo,
      patente: row.patente,
      nroChasis: row.nroChasis,
      color: row.color,
      año: row.año,
      motor: row.motor,
      clienteId: row.clienteId,
    });

    handleMarcaChange(row.marca);
  } else {
    // Si estamos creando, reiniciar el formulario
    reset({
      marca: '',
      modelo: '',
      patente: '',
      nroChasis: '',
      color: '',
      año: '',
      motor: '',
      clienteId: '',
    });
    setModelos([]);
  }
}, [row, reset]);

useEffect(() => {
  const fetchClientes = async () => {
    const response = await getClients();
    if (response) {
      const mapped = response.map((client) => ({
        id: client.id,
        name: client.name,
        lastname: client.lastname,
        cuit: client.cuit,
      }));
      setClientes(mapped);
    }
  };

  fetchClientes();
}, []);

  function close() {
    setOpen(false);
    reset();
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsChecking(true); // Activar estado de carga durante el proceso

      
      if (row) {
        // Si estamos editando, actualizar vehículo
        await updateVehicle(data, row.id);
        toast.success('Vehículo actualizado con éxito');
      } else {
        // Si estamos creando un vehículo, usar la función de creación
        await createVehicle(data);
        toast.success('Vehículo creado con éxito');
      }

      onAddVehicleSuccess();
      close();
    } catch (error) {
      console.error('Error al guardar vehículo', error);
      toast.error('Ocurrió un error al guardar el vehículo');
    } finally {
      setIsChecking(false); // Desactivar estado de carga siempre que termine el proceso
    }
  };

  return (
    <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30 backdrop-blur-xs">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg backdrop-blur-2xl duration-300 ease-out">
            <DialogTitle as="h3" className="text-2xl font-semibold text-primary-contrast flex justify-between items-center mb-6">
              {row ? 'Editar Vehículo' : 'Agregar Vehículo'}
              <X className="w-7 h-7 cursor-pointer hover:text-secondary transition-colors" onClick={close}/>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
              <div className="grid grid-cols-2 gap-2"> 

                {/* Marca */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="marca" className="text-sm font-medium text-primary-contrast">
                      Marca <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="marca"
                      {...register('marca', { required: 'La marca es obligatoria' })}
                      onChange={(e) => handleMarcaChange(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecciona una marca</option>
                      {marcas.map((item) => (
                        <option key={item.marca} value={item.marca}>
                          {item.marca}
                        </option>
                      ))}
                    </select>
                    {errors.marca && <span className="text-red-500 text-xs">{errors.marca.message}</span>}
                  </div>

                  {/* Modelo */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="modelo" className="text-sm font-medium text-primary-contrast">
                      Modelo <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modelo"
                      {...register('modelo', { required: 'El modelo es obligatorio' })}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecciona un modelo</option>
                      {modelos.map((modelo, index) => (
                        <option key={index} value={modelo}>
                          {modelo}
                        </option>
                      ))}
                    </select>
                    {errors.modelo && <span className="text-red-500 text-xs">{errors.modelo.message}</span>}
                  </div>

                {/* Patente */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="patente" className="text-sm font-medium text-primary-contrast">
                    Patente <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="patente"
                    {...register('patente', { 
                      required: 'La patente es obligatoria', 
                      pattern: { value: /^[A-Z0-9]+$/, message: 'La patente solo puede contener letras y números' }
                    })}
                    placeholder="Patente"
                    className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.patente && <span className="text-red-500 text-xs">{errors.patente.message}</span>}
                </div>

                
                {/* Motor */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="motor" className="text-sm font-medium text-primary-contrast">
                    Motor <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="motor"
                    {...register('motor', { required: 'El motor es obligatorio' })}
                    placeholder="Motor"
                    className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.motor && <span className="text-red-500 text-xs">{errors.motor.message}</span>}
                </div>

                {/* Color */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="color" className="text-sm font-medium text-primary-contrast">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="color"
                    {...register('color', { 
                      required: 'El color es obligatorio', 
                      minLength: { value: 2, message: 'El color debe tener al menos 2 caracteres' },
                      maxLength: { value: 30, message: 'El color no puede tener más de 30 caracteres' }
                    })}
                    placeholder="Color"
                    className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.color && <span className="text-red-500 text-xs">{errors.color.message}</span>}
                </div>

                {/* Año */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="año" className="text-sm font-medium text-primary-contrast">
                    Año <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="año"
                    {...register('año', { 
                      required: 'El año es obligatorio', 
                      valueAsNumber: true, 
                  
                    })}
                    placeholder="Año"
                    type="number"
                    className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.año && <span className="text-red-500 text-xs">{errors.año.message}</span>}
                </div>

              </div>

              
                {/* Número de Chasis */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="nroChasis" className="text-sm font-medium text-primary-contrast">
                    Número de Chasis <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nroChasis"
                    {...register('nroChasis', { 
                      required: 'El número de chasis es obligatorio', 
                      pattern: { value: /^[A-Z0-9]+$/, message: 'El número de chasis solo puede contener letras y números' }
                    })}
                    placeholder="Número de Chasis"
                    className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.nroChasis && <span className="text-red-500 text-xs">{errors.nroChasis.message}</span>}
                </div>

              {/*Cliente*/}
              <div className="flex flex-col gap-2">
                <label htmlFor="clienteId" className="text-sm font-medium text-primary-contrast">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  id="clienteId"
                  {...register('clienteId', { required: 'El Cliente es obligatorio' })}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {`${cliente.name} ${cliente.lastname} - ${cliente.cuit}`}
                    </option>
                  ))}
                </select>
                {errors.clienteId && <span className="text-red-500 text-xs">{errors.clienteId.message}</span>}
              </div>

              {/* Botón */}
              <Button
                type="submit"
                disabled={isSubmitting || isChecking} // Desactivar el botón durante la verificación o envío
                className="rounded-md bg-primary w-full px-6 py-3 cursor-pointer text-sm font-semibold text-white hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting || isChecking ? 'Guardando...' : row ? 'Actualizar' : 'Guardar'}
              </Button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FormVehicle;
