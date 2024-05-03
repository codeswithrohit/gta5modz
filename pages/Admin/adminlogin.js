/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router"; // Import useRouter to handle client-side navigation
import Link from "next/link";

const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use useRouter hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        firebase.auth(),
        email,
        password
      );

      // Access user object from userCredential
      const user = userCredential.user;

      // Check if the user is an admin
      if (user) {
        const isAdmin = await checkAdminPrivileges(user.email);
        if (isAdmin) {
          // Store the isAdmin status in local storage
          localStorage.setItem("isAdmin", true);
          // Redirect to the admin home page after successful login
          // Replace '/admin/home' with your desired admin home page route
          router.push("/Admin");
        } else {
          // If the user is not an admin, show an error message
          toast.error("You are not authorized to access the admin dashboard.");
          // You can redirect the user to a different page if needed
        }
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the user has admin privileges based on their UID
  const checkAdminPrivileges = async (email) => {
    // You need to implement the logic to check if the user is an admin
    // This could involve fetching the user data from Firestore and checking a 'isAdmin' field
    // Replace this with your actual implementation
    const adminUser = await firebase
      .firestore()
      .collection("Adminusers")
      .doc(email)
      .get();
    if (adminUser.exists) {
      const isAdmin = adminUser.data().isAdmin;
      return isAdmin;
    }
    return false;
  };
  return (
    <div className="min-h-screen bg-white flex justify-center items-center" >
<div class="container px-4 mx-auto">
  <div class="max-w-lg mx-auto">
    <div class="text-center mb-6">
      <h2 class="text-3xl md:text-4xl font-extrabold">Sign in</h2>
    </div>
    <form onSubmit={handleLogin}>
      <div class="mb-6">
        <label class="block mb-2 font-extrabold" for="">Email</label>
        <input class="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-gray-900 bg-white shadow border-2 border-gray-900 rounded"  type="email"
                 
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
      </div>
      <div class="mb-6">
        <label class="block mb-2 font-extrabold" for="">Password</label>
        <input class="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-gray-900 bg-white shadow border-2 border-gray-900 rounded"  type="password"
               
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="**********"/>
      </div>
      <div class="flex flex-wrap -mx-4 mb-6 items-center justify-between">
      
        <div class="w-full lg:w-auto px-4"><a class="inline-block font-extrabold hover:underline"  href="/Admin/Forgotpassword">Forgot your
            password?</a></div>
      </div>
      <button  type="submit"
                  disabled={loading} class="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-gray-800 hover:bg-gray-900 border-3 border-gray-900 shadow rounded transition duration-200">  {loading ? "Signing In..." : "Sign In"}</button>
     
    </form>
  </div>
</div>
<ToastContainer />
    </div>
  )
}

export default Adminlogin