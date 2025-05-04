import {createBrowserRouter} from "react-router-dom"
import Clients from "./views/Clients"
import Layout from "./layouts/Layout"
import Vehicle from "./views/Vehicle"
import Home from "./views/Home"
import Appointments from "./views/Appointments"
export const router = createBrowserRouter ([
    {
        path : "/",
        element : <Layout/>,
        
        children : [
            {
                element : <Home/>,
                index : true,
              
            },
            {
                path : "clientes",
                element : <Clients/>,

            },
            {
                path : "vehiculos",
                element : <Vehicle/>,
            },
            {
                path : "citas",
                element : <Appointments/>,
            },
          
        ]
    }
])