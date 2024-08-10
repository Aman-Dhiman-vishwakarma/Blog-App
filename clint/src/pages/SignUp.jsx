import React, { useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Footer from "../components/Footer";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const naviget = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please Fill Out All Fields')
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message)
      }
      
      if (data.success) {
        naviget('/sign-in')
      }
      console.log(data)
    } catch (error) {
      setErrorMessage(error.message)
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[75vh] mt-20">
        <div className="flex p-6 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
              Hear you can SignUp with your email and password or Signup Google
            </p>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={handleChange}
                />
              </div>
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
                {loading ? <><Spinner size="sm"/> <span className="pl-2">Loading...</span></> : "SignUp"}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account</span>
              <Link to="/Sign-In" className="text-blue-600">
                SignIn
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
  );
};

export default SignUp;
