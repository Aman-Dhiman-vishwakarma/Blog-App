import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const {currentUser} = useSelector((store)=>store.user)
  return currentUser ? children : <Navigate to="/sign-in" />
}

export default PrivateRoute
