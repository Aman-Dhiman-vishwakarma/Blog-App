import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button, Spinner } from "flowbite-react";
import { PiWarningCircle } from "react-icons/pi";


const DashComments = () => {
    const { currentUser } = useSelector((store) => store.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel, setShowModel] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);

  
    useEffect(() => {
      setLoading(true)
      const fetchComments = async () => {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
            setComments(data?.comments);
            setLoading(false)
          if (data?.comments?.length < 9) {
            setShowMore(false)
          }
        }
        if (!res.ok) {
          setLoading(false)
        }
      };
      if (currentUser?.isAdmin) {
        fetchComments();
      }
    }, [currentUser?._id]);
  
    const handleShowMore = async () => {
      const startIndex = comments?.length
      try {
        const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
        const data = await res.json();
        if (res.ok) {
            setComments((prev)=>[...prev, ...data?.comments])
          if (data?.comments?.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  
    const handleDeleteComment = async () => {
      setShowModel(false)
      try {
        const res = await fetch(`/api/comment/deletcomment/${commentIdToDelete}`, {
          method:"DELETE"
        })
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message)
        }else{
            setComments((prev)=>prev.filter((comment)=>comment._id !== commentIdToDelete))
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
        {currentUser?.isAdmin && comments?.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Comment Contebt</Table.HeadCell>
                <Table.HeadCell>Numbers of likes</Table.HeadCell>
                <Table.HeadCell>postId</Table.HeadCell>
                <Table.HeadCell>userId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments?.map((comment) => (
                <Table.Body key={comment?._id} className=" divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{new Date(comment?.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                     {comment?.content}
                    </Table.Cell>
                    <Table.Cell>{comment?.numbersOfLikes}</Table.Cell>
                    <Table.Cell>{comment?.postId}</Table.Cell>
                    <Table.Cell>{comment?.userId}</Table.Cell>
                    <Table.Cell><span onClick={()=>{setShowModel(true); setCommentIdToDelete(comment._id);}} className="font-semibold text-red-600 hover:underline cursor-pointer">Delete</span></Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && <button onClick={handleShowMore} className=" w-full text-sm py-6 text-blue-800 font-semibold self-center">Show More</button>}
          </>
        ) : (
          <p>You have no comments yet!</p>
        )}
        <Modal show={showModel} onClose={()=>{setShowModel(false)}} popup size="md" >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
              <PiWarningCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h2 className="text-lg font-semibold text-gray-600 mb-5 dark:text-gray-400">Are you sure you want to delete this comments?</h2>
              <div className="flex justify-between">
                <Button color="failure" onClick={handleDeleteComment} >
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

export default DashComments
