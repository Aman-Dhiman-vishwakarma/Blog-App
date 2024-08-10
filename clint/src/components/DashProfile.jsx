import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess, updateFailure, updateStart, updateSuccess } from "../redux/userSlice";
import { PiWarningCircle } from "react-icons/pi";


const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((store) => store.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setimageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setimageFileUploadError] = useState(null);
  const [imageFileUploding, setImageFileUploding] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false)
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uplodeImage();
    }
  }, [imageFile]);

  const uplodeImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploding(true)
    setimageFileUploadError(null)
    const storege = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storege, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setimageFileUploadError(
          "Cloud not upload image (File must be less than 2MB)"
        );
        setimageFileUploadProgress(null)
        setImageFileUploding(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downlodeUrl) => {
          setImageFileUrl(downlodeUrl);
          setFormData({...formData, profilePicture:downlodeUrl})
          setImageFileUploding(false)
        });
      }
    );

  };

  const handelChangeInput = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Change Made")
      return;
    }
    if (imageFileUploding) {
      setUpdateUserError("Please wait for image uploading")
      return;
    }
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/updateuser/${currentUser._id}`, {
        method:"PUT",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        setUpdateUserError(data.message)
        return dispatch(updateFailure(data.message))
       
      }
      if (data.success) {
        dispatch(updateSuccess(data.updateUser))
        setUpdateUserSuccess("User Profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const handleDeleteUser = async () => {
      setShowModel(false)
      try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/user/deleteuser/${currentUser._id}`, {
          method:"DELETE",
        })
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data?.message))
        } else {
          dispatch(deleteUserSuccess())
        }
      } catch (error) {
        dispatch(deleteUserFailure(error?.message))
      }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
      method:"POST"
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 w-full border border-gray-400 dark:border  my-10 rounded-2xl h-[80vh]">
      <h1 className="mb-6 text-center font-semibold text-4xl">Profile</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root:{
                  width:'100%',
                  height:'100%',
                  position:'absolute',
                  top:0,
                  left:0
                },
                path:{
                  stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="User"
            className={`rounded-full w-full h-full object-fill border-4 border-white ${imageFileUploadProgress && imageFileUploadProgress < 100 && " opacity-60"}`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username} onChange={handelChangeInput}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Username"
          defaultValue={currentUser?.email} onChange={handelChangeInput}
        />
        <TextInput type="password" id="password" placeholder="Password" onChange={handelChangeInput} />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileUploding} >
          {loading ? 'loading...' : 'Update'}
          Update
        </Button>
        {
          currentUser.isAdmin && <Link to="/create-post"><Button type="button" gradientDuoTone='purpleToBlue' className="w-full">Create a Post</Button></Link>
        }
      </form>
      <div className="flex justify-between mt-5 text-red-500">
        <span className=" cursor-pointer" onClick={()=>{setShowModel(true)}}>Delete Account</span>
        <span className=" cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color='success' className="mt-5">{updateUserSuccess}</Alert>}
      {error && <Alert color='failure' className="mt-5">{error}</Alert>}
      {imageFileUploding && <Alert color='success' className="mt-5">Image Uploding...</Alert>}
      {updateUserError && (
          <Alert color="failure" className="mt-5">{updateUserError}</Alert>
        )}
        <Modal show={showModel} onClose={()=>{setShowModel(false)}} popup size="md" >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
            <PiWarningCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-600 mb-5 dark:text-gray-400">Are you sure you want to delete your account?</h2>
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
};

export default DashProfile;
