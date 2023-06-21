"use client";
import React, { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";
import { signUp } from "../firebase/auth/auth";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { setEngine } from "crypto";



function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  
  
  const handleForm = async (event: FormEvent) => {
    event.preventDefault();
    
    const { result, error } = await signUp(email, password);
    
    if (error) {
      alert(error);
      return console.log(error);
    }
    
    // else successful
    console.log(result);
    return router.push("/home");
  };
  
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
    console.log(user);
    return router.push("/home");

  }).catch((error) => {
    const errorMessage = error.message;

    console.log(errorMessage);

  });
  }


  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mb-30 mt-60">Sign up</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="email">
            <p>Email</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
        <button onClick={handleGoogleSignIn }>
          <h2 className="text-2xl font-medium">Sign Up with Google</h2>
        </button>
      </div>
    </div>
  );
}

export default SignUp;
