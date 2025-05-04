import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVehicle } from '../services/Vehicle';
import { VehicleString } from '../types/vehicle';
import { getCategoryServices } from '../services/CategoryServices';
import { createAppointment } from '../services/Appointment';

type CustomDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormValues = {
  vehicleId?: number;
  marca: string;
  modelo: string;
  patente: string;
  nroChasis: string;
  color: string;
  año: string;
  motor: string;
  clienteId: string;
  date: string;
  hora?: string;
  status: string;
  tipoServicio?: string[];
  newClientName?: string;
  newClientLastname?: string;
  newClientCuit?: string;
};

const FormAppointment = ({ open, setOpen }: CustomDialogProps) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      marca: '',
      modelo: '',
      patente: '',
      nroChasis: '',
      color: '',
      año: '',
      motor: '',
      clienteId: '',
      date: '',
      hora: '',
      status: 'pendiente',
      tipoServicio: [],
    }
  });

  const [isChecking, setIsChecking] = useState(false);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<VehicleString[]>([]);
  const [selectedClient, setSelectedClient] = useState<VehicleString | null>(null);
  const [servicios, setServicios] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/json/vehiculos_argentinos_completo_actualizado.json');
      const data = await response.json();
      setMarcas(data);
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await getVehicle();
      if (response) setClientes(response);
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
      const data = await getCategoryServices();
      if (data) setServicios(data);
    };

    fetchServicios();
  }, []);

  const close = () => {
    setOpen(false);
    reset();
    setSelectedClient(null);
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.vehicleId) {
      console.error('vehicleId es undefined');
      return;
    }

    // Convertir nombres de servicios a sus IDs
    const tipoServicioIds = servicios
      .filter(s => data.tipoServicio?.includes(s.nombre))
      .map(s => s.id);

    const requestData = {
      vehicleId: data.vehicleId,
      hora: data.hora!,
      date: data.date,
      status: data.status,
      tipoServicioIds,
    };

    try {
      const appointment = await createAppointment(requestData);
      console.log('Cita creada:', appointment);
      close();
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const selected = clientes.find((client) => client.id.toString() === clientId);
    setSelectedClient(selected || null);
    setValue('clienteId', clientId);

    if (selected?.id) {
      setValue('vehicleId', selected.id); // ✅ Registrar el vehicleId en el form
    }
  };

  return (
    <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30 backdrop-blur-xs">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg backdrop-blur-2xl duration-300 ease-out">
            <DialogTitle as="h2" className="text-2xl font-semibold text-primary-contrast flex justify-between items-center mb-6">
              Agendar Turno
              <X className="w-7 h-7 cursor-pointer hover:text-secondary transition-colors" onClick={close} />
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-primary mb-2'>Datos del Cliente</h3>
                    <label className="text-sm">Cliente</label>
                    <select
                      {...register('clienteId', { required: 'Selecciona un cliente' })}
                      onChange={handleClientChange}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm"
                    >
                      <option value="">Selecciona un cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cliente.name} {c.cliente.lastname} {c.cliente.cuit}
                        </option>
                      ))}
                    </select>
                    {errors.clienteId && <span className="text-red-500 text-xs">{errors.clienteId.message}</span>}
                  </div>

                  <div>
                    <h3 className='text-primary mb-2'>Datos del Vehículo</h3>
                    <div>
                      <label className="text-sm">Marca</label>
                      <input
                        type="text"
                        value={selectedClient?.marca || ''}
                        readOnly
                        className="w-full rounded-md border border-gray-300 p-3 text-sm"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-sm">Modelo</label>
                      <input
                        type="text"
                        value={selectedClient?.modelo || ''}
                        readOnly
                        className="w-full rounded-md border border-gray-300 p-3 text-sm"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-sm">Motor</label>
                      <input
                        type="text"
                        value={selectedClient?.motor || ''}
                        readOnly
                        className="w-full rounded-md border border-gray-300 p-3 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <h3 className='text-primary mb-2'>Datos del Turno</h3>
                    <div>
                      <label className="text-sm">Fecha</label>
                      <input
                        type="date"
                        {...register('date', { required: 'Selecciona una fecha' })}
                        className="w-full rounded-md border border-gray-300 p-3 text-sm"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-sm">Hora</label>
                      <input
                        type="time"
                        {...register('hora', { required: 'Selecciona una hora' })}
                        className="w-full rounded-md border border-gray-300 p-3 text-sm"
                      />
                      {errors.hora && <span className="text-red-500 text-xs">{errors.hora.message}</span>}
                    </div>

                    <div className="mt-4">
                      <label className="text-sm block mb-2">Tipo de servicio</label>
                      <div className="grid grid-cols-2 gap-2">
                        {servicios.map((service) => (
                          <label key={service.nombre} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              value={service.nombre}
                              {...register('tipoServicio', { required: 'Selecciona al menos un servicio' })}
                            />
                            {service.nombre}
                          </label>
                        ))}
                      </div>
                      {errors.tipoServicio && <span className="text-red-500 text-xs">{errors.tipoServicio.message}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isChecking}
                className="rounded-md bg-primary cursor-pointer w-full px-6 py-3 text-sm font-semibold text-white hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting || isChecking ? 'Guardando...' : 'Guardar Turno'}
              </Button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FormAppointment;
