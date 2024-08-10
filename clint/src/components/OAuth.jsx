import React, { useState } from "react";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const naviget = useNavigate();

  const handleGoogleClick = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(signInSuccess(data.user));
        setLoading(false);
        naviget("/");
      }
      if (!data.success) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Button
      type="button"
      disabled={loading}
      gradientDuoTone="purpleToBlue"
      outline
      onClick={handleGoogleClick}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <FcGoogle className="h-6 w-6 mr-2" />
          <span className="font-bold">Continue With Google</span>
        </>
      )}
    </Button>
  );
};

export default OAuth;
