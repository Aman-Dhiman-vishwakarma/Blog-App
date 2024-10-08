import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footercomp from '../components/Footer';
import Header from '../components/Header';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const {postSlug} = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);


  useEffect(()=>{
    const fetchPost = async () => {
       try {
        setLoading(true)
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data = await res.json();
        if (!res.ok) {
          setError(true)
          setLoading(false)
          return;
        }
        if (res.ok) {
          setPost(data.posts[0])
          setLoading(false)
          setError(false)
        }
       } catch (error) {
        setError(true)
        setLoading(false)
       }
    }
    fetchPost();
  }, [postSlug])

  useEffect(()=>{
    const fetchPost = async () => {
    try {
      const res = await fetch("/api/post/getposts?limit=3")
        const data = await res.json();
        if (res.ok) {
          setRecentPost(data.posts)
        }
    } catch (error) {
      
    }
  }
  fetchPost();
  }, [])

   if (loading) {
    return <div className='flex justify-center items-center min-h-screen'>
      <Spinner size="xl"/>
    </div>
   }

  return (
    <>
    <Header />
    <main className='p-4 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-4 text-center max-w-2xl font-serif mx-auto lg:text-4xl'>{post && post?.title}</h1>
      <Link to={`/search?category=${post && post?.category}`} className='mt-5 self-center'>
      <Button color="gray" pill size="xs">{post && post?.category}</Button>
      </Link>
      <img src={post && post?.image} alt={post && post?.title} className='mt-10 p-4 max-h-[600px] w-full object-cover' />
      <div className='flex justify-between p-4 border-b border-gray-400 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post?.content?.length/1000).toFixed(0)} mins read</span>
      </div>
      <div className='p-4 mx-auto max-w-2xl w-full post-content' dangerouslySetInnerHTML={{__html: post && post?.content}}>

      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post?._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-2xl font-semibold mt-5'>Recent Artical</h1>
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          {
            recentPost && recentPost.map((post)=><PostCard key={post?._id} post={post} />)
          }
        </div>
      </div>
    </main>
    <Footercomp />
    </>
  )
}

export default PostPage
