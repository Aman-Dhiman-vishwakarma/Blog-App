import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button, Spinner } from "flowbite-react";
import {Link} from "react-router-dom"
import { PiWarningCircle } from "react-icons/pi";

const DashPosts = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModel, setShowModel] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [showmoreLoading, setShowmoreLoading] = useState(false);


  useEffect(() => {
    setLoading(true)
    const fetchPosts = async () => {
      const res = await fetch(`/api/post/getposts`);
      const data = await res.json();
      if (res.ok) {
        setLoading(false)
        setUserPosts(data.posts);
        if (data?.posts?.length < 9) {
          setShowMore(false)
        }
      }
      if (!res.ok) {
        setLoading(false)
      }
    };
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    setShowmoreLoading(true)
    const startIndex = userPosts?.length
    try {
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`)
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev)=>[...prev, ...data?.posts])
        setShowmoreLoading(false)
        if (data?.posts?.length < 9) {
          setShowMore(false)
        }
      }
      if (!res.ok) {
        setShowmoreLoading(false)
      }
    } catch (error) {
      console.log(error.message)
      setShowmoreLoading(false)
    }
  }

  const handleDeletePost = async () => {
    setShowModel(false)
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser?._id}`, {
        method:"DELETE"
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      }else{
        setUserPosts((prev)=>prev.filter((post)=>post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return <div className='flex justify-center items-center w-full min-h-screen'>
      <Spinner size="xl"/>
    </div>
   }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-4 scrollbar  scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser?.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts?.map((post) => (
              <Table.Body key={post?._id} className=" divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post?.slug}`}><img src={post?.image} alt={post?.title} className="w-20 h-10 object-cover bg-gray-500" /></Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post?.slug}`} className="font-medium text-gray-900 dark:text-white">{post?.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post?.category}</Table.Cell>
                  <Table.Cell><span onClick={()=>{setShowModel(true); setPostIdToDelete(post._id);}} className="font-semibold text-red-600 hover:underline cursor-pointer">Delete</span></Table.Cell>
                  <Table.Cell> <Link to={`/update-post/${post?._id}`}><span className="font-semibold text-green-600 hover:underline cursor-pointer">Edit</span></Link></Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (!showmoreLoading ? <button onClick={handleShowMore} className=" w-full text-sm py-6 text-blue-800 font-semibold self-center">Show More</button> : <p className="w-full flex justify-center gap-2 my-10"><Spinner size="sm"/>Loading...</p>)}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal show={showModel} onClose={()=>{setShowModel(false)}} popup size="md" >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
            <PiWarningCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-600 mb-5 dark:text-gray-400">Are you sure you want to delete this post?</h2>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeletePost} >
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
};

export default DashPosts;


// userId=${currentUser?._id}&
