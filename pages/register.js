/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const handleConfirmPasswordChange = (event) => {
    const { value } = event.target;
    setPasswordMatch(value === formData.password);
    handleFormChange(event);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Check if any required field is empty
    for (const field in formData) {
      if (!formData[field]) {
        toast.error('All fields are required.');
        return;
      }
    }
    
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    // Check if password is at least 6 characters long
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const { email, password, username, firstName, lastName, phoneNumber } = formData;
  
      // Create a user with email and password
      await createUserWithEmailAndPassword(firebase.auth(), email, password);
  
      // Upload profile image to Firebase Storage if selected
      
  
      // Store additional user data in Firestore, including profile image URL if selected
      const db = firebase.firestore();
      await db.collection('Users').doc(email).set({
        email,
        username,
        firstName,
        lastName,
        phoneNumber,
        member:"No Member"
      });
  
      setIsLoading(false);
  
      // Show success toast notification
      toast.success('Your account has been created.');
  
      // Clear the form data
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
  
      router.push('/login');
    } catch (error) {
      setIsLoading(false);
  
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists.');
      } else {
        toast.error('Error signing up: ' + error.message);
      }
    }
  };
  


 
  return (
    <div className='m-auto min-h-screen bg-white dark:bg-white'>
      <section class="m-auto min-h-screen bg-white dark:bg-white">
        <div class="flex justify-center min-h-screen">
         

          <div class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div class="w-full">
              <h1 class="text-2xl font-semibold tracking-wider text-orange-700 capitalize dark:text-white">
                Get your create account now.
              </h1>

              <p class="mt-4 text-orange-700 dark:text-orange-700">
                Let’s get you all set up so you can verify your personal account and begin setting up your profile.
              </p>

              <form class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={handleFormSubmit}>
              <div className="col-span-2 md:col-span-1">
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">User Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                    placeholder="Example@123"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="example@example.com"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
                

                <div className="col-span-2 md:col-span-1">
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    placeholder="first name"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    placeholder="last name"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className='col-span-2'>
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">Phone number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    required
                    placeholder="123-456-7890"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

               

                <div className="col-span-2 md:col-span-1">
                  <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your password"
                    class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
        <label class="block mb-2 text-sm text-orange-700 dark:text-orange-700">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange} // Changed to handleConfirmPasswordChange
          placeholder="Enter your password"
          required
          class="block w-full px-5 py-3 mt-2 text-orange-700 placeholder-orange-700 bg-white border border-red-300 rounded-lg dark:placeholder-orange-700 dark:bg-red-300 dark:text-orange-700 dark:border-red-300 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
        />
        {formData.confirmPassword && (
          <p className={passwordMatch ? 'text-green-500' : 'text-red-500'}>
            {passwordMatch ? 'Password match' : 'Password did not match'}
          </p>
        )}
      </div>

               

             

                <div class="col-span-2">
                <button
          type='submit'
          className={`w-full p-2 rounded-md ${
            isLoading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-300'
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
       
                </div>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
