import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { firebase } from '../../Firebase/config';
import AdminNavbar from "@/components/AdminNavbar";

const db = firebase.firestore();
const OrderConfirmation = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      const fetchData = async () => {
        try {
          const doc = await db.collection('orders').doc(id).get();
          if (doc.exists) {
            setBookingData(doc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      };
      fetchData();
    }
  }, [router.query]);

  useEffect(() => {
    // Log booking data when it changes
    if (bookingData) {
      console.log("booking", bookingData);
    }
  }, [bookingData]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-white " >
        <AdminNavbar/>
        <div className="lg:ml-64" >
      {bookingData && (
        <div className="py-12 px-6 lg:px-12 xl:px-24 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-semibold text-black mb-6">
              Order Placed Successfully
            </h1>

            <div className="mb-8">
              <p className="text-lg text-black">Order ID: #{bookingData.oid}</p>
              {/* <p className="text-base text-black">
                Ordered on {formatDate(bookingData.createdAt)}
              </p> */}
            </div>

            <div className="mb-8">
              {Object.keys(bookingData.cart).map((key) => {
                const product = bookingData.cart[key];
                return (
                  <div key={key} className="flex items-center mb-4">
                    <img
                      src={product.frontImage}
                      alt={product.name}
                      className="w-16 h-16 mr-4 rounded-md"
                    />
                    <div>
                      <p className="text-lg text-black">{product.name}</p>
                      <p className="text-sm text-black">
                        {product.qty} x ${product.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-8">
              <p className="text-lg text-black">Total: ${bookingData.subTotal}</p>
            </div>

            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-8">
              <p className="text-sm">
                Thank you for your order! We'll process it shortly.
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
