import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import Login from "../pages/Login/login";
import SignUp from "../pages/Signup/Signup";
import AddShipment from "../pages/AddShipment/AddShipment2";
import Dashboard from "../pages/Dashboard/Dashboard";
import UserInfo from "../pages/Dashboard/userInfo/UserInfo";
import AllShipments from "../pages/AllShipments/AllShipments";
import MyShipments from "../pages/Dashboard/myShipments/MyShipments";
import ResetPassword from "../resetPassword/reset";

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
                path : "/allShipments",
                element : <AllShipments/>
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
                        element: <MyShipments/>
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
    },{
        path : '/forgotpassword',
        element : <ResetPassword/>
    }
]);

export default router;