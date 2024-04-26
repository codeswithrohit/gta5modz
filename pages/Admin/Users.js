import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { firebase } from "../../Firebase/config"; // Import db from Firebase config
import AdminNavbar from "@/components/AdminNavbar";

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when starting to fetch data
        const snapshot = await firebase.firestore().collection('Users').get();
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => doc.data());
          setUsers(data);
        } else {
          console.log('No users found!');
          setUsers([]); // Set users to an empty array if no users found
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };
  
    fetchData();
  }, []);

  console.log("user", users);

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="lg:ml-64">
        {loading ? ( // Display loading indicator if loading is true
          <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
            <span className='sr-only'>Loading...</span>
            <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
          </div>
        ) : (
          <div className="bg-white px-8 rounded-md w-full py-2 ">
            <div className="flex items-center justify-between pb-6">
              <div>
                <h2 className="text-black font-semibold">Users</h2>
                <span className="text-xs">All Users</span>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                {users.length === 0 ? (
                  <p>No Users found.</p>
                ) : (
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Phone Number
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Username
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.phoneNumber}</td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.username}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
