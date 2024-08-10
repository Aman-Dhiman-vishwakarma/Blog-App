import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({post}) => {
  return (
    <div className='group relative w-full border shadow-lg h-[300px] overflow-hidden rounded-lg hover:border-2 sm:w-[360px] transition-all'>
      <Link to={`/post/${post?.slug}`}>
      <img src={post?.image} alt="post cover" className='h-[190px] w-full object-cover group-hover:h-[170px] transition-all duration-300 z-20' />
      </Link>
      <div className="flex flex-col gap-2 p-2">
       <p className='text-lg font-semibold line-clamp-2'>{post?.title}</p>
       <span className='italic text-sm'>{post?.category}</span>
       <Link to={`/post/${post?.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-blue-600 text-white bg-blue-600 hover:text-white duration-300 text-center py-2 m-2 rounded-md'>Read Artical</Link>
      </div>
    </div>
  )
}

export default PostCard
