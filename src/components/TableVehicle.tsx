import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { CheckCheck, X, Pencil } from 'lucide-react';
import { getVehicle } from '../services/Vehicle';
import { VehicleString } from '../types/vehicle';
import FormVehicle from './FormVehicle';

const TableVehicle = () => {
  const [vehicle, setvehicle] = useState<VehicleString[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<VehicleString | null>(null);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await getVehicle();
      setvehicle(response ?? []); // <- Solución al error
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  const handleAddVehicleSuccess = async () => {
    await fetchVehicle(); // Recargar los clientes actualizados
    setOpen(false); // Cerrar el formulario de agregar cliente
  };

  const handleEditClick = (row: VehicleString) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const columns: MRT_ColumnDef<VehicleString>[] = [
    {
      accessorKey: 'id',
      header: 'Id',
    },
    {
      accessorKey: 'marca',
      header: 'Marca',
      Cell: ({ row }) => {
        const marca = row.original.marca;
        const marcaIcon = row.original.marca; 
    
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {marcaIcon && (
              <img
                src={`${marcaIcon}.svg`}
                alt={marca}
                width={38}
                height={38}
                style={{ objectFit: 'contain' }}
              />
            )}
            <Typography variant="body2">{marca}</Typography>
          </Box>
        );
      },
    },
    {
      accessorKey: 'modelo',
      header: 'Modelo',
    },
    {
      accessorKey: 'patente',
      header: 'Patente',
    },
    {
      accessorKey: 'nroChasis',
      header: 'NroChasis',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    /*{
      accessorKey: 'isActive',
      header: 'Estado',
      Cell: ({ cell }) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {cell.getValue<boolean>() ? (
            <CheckCheck className="text-primary" />
          ) : (
            <X className="text-red-600" />
          )}
        </Box>
      ),
    },*/
    {
      accessorKey: 'motor',
      header: 'Motor',
    },
    {
      accessorKey: 'año',
      header: 'Año',
    },
    {
      accessorKey: 'clienteId',
      header: 'ClienteId',
    },
    {
      accessorFn: (row) => `${row.cliente?.name ?? ''} ${row.cliente?.lastname ?? ''}`,
      id: 'clienteNombreCompleto', // Necesitás un ID cuando usás accessorFn
      header: 'Cliente',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      Cell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <button
            onClick={() => handleEditClick(row.original)}
            className="text-white border text-center items-center bg-primary hover:bg-secondary text-[14px] font-medium px-3 py-1 cursor-pointer  rounded-3xl flex gap-2"
          >
            <Pencil size={16} className="text-white" />
            Editar
          </button>
        </Box>
      ),
    },
  ];

  const table = useMaterialReactTable<VehicleString>({
    columns,
    data: vehicle,
    enableRowSelection: false,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: 'outlined',
    },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar vehículo..',
      size: 'small',
      sx: {
        minWidth: '300px',
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#2ba84a',
          },
        },
      },
    },
    paginationDisplayMode: 'pages',
  });

  return (
    <Stack sx={{ m: '2rem 0', backgroundColor: 'white', boxShadow: 2, padding: 8 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', color: '#1A1B41', fontWeight: 600, fontSize: '36px' }}>
        Vehículos de Clientes
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <MRT_GlobalFilterTextField table={table} />
        <Stack direction="row" spacing={2} alignItems="center">
          <button
            className="bg-primary text-body hover:bg-secondary text-[14px] font-medium px-8 py-2 cursor-pointer uppercase rounded-3xl flex gap-2"
            onClick={() => {
              setSelectedRow(null);
              setOpen(true);
            }}
          >
            <img src="/plus.svg" className="text-white items-center" alt="Agregar" width={20} height={20} />
            Agregar Vehículo
          </button>
          <FormVehicle
            open={open}
            setOpen={setOpen}
            row={selectedRow}
            onAddVehicleSuccess={handleAddVehicleSuccess} // Función para refrescar la tabla después de agregar el cliente

          />
          <MRT_TablePagination table={table} />
        </Stack>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
          <CircularProgress /> {/* Spinner de carga */}
        </Box>
      ) : vehicle.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
          <Typography variant="h6" color="textSecondary">
            No hay vehículos cargados.
          </Typography>
        </Box>
      ) :(
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell align="center" variant="head" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.Header ?? header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                selected={row.getIsSelected()}
                sx={{
                    backgroundColor: '#f0faf4' ,
                    color: 'gray' ,
                    opacity: 1 ,
                  }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell align="center" variant="body" key={cell.id}>
                    <MRT_TableBodyCellValue cell={cell} table={table} />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TableContainer>
      )}
      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
    </Stack>
  );
};

export default TableVehicle;
