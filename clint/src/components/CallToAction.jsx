import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row border border-blue-500 justify-center items-center rounded-tl-3xl rounded-br-3xl p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className='text-2xl'>Want to see more javascript project all projects based on mern technology</h1>
        <p className='my-2 text-gray-500'>Go to my github profile</p>
        <Button gradientDuoTone="purpleToBlue" className='mb-2'>
          <a href="https://github.com/Aman-Dhiman-vishwakarma" target='_blank' rel='noopener noreferrer'>Javascript projects</a>
        </Button>
      </div>
      <div className="flex-1">
        <img src="https://blog.talent500.co/wp-content/uploads/2023/01/Skills-you-need-to-get-a-job-as-a-JavaScript-developer-1.png" alt="image" />
      </div>
    </div>
  )
}

export default CallToAction
