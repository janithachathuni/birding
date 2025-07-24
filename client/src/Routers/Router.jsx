import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//extensions
import App from '../App'
import Home from '../Components/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';

const Router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children:[
            {
                index: true,
                element: <Home/>
            },

            {
                path: '/login',
                element: <Login/>
            },

            {
                path: '/register',
                element: <Register/>
            }
        ]
    }
]);

export default Router