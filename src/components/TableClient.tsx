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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress, // Importar el spinner de carga
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Client } from '../types';
import { getClients } from '../services/Client';
import AddClientDialog from './FormClient';
import { CheckCheck, X, Pencil } from 'lucide-react';

const TableClient = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response ?? []); // <- Solución al error
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClientSuccess = async () => {
    await fetchClients(); // Recargar los clientes actualizados
    setOpen(false); // Cerrar el formulario de agregar cliente
  };

  const handleEditClick = (row: Client) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const columns: MRT_ColumnDef<Client>[] = [
    {
      accessorKey: 'id',
      header: 'Id',
    },
    {
      accessorKey: 'cuit',
      header: 'CUIT',
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'lastname',
      header: 'Apellido',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
    },
    {
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
    },
    {
      id: 'acciones',
      header: 'Acciones',
      Cell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <button
            onClick={() => handleEditClick(row.original)}
            className="text-white border text-center items-center bg-primary hover:bg-secondary text-[14px] font-medium px-3 py-1 cursor-pointer rounded-3xl flex gap-2"
          >
            <Pencil size={16} className="text-white" />
            Editar
          </button>
        </Box>
      ),
    },
  ];

  const table = useMaterialReactTable<Client>({
    columns,
    data: clients,
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
      placeholder: 'Buscar cliente...',
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
        Mis Clientes
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
            Agregar Cliente
          </button>
          <AddClientDialog
            open={open}
            setOpen={setOpen}
            row={selectedRow}
            onAddClientSuccess={handleAddClientSuccess} // Función para refrescar la tabla después de agregar el cliente
          />
          <MRT_TablePagination table={table} />
        </Stack>
      </Box>

      {/* Mostrar el spinner de carga mientras se obtienen los clientes */}
      {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
            <CircularProgress /> {/* Spinner de carga */}
          </Box>
        ) : clients.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
            <Typography variant="h6" color="textSecondary">
              No hay clientes cargados.
            </Typography>
          </Box>
        ) : (
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
                const isActive = row.original.isActive;

                return (
                  <TableRow
                    key={row.id}
                    selected={row.getIsSelected()}
                    sx={{
                      backgroundColor: isActive ? '#f0faf4' : '#f5f5f5',
                      color: !isActive ? 'gray' : 'inherit',
                      opacity: !isActive ? 0.6 : 1,
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

export default TableClient;
