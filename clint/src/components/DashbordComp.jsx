import { Button, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashbordComp = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPost, setLastMonthPost] = useState(0);
  const [lastMonthComments, setLastMontComments] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data?.users);
          setTotalUsers(data?.totalUser);
          setLastMonthUsers(data?.lastMonthUser);
        }
        if (!res.ok) {
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data?.posts);
          setTotalPost(data?.totalPosts);
          setLastMonthPost(data?.lastMonthsPost);
          setLoading(false)
        }
       
      } catch (error) {
        console.log(error);

      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data?.comments);
          setTotalComments(data?.totalComments);
          setLastMontComments(data?.lastMonthsComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  if (loading) {
    return <div className='flex justify-center items-center w-full min-h-screen'>
      <Spinner size="xl"/>
    </div>
   }

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-5 justify-center">
        <div className="flex flex-col w-full md:w-72 shadow-md gap-5 p-4 dark:bg-slate-800 rounded-lg">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-semibold text-md uppercase">
                Total Users
              </h3>
              <p className="text-2xl font-semibold">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full shadow-md text-5xl p-3" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-72 shadow-md gap-5 p-4 dark:bg-slate-800 rounded-lg">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-semibold text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl font-semibold">{totalComments}</p>
            </div>
            <HiOutlineUserGroup className="bg-indigo-600 text-white rounded-full shadow-md text-5xl p-3" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-72 shadow-md gap-5 p-4 dark:bg-slate-800 rounded-lg">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-semibold text-md uppercase">
                Total Posta
              </h3>
              <p className="text-2xl font-semibold">{totalPost}</p>
            </div>
            <HiOutlineUserGroup className="bg-lime-600 text-white rounded-full shadow-md text-5xl p-3" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPost}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap py-4 gap-4 mx-auto justify-center">
        <div className="flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1>Resent User</h1>
            <Link to="/dashbord?tab=users">
              {" "}
              <Button outline gradientDuoTone="purpleToBlue">
                See All{" "}
              </Button>
            </Link>
          </div>
          <Table hoverable c>
              <Table.Head>
                <Table.HeadCell>user image</Table.HeadCell>
                <Table.HeadCell>username</Table.HeadCell>
              </Table.Head>
              {users && users?.map((user) => (
                <Table.Body key={user?._id} className=" divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link><img src={user?.profilePicture} alt={user?.username} className="w-10 h-10 rounded-full object-fill bg-gray-500" /></Link>
                    </Table.Cell>
                    <Table.Cell>{user?.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
        </div>
        <div className="flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1>Resent Comments</h1>
            <Link to="/dashbord?tab=dashcomments">
              {" "}
              <Button outline gradientDuoTone="purpleToBlue">
                See All{" "}
              </Button>
            </Link>
          </div>
          <Table hoverable c>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {comments && comments?.map((comment) => (
                <Table.Body key={comment?._id} className=" divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                        {comment?.content}
                    </Table.Cell>
                    <Table.Cell>{comment?.numbersOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
        </div>
        <div className="flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1>Resent posts</h1>
            <Link to="/dashbord?tab=posts">
              {" "}
              <Button outline gradientDuoTone="purpleToBlue">
                See All{" "}
              </Button>
            </Link>
          </div>
          <Table hoverable c>
              <Table.Head>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              {posts && posts?.map((post) => (
                <Table.Body key={post?._id} className=" divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link><img src={post?.image} alt={post?.title} className="w-10 h-10 rounded-full object-fill bg-gray-500" /></Link>
                    </Table.Cell>
                    <Table.Cell>{post?.title}</Table.Cell>
                    <Table.Cell>{post?.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
        </div>
      </div>
    </div>
  );
};

export default DashbordComp;
