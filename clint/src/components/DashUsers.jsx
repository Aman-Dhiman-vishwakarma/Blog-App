import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button, Spinner } from "flowbite-react";
import {Link} from "react-router-dom"
import { PiWarningCircle } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";


const DashUsers = () => {
    const { currentUser } = useSelector((store) => store.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel, setShowModel] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);

  
    useEffect(() => {
      setLoading(true)
      const fetchUsers = async () => {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setLoading(false)
          if (data?.users?.length < 9) {
            setShowMore(false)
          }
        }
        if (!res.ok) {
          setLoading(false)
        }
      };
      if (currentUser?.isAdmin) {
        fetchUsers();
      }
    }, [currentUser?._id]);
  
    const handleShowMore = async () => {
      const startIndex = users?.length
      try {
        const res = await fetch(`/api/post/getusers?startIndex=${startIndex}`)
        const data = await res.json();
        if (res.ok) {
          setUsers((prev)=>[...prev, ...data?.users])
          if (data?.users?.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  
    const handleDeleteUser = async () => {
      setShowModel(false)
      try {
        const res = await fetch(`/api/user/deleteuser/${userIdToDelete}`, {
          method:"DELETE"
        })
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message)
        }else{
          setUsers((prev)=>prev.filter((user)=>user._id !== userIdToDelete))
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if (loading) {
      return <div className='flex justify-center items-center w-full min-h-screen'>
        <Spinner size="xl"/>
      </div>
     }
  
    return (
      <div className="table-auto overflow-x-scroll md:mx-auto p-4 scrollbar  scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
        {currentUser?.isAdmin && users?.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>user image</Table.HeadCell>
                <Table.HeadCell>username</Table.HeadCell>
                <Table.HeadCell>email</Table.HeadCell>
                <Table.HeadCell>isadmin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users?.map((user) => (
                <Table.Body key={user?._id} className=" divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{new Date(user?.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link><img src={user?.profilePicture} alt={user?.username} className="w-10 h-10 rounded-full object-fill bg-gray-500" /></Link>
                    </Table.Cell>
                    <Table.Cell>{user?.username}</Table.Cell>
                    <Table.Cell>{user?.email}</Table.Cell>
                    <Table.Cell>{user?.isAdmin ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}</Table.Cell>
                    <Table.Cell><span onClick={()=>{setShowModel(true); setUserIdToDelete(user._id);}} className="font-semibold text-red-600 hover:underline cursor-pointer">Delete</span></Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && <button onClick={handleShowMore} className=" w-full text-sm py-6 text-blue-800 font-semibold self-center">Show More</button>}
          </>
        ) : (
          <p>You have no users yet!</p>
        )}
        <Modal show={showModel} onClose={()=>{setShowModel(false)}} popup size="md" >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
              <PiWarningCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h2 className="text-lg font-semibold text-gray-600 mb-5 dark:text-gray-400">Are you sure you want to delete this post?</h2>
              <div className="flex justify-between">
                <Button color="failure" onClick={handleDeleteUser} >
                  Yes I'm Sure
                </Button>
                <Button color="gray" onClick={()=>{setShowModel(false)}} >
                  No, Cancle
                </Button>
              </div>
              </div>
            </Modal.Body>
          </Modal>
      </div>
    );
}

export default DashUsers
