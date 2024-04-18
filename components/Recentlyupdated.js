import React, { useState, useEffect, Productef, useRef } from "react";
import { firebase } from "../Firebase/config";
const RecentlyUpdated = () => {
  const [Productdata, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const ProductsRef = db.collection("Product");

      ProductsRef.get()
        .then((querySnapshot) => {
          const Productdata = [];
          querySnapshot.forEach((doc) => {
            Productdata.push({ ...doc.data(), id: doc.id });
          });

          setProductData(Productdata);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className='px-4 sm:px-12 grid grid-cols-1 sm:grid-cols-4 gap-4' >
       {isLoading ? (
              <h1>Loading</h1>
            ) : (
              Productdata.map((Product, idx) => (
      <div key={Product.id} className="bg-white shadow rounded">
        <a href={`/Product-Details?id=${Product.id}`} >
       <div
  className="h-48 bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center"
  style={{ backgroundImage: `url(${Product.frontImage})` }}
>
          
          <div>
            <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
              co-owner
            </span>
          </div>
        </div></a>
        <div className="p-4 flex flex-col items-center">
          <p className="text-gray-400 font-light text-xs text-center">{Product.name}</p>
          <p className="text-center text-gray-800 mt-1">₹{Product.price}</p>
          <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center">
            Add to Cart
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
              )))}

    </div>
  );
};

export default RecentlyUpdated;
