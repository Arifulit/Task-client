import { createBrowserRouter } from "react-router-dom";

import Mainlayout from "../Mainlayout/Mainlayout";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import ErrorPage from "../components/ErrorPage";
import PrivateRoute from "../components/PrivateRoute";






const router = createBrowserRouter([
    {
        path: "/",
        element: <Mainlayout></Mainlayout>,

        children: [
            {
                path: "/",
                element: <PrivateRoute><Home></Home></PrivateRoute>,
                
            },
           {
                path: "/login",
                element: <Login></Login>,
            }, 
            {
                path: "/register",
                element: <Register></Register>,
            },
           
         
            {
                path: "*",
                element: <ErrorPage></ErrorPage>
            },
        ]
    }
])

export default router;