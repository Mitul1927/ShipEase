import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import Login from "../pages/Login/login";
import SignUp from "../pages/Signup/Signup";
import AddShipment from "../pages/AddShipment/AddShipment2";
import Dashboard from "../pages/Dashboard/Dashboard";
import UserInfo from "../pages/Dashboard/userInfo/UserInfo";

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
                path : "/addShipment",
                element : <AddShipment/>
            },
            {
                path : "/dashboard",
                element : <Dashboard/>,
                children: [
                    {
                        path : "/dashboard",
                        element: <div><span>&lt;</span>-- Choose from here  </div>
                    },
                    {
                        path : '/dashboard/userInfo',
                        element: <UserInfo/>
                    },
                    {
                        path : '/dashboard/shipments',
                        element: <div>All Shipments</div>
                    },
                    {
                        path:'/dashboard/visitors',
                        element:<div>Visitors</div>
                    }
                ]
            },
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