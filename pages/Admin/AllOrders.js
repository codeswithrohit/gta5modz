import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { firebase } from "../../Firebase/config"; // Import db from Firebase config
import AdminNavbar from "@/components/AdminNavbar";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when starting to fetch data
        const snapshot = await firebase.firestore().collection('orders').get();
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(data);
        } else {
          console.log('No orders found for this user!');
          setOrders([]); // Assuming you want to set orders to an empty array if no orders found
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };
  
    fetchData();
  
  }, []);
  



  return (
    <div className="min-h-screen bg-white">
        <AdminNavbar/>
      <div className="lg:ml-64" >
        {loading ? ( // Display loading indicator if loading is true
          <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
            <span class='sr-only'>Loading...</span>
            <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
          </div>
        ) : (
          <div class="bg-white px-8 rounded-md w-full py-2 ">
            <div class=" flex items-center justify-between pb-6">
              <div>
                <h2 class="text-black font-semibold">Products Order</h2>
                <span class="text-xs">All products item</span>
              </div>
            </div>
            <div>
              <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  {orders.length === 0 ? (
                    <p>No orders found.</p>
                  ) : (
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Product Name
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Email
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            OrderId
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Amount
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index}>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                             
                            {Object.keys(order.cart).map((key) => {
                            const product = order.cart[key];
                            return (
                              <div key={key} className="flex items-center">
                              <img  src={product.frontImage}
                    alt={product.name} className="w-10 h-10 mr-2 rounded-sm" />
                              <span>{product.name}</span>
                            </div>
                            );
                          })}
                     
            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.email}</td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.oid}</td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.subTotal}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <Link
                                href={`/Admin/adminorder?id=${order.id}`}
                                legacyBehavior
                              >
                                <span className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                  <span
                                    aria-hidden
                                    className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                  ></span>
                                  <span className="relative">
                                    Details
                                  </span>
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
