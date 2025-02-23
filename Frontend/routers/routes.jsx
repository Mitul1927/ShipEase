import { createBrowserRouter } from "react-router-dom";
import App from "../src/App";
import Home from "../pages/Home/Home";
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import Login from "../pages/Login/login";
import SignUp from "../pages/Signup/Signup";
import AddShipment from "../pages/AddShipment/AddShipment2";

const router = createBrowserRouter([
    {
        path : "/",
        element: <App/>,
        children: [
            {
                path : "/",
                element: <Home/>
            },
            {
                path : "/allshipments",
                element : <div>all shipments</div>
            },
            {
                path : "/shipment/:id",
                element: <div> one shipment</div>
            },
            {
                path : "/about",
                element: <div>About us</div>
            },
            {
                path : "/shipments",
                element : <div>All Shipments</div>
            },
            {
                path : "/dashboard",
                element : <div>Dashboard</div>
            },
            {
                path : "/addShipment",
                element : <AddShipment/>
            }
        ]
    },{
        path : '/adminLogin',
        element: <AdminLogin/>
    },{
        path : '/login',
        element: <Login/>
    },{
        path : '/signup',
        element: <SignUp/>
    }
]);

export default router;