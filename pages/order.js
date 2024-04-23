import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Order from "../models/Order";
import mongoose from "mongoose";
import Link from "next/link";
const OrderConfirmation = ({ order }) => {
  const products = order.products;
  const router = useRouter();
  useEffect(() => {
    if (router.query.cleaCart == 1) {
      clearCart();
    }
  });
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
    <div>
      <div className="py-12 px-6 lg:px-12 xl:px-24 mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-semibold text-black mb-6">
            Order Placed Successfully
          </h1>

          <div className="mb-8">
            <p className="text-lg text-black">Order ID: #{order.orderId}</p>
            <p className="text-base text-black">
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="mb-8">
            {Object.keys(products).map((key) => {
              return (
                <div key={key} className="flex items-center mb-4">
                  <img
                    src={products[key].frontImage}
                    alt={products[key].name}
                    className="w-16 h-16 mr-4 rounded-md"
                  />
                  <div>
                    <p className="text-lg text-black">
                      {products[key].name}
                    </p>
                    {!(products[key].qty && products[key].selectedDate) && (
                      <p className="text-sm text-black">
                        {products[key].qty} x ₹{products[key].price}
                      </p>
                    )}
                  
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-8">
            <p className="text-lg text-black">Total: ₹{order.amount}</p>
          </div>
         

          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-8">
            <p className="text-sm">
              Thank you for your order! We'll process it shortly.
            </p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const order = await Order.findById(context.query.id);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default OrderConfirmation;
