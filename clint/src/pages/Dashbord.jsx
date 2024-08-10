import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footercomp from '../components/Footer'
import { useLocation } from 'react-router-dom'
import DashSidebaar from '../components/DashSidebaar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashbordComp from '../components/DashbordComp'

const Dashbord = () => {
  const location = useLocation();
  const [tab, settab] = useState("")

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")
    if (tabFromUrl) {
      settab(tabFromUrl)
    }
  }, [location.search])
  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col md:flex-row" >
      <div className="md:w-56">
        <DashSidebaar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "dashcomments" && <DashComments />}
      {tab === "dash" && <DashbordComp />}
    </div>
    <Footercomp />
    </>
  )
}

export default Dashbord
