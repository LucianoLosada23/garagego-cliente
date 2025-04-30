import TableVehicle from "../components/TableVehicle"
import { getMarcas } from "../services/Vehicle"

export default function Vehicle() {
getMarcas()
  return (
    <div className="max-w-table-container mx-auto">
    <TableVehicle
    />
    </div>
  )
}
