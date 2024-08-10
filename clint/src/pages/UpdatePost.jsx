import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../components/Header'
import Footercomp from '../components/Footer'
import { Alert, Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


const UpdatePost = () => {
    const { currentUser } = useSelector((store) => store.user);
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const {postId} = useParams();
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const naviget = useNavigate();



    useEffect(()=>{
        try {
          setLoading(true)
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                if (!res.ok) {
                    console.log(data.message)
                    setLoading(false)
                    setPublishError(data.message)
                    return
                }
                if (res.ok) {
                    setPublishError(null)
                    setFormData(data?.posts[0])
                    setLoading(false)
                }
            }
            fetchPost();
        } catch (error) {
            console.log(error.message)
            setLoading(false)
        }
    }, [postId])
  
    const handleUploadImage = async () => {
      try {
        if (!file) {
          setImageUploadError("Please Select an Image")
          return;
        }
        setImageUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + "-" + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageUploadError("ImageUpload Failed");
            setImageUploadProgress(null)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downlodeUrl) => {
              setImageUploadProgress(null)
              setImageUploadError(null)
              setFormData({...formData, image:downlodeUrl})
            });
          }
        )
      } catch (error) {
        console.log(error)
        setImageUploadError("ImageUpload Failed");
        setImageUploadProgress(null)
      }
    }
  
     const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setUpdateLoading(true)
        const res = await fetch(`/api/post/updatepost/${formData?._id}/${currentUser?._id}`, {
          method:'PUT',
          headers:{"Content-Type": "application/json",},
          body:JSON.stringify(formData)
        })
        const data = await res.json();
        if (!res.ok) {
          setUpdateLoading(false)
          return setPublishError(data.message)
        }
        if (res.ok) {
          setPublishError(null)
          setUpdateLoading(false)
          naviget(`/post/${data?.slug}`)
        }
      } catch (error) {
        setPublishError("somthing went wrong")
        setUpdateLoading(false)
      }
     }

     if (loading) {
      return <div className='flex justify-center items-center min-h-screen'>
        <Spinner size="xl"/>
      </div>
     }
  
    return (
      <>
      <Header />
      <div className='max-w-3xl mx-auto p-4 min-h-screen'>
          <h1 className="text-center text-3xl my-6 font-semibold">Update Post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className="flex flex-col gap-4 sm:flex-row">
              <TextInput type='text' placeholder='Title' required id='title' className='flex-1' value={formData?.title} onChange={(e)=>{setFormData({...formData, title:e.target.value})}}/>
              <Select value={formData?.category} onChange={(e)=>{setFormData({...formData, category:e.target.value})}}>
                  <option value="uncategorized">Select a Category</option>
                  <option value="javascript">Java Script</option>
                  <option value="reactjs">React.js</option>
                  <option value="nextjs">Next.js</option>
              </Select>
          </div>
          <div className="flex items-center justify-between gap-2 border-2 p-4">
              <FileInput type="file" accept='image/*' onChange={(e)=>{setFile(e.target.files[0])}}/>
            <Button onClick={handleUploadImage} disabled={imageUploadProgress} type='button' size="sm" gradientDuoTone="purpleToBlue" outline>{imageUploadProgress ? `${imageUploadProgress}% Uploading...` : "Upload Image"}</Button>
          </div>
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData?.image && <img src={formData?.image} alt='Upoad' className='w-full h-72 object-cover' />}
          <ReactQuill value={formData && formData?.content} theme='snow' placeholder='Write Somthing...' className='h-72 mb-12' required onChange={(value)=>{setFormData({...formData, content:value})}}/>
          <Button type='submit' disabled={updateLoading} gradientDuoTone="purpleToBlue">{updateLoading ? "Loading..." : "Update Post"}</Button>
          {publishError && <Alert color='failure'>{publishError}</Alert>}
      </form>
      </div>
      <Footercomp />
      </>
    )
}

export default UpdatePost
