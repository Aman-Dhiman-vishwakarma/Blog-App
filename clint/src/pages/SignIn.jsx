import React, { useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const {error:errorMessage, loading, currentUser} = useSelector((store)=>store.user);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const naviget = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all of the fields"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      
      if (data.success) {
        dispatch(signInSuccess(data.user))
        naviget('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-[75vh] mt-20">
      <div className="flex p-4 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to="/"
            className=" whitespace-nowrap text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500  via-indigo-600 to-blue-800 rounded-md text-white">
              Aman's
            </span>
            Blog
          </Link>
          <p className=" text-sm mt-5">
            Hear you can SignIn with your email and password or Signup Google
          </p>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button className="mt-2" gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
              {loading ? <><Spinner size="sm"/> <span className="pl-2">Loading...</span></> : "SignIn"}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account</span>
            <Link to="/Sign-up" className="text-blue-600">
              SignUp
            </Link>
          </div>
          {
            errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>
          }
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}

export default SignIn
