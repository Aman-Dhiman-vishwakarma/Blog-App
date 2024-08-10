import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({children}) => {
    const {theme} = useSelector((store)=>store.theme)
  return (
    <div className={theme}>
        <div className="bg-white text-gray-800 dark:text-gray-200 dark:bg-black min-h-screen">
        {children}
        </div>
    </div>
  )
}

export default ThemeProvider
// [rgb(16,23,42)]