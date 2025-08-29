import React from 'react'
import {Navigate, useLocation} from 'react-router-dom'

const ProtectedRoute = ({children, requiredRole}) => {
    const location = useLocation();

    //getting user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    //if no user is logged in, redirect to login page
    if(!user){
        return <Navigate to="/login" state={{from: location}} replace />
    }

    //if a specific role is required and user doesn't have it
    if(requiredRole && user.role !== requiredRole){
        //redirect to appropriate dashboard based on actual role
        if(user.role === 'admin'){
            return <Navigate to='/admin/dashboard' replace/>;
        }else{
            return <Navigate to = '/birder/dashboard' replace/>;
        }
    }

    //if user has required role, render children
    return children;
}

export default ProtectedRoute
