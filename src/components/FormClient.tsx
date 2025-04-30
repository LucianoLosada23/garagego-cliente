import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Client } from '../types';
import { X } from 'lucide-react';
import { checkCuitExists, createClient, updateClient } from '../services/Client';  // Asegúrate de tener la función `updateClient`
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

type CustomDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row?: Client | null;
  onAddClientSuccess: () => Promise<void>
};

type FormValues = {
  cuit: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
};

const FormClient = ({ open, setOpen, row ,onAddClientSuccess }: CustomDialogProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      cuit: row?.cuit || '',
      name: row?.name || '',
      lastname: row?.lastname || '',
      email: row?.email || '',
      phone: row?.phone || '',
    }
  });

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (row) {
      // Si estamos editando, cargar los datos del cliente
      reset({
        cuit: row.cuit,
        name: row.name,
        lastname: row.lastname,
        email: row.email,
        phone: row.phone,
      });
    } else {
      // Si estamos creando, reiniciar el formulario
      reset({
        cuit: '',
        name: '',
        lastname: '',
        email: '',
        phone: '',
      });
    }
  }, [row, reset]);

  function close() {
    setOpen(false);
    reset();
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsChecking(true); // Activar estado de carga durante la verificación

      // Verificar si el CUIT ya existe
      const cuitExists = await checkCuitExists(data.cuit);

      if (cuitExists && data.cuit !== row?.cuit) {  // Si el CUIT ya existe y no es el mismo que el actual
        toast.error('El CUIT ya está registrado');
        setIsChecking(false); // Desactivar estado de carga
        return;
      }

      if (row) {
        // Si estamos editando, actualizar cliente
        await updateClient( data , row.id,);
        toast.success('Cliente actualizado con éxito');
      } else {
        // Si estamos creando un cliente, usar la función de creación
        await createClient(data);
        toast.success('Cliente creado con éxito');
      }
      onAddClientSuccess();
      close();
    } catch (error) {
      console.error('Error al guardar cliente', error);
      toast.error('Ocurrió un error al guardar el cliente');
    } finally {
      setIsChecking(false); // Desactivar estado de carga siempre que termine el proceso
    }
  };

  return (
    <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30 backdrop-blur-xs">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <DialogTitle as="h3" className="text-2xl font-semibold text-primary-contrast flex justify-between items-center mb-6">
              {row ? 'Editar Cliente' : 'Agregar Cliente'}
              <X className="w-7 h-7 cursor-pointer hover:text-secondary transition-colors" onClick={close} />
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              {/* CUIT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="cuit" className="text-sm font-medium text-primary-contrast">
                  CUIT <span className="text-red-500">*</span>
                </label>
                <input
                  id="cuit"
                  {...register('cuit', {
                    required: 'El CUIT es obligatorio',
                    pattern: { value: /^\d+$/, message: 'El CUIT debe ser un número' },
                    minLength: { value: 11, message: 'El CUIT debe tener exactamente 11 dígitos' },
                    maxLength: { value: 11, message: 'El CUIT debe tener exactamente 11 dígitos' },
                  })}
                  placeholder="CUIT"
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.cuit && <span className="text-red-500 text-xs">{errors.cuit.message}</span>}
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-primary-contrast">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'El nombre debe tener entre 2 y 50 caracteres' },
                    maxLength: { value: 50, message: 'El nombre debe tener entre 2 y 50 caracteres' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo puede contener letras y espacios' },
                  })}
                  placeholder="Nombre"
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>

              {/* Apellido */}
              <div className="flex flex-col gap-2">
                <label htmlFor="lastname" className="text-sm font-medium text-primary-contrast">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastname"
                  {...register('lastname', {
                    required: 'El apellido es obligatorio',
                    minLength: { value: 2, message: 'El apellido debe tener entre 2 y 50 caracteres' },
                    maxLength: { value: 50, message: 'El apellido debe tener entre 2 y 50 caracteres' },
                    pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo puede contener letras y espacios' },
                  })}
                  placeholder="Apellido"
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.lastname && <span className="text-red-500 text-xs">{errors.lastname.message}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-primary-contrast">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'El email no es válido' },
                  })}
                  placeholder="Email"
                  type="email"
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium text-primary-contrast">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  {...register('phone', {
                    required: 'El teléfono es obligatorio',
                    pattern: { value: /^\d+$/, message: 'El teléfono debe ser un número' },
                    minLength: { value: 10, message: 'Debe tener entre 10 y 15 dígitos' },
                    maxLength: { value: 15, message: 'Debe tener entre 10 y 15 dígitos' },
                  })}
                  placeholder="Teléfono"
                  className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>

              {/* Botón */}
              <Button
                type="submit"
                disabled={isSubmitting || isChecking} // Desactivar el botón durante la verificación o envío
                className="rounded-md bg-primary px-6 py-3 cursor-pointer text-sm font-semibold text-white hover:bg-secondary transition-all duration-200 disabled:opacity-50"
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

export default FormClient;
