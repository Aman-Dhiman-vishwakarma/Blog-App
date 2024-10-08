import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footercomp from "../components/Footer";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "sort",
    category: "uncategorized",
  });


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showmoreLoading, setShowmoreLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const neviget = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      };
      fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (sidebarData.searchTerm == "" && sidebarData.sort == "sort" && sidebarData.category == "uncategorized" ) return;

    const urlParams = new URLSearchParams(location.search);
    sidebarData.searchTerm !== "" ? urlParams.set("searchTerm",sidebarData.searchTerm) : urlParams.set("searchTerm","");
    sidebarData.sort !== "sort" ? urlParams.set("order",sidebarData.sort) : urlParams.set("sort","");
    sidebarData.category !== "uncategorized" ? urlParams.set("category",sidebarData.category) : urlParams.set("category","");
    const searchQuery = urlParams.toString();
    if (sidebarData.searchTerm !== "" || sidebarData.sort !== "" || sidebarData.category !== "" ) {
      neviget(`/search?${searchQuery}`)
    }
  }

  const handleShowMore = async () => {
    setShowmoreLoading(true)
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      setShowmoreLoading(false)
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      setShowmoreLoading(false)
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };


  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
          <form onSubmit={submitHandler} className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <TextInput placeholder="Search..."
               id="searchTerm"
               value={sidebarData.searchTerm}
               onChange={handleChange}
               type="text"
                />
            </div>
            <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='sort'>sort</option>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">Apply Filter</Button>
          </form>
        </div>
        <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-2xl text-gray-500'>No posts found.</p>
          )}
          {loading && <div className='min-h-screen flex justify-center mt-[30vh] flex-1'><Spinner size="xl"/></div>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (!showmoreLoading ? 
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
            Show More
            </button>
           :  <p className="w-full flex justify-center gap-2 my-10"><Spinner size="sm"/>Loading...</p>)}
        </div>
      </div>
      </div>
      <Footercomp />
    </>
  );
};

export default Search;
