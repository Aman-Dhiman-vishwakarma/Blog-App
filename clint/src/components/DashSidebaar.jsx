import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiOutlineUserGroup, HiUser} from "react-icons/hi"
import { HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { HiDocumentText } from "react-icons/hi";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";


const DashSidebaar = () => {
  const { currentUser } = useSelector((store) => store.user);
    const location = useLocation();
    const [tab, settab] = useState("")
    const dispatch = useDispatch();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get("tab")
        if (tabFromUrl) {
          settab(tabFromUrl)
        }
      }, [location.search])

      const handleSignOut = async () => {
        try {
          const res = await fetch("/api/user/signout", {
          method:"POST"
          })
          const data = await res.json()
          if (!res.ok) {
            console.log(data.message)
          } else {
            dispatch(signOutSuccess())
          }
        } catch (error) {
          console.log(error)
        }
      }

  return (
   <Sidebar className='w-full md:w-56'>
    <Sidebar.Items>
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
      {currentUser?.isAdmin && <Link to="/dashbord?tab=dash">
        <Sidebar.Item active={tab === "dash"} icon={MdDashboard} as="div" >
            Dashbord
        </Sidebar.Item>
        </Link>}
        <Link to="/dashbord?tab=profile">
        <Sidebar.Item active={tab === "profile"} icon={HiUser} label={currentUser?.isAdmin ? 'Admin' : 'User'} labelColor='dark' as="div" >
            Profile
        </Sidebar.Item>
        </Link>
        {currentUser?.isAdmin && <Link to="/dashbord?tab=dashcomments">
        <Sidebar.Item active={tab === "dashcomments"} icon={BiSolidCommentDetail} as="div" >
            Comments
        </Sidebar.Item>
        </Link>}
        {currentUser?.isAdmin && <Link to="/dashbord?tab=posts">
        <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div" >
            Posts
        </Sidebar.Item>
        </Link>}
        {currentUser?.isAdmin && <Link to="/dashbord?tab=users">
        <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div" >
            Users
        </Sidebar.Item>
        </Link>}
        <Sidebar.Item icon={HiArrowSmRight} className=" cursor-pointer" onClick={handleSignOut} >
            Signout
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
   </Sidebar>
  )
}

export default DashSidebaar
