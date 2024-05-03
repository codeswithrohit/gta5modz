/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { email, password } = formData;

      // Sign in with email and password
      await signInWithEmailAndPassword(firebase.auth(), email, password);

      // Show success toast notification
      toast.success('Login successful.');
      
      router.push('/')
      // Redirect to dashboard or other authenticated page
      // You can use React Router or other methods to handle the redirection

      setLoading(false); // Set loading to false after successful login
    } catch (error) {
      // Show error toast notification
      toast.error('Email and Password are incorrect ', {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false); // Set loading to false after encountering an error
    }
  };

  return (
    <div className='bg-white' >
      <form onSubmit={handleFormSubmit}>
        <div className="flex h-screen w-screen items-center overflow-hidden px-2">
          <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
            <div className="-z-10 absolute top-4 left-1/2 h-full w-5/6 -translate-x-1/2 rounded-lg bg-blue-600 sm:-right-10 sm:top-auto sm:left-auto sm:w-full sm:translate-x-0"></div>
            <div className="mx-auto mb-2 space-y-3">
              <h1 className="text-center text-3xl font-bold text-gray-700">Sign in</h1>
              <p className="text-gray-500">Sign in to access your account</p>
            </div>

            <div>
              <div className="relative mt-2 w-full">
                <input  
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email address"
                  aria-label="Email Address"
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"  
                />
                <label htmlFor="email" className="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300"> Enter Your Email </label>
              </div>
            </div>

            <div>
              <div className="relative mt-2 w-full">
                <input  
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Password"
                  aria-label="Password"
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"  
                />
                <label htmlFor="password" className="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300"> Enter Your Password</label>
              </div>
            </div>
            <div className="flex w-full items-center">
              <button disabled={loading} type="submit" className="shrink-0 inline-block w-36 rounded-lg bg-gray-600 py-3 font-bold text-white">  {loading ? 'Signing in...' : 'Sign in'}</button>
              <a className="w-full text-center text-sm font-medium text-gray-600 hover:underline" href="/Forgotpassword">Forgot your password?</a>
            </div>
            <p className="text-center text-gray-600">
              Don't have an account?
              <a href="/register" className="whitespace-nowrap font-semibold text-gray-900 hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login;
