import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminPrivateRoute = ({children}) => {
    const {currentUser} = useSelector((store)=>store.user)
    return currentUser?.isAdmin ? children : <Navigate to="/sign-in" />
}

export default AdminPrivateRoute
