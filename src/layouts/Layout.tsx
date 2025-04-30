import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Home, Settings, Users , Car , Wrench , ChartNoAxesCombined, User, HandCoins, BanknoteArrowUp, CalendarDays} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <Home size={20} />, path: "/" },
    { label: "Clientes", icon: <Users size={20} />, path: "/clientes" },
    { label: "Vehículos", icon: <Car size={20} />, path: "/vehiculos" },
    { label: "Servicios", icon: <Wrench size={20} />, path: "/servicios" },
    { label: "Citas", icon: <CalendarDays size={20} />, path: "/citas" },
    { label: "Estadística", icon: <ChartNoAxesCombined size={20} />, path: "/estadistica" },
    { label: "Proveedores", icon: <HandCoins size={20} />, path: "/proveedores" },
    { label: "Facturación", icon: <BanknoteArrowUp size={20} />, path: "/facturacion" },
    { label: "Perfil", icon: <User size={20} />, path: "/perfil" },
    { label: "Configuración", icon: <Settings size={20} />, path: "/configuracion" },
  ];

  return (
    <div className="flex h-screen mb-4">
      {/* Sidebar */}
      <div className="h-[730px] w-64 bg-primary-contrast  text-white px-3 flex flex-col"
     
      >
        <div className="flex justify-center items-center ">
          <img src="/logo4.svg" alt="Logo" className="w-400 h-34" />
        </div>
        <nav className="flex flex-col justify-center items-center gap-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-start gap-2 px-4 py-3 w-60 rounded-3xl cursor-pointer transition text-left
                ${
                  location.pathname === item.path
                    ? "bg-primary hover:bg-secondary  shadow-lg"
                    : "hover:bg-gray-800"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
