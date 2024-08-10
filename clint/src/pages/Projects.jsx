import React from 'react'
import Header from '../components/Header'
import Footercomp from '../components/Footer'
import CallToAction from "../components/CallToAction";

const Projects = () => {
  return (
    <>
    <Header />
    <div className='min-h-screen max-w-4xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Pojects</h1>
      <p className='text-md text-gray-500'>Build fun and engaging projects while learning HTML, CSS, and JavaScript!</p>
      <CallToAction />
    </div>
    <Footercomp />
    </>
  )
}

export default Projects
