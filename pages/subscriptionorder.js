import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { firebase } from '../Firebase/config';

const db = firebase.firestore();

const OrderConfirmation = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      const fetchData = async () => {
        try {
          const doc = await firebase.firestore().collection('subscriptions').doc(id).get();
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

  return (
    <div className="bg-white min-h-screen" >
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto py-10">
      {bookingData && (
        <>
          <h1 className="text-2xl font-semibold mb-4">Booking Information</h1>
          <div className="mb-4">
            <h2 className="text-lg font-medium">User Data</h2>
            <ul>
              <li><strong>First Name:</strong> {bookingData.userData.firstName}</li>
              <li><strong>Last Name:</strong> {bookingData.userData.lastName}</li>
              <li><strong>Email:</strong> {bookingData.userData.email}</li>
              <li><strong>Phone Number:</strong> {bookingData.userData.phoneNumber}</li>
            </ul>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-medium">Plan Data</h2>
            <ul>
              <li><strong>Plan Name:</strong> {bookingData.planData.planName}</li>
              <li><strong>Price:</strong> ${bookingData.planData.price}</li>
              <li><strong>Duration:</strong> {bookingData.planData.duration}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-medium">Timestamp</h2>
            <p>{new Date(bookingData.timestamp.seconds * 1000).toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default OrderConfirmation;
