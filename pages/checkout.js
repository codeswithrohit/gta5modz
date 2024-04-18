import React, { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";
const Checkout = ({ cart, clearCart, subTotal, dateRange,setSubTotal }) => {
  console.log(cart);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ value: null });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("pay");
  const [orderId, setOrderId] = useState(null);
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
        setMobileNumber(userData?.mobileNumber || "");
        setAddress(userData?.address || "");
      }
      setLoading(false); // Set loading to false after user data is fetched
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  useEffect(() => {
    // ... (existing code)

    // Fetching user data and setting input fields with user data
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      const extractLastTenDigits = (phoneNumber) => {
        const trimmedNumber = phoneNumber.toString().replace(/\D/g, ""); // Remove non-digit characters
        return trimmedNumber.slice(-10); // Extract last 10 digits
      };

      setPhone(
        userData?.mobileNumber
          ? extractLastTenDigits(userData.mobileNumber)
          : ""
      );

      setAddress(userData.address || "");
    }
  }, [userData]);

  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      phone.length > 3 &&
      address.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, address, phone]);

  const handleChange = (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    }

    if (name && email && phone && address) {
      setDisabled(false);
    }
  };

  const submitOrderToMongoDB = async (oid) => {
    try {
      const orderData = {
        name: name,
        email: email,
        orderId: oid,
        address: address,
        phone: phone,
        amount: subTotal,
        products: cart,
      };
  
      const response = await fetch('/api/submitOrderToMongoDB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        // Order saved successfully
        const responseData = await response.json();
        console.log('Order Id:', responseData); // Log the order ID
        setOrderId(responseData.orderId); // Store the order ID in state
        // router.push(`/order?clearCart=1&id=${responseData.orderId}`);
        router.push(responseData.redirectUrl);
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.error('Failed to submit order:', errorMessage);
        toast.error('Failed to submit order. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error submitting order to MongoDB:', error);
      toast.error('Failed to submit order. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  


  const initiatePayment = async () => {
    setIsLoading(true);
    let oid = Math.floor(Math.random() * Date.now());
  
    if (paymentMethod === "cod") {
      // If Cash On Delivery is selected, submit data to MongoDB
      await submitOrderToMongoDB(oid);
      clearCart(); // Clear the cart after submitting the order
      toast.success("Order confirmed successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
    } else if (paymentMethod === "pay") {
      const data = { cart, subTotal, oid, email: email, name, address, phone };
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let txnRes = await a.json();
      if (txnRes.success) {
        //console.log(txnRes)
        let txnToken = txnRes.txnToken;
  
        var config = {
          root: "",
          flow: "DEFAULT",
          data: {
            orderId: oid /* update order id */,
            token: txnToken /* update token value */,
            tokenType: "TXN_TOKEN",
            amount: subTotal /* update amount */,
          },
          handler: {
            notifyMerchant: function (eventName, data) {
              console.log("notifyMerchant handler function called");
              console.log("eventName => ", eventName);
              console.log("data => ", data);
            },
          },
        };
  
        window.Paytm.CheckoutJS.init(config)
          .then(function onSuccess() {
            // after successfully updating configuration, invoke JS Checkout
            window.Paytm.CheckoutJS.invoke();
            setIsLoading(false);
          })
          .catch(function onError(error) {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        if (txnRes.cartClear) {
          clearCart();
        }
        toast.error(txnRes.error, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  
  const [discountPrice, setDiscountPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponData, setCouponData] = useState([]);

  useEffect(() => {
    // Fetch coupon data from Firestore
    const db = firebase.firestore();
    const couponRef = db.collection("Coupan");

    couponRef
      .get()
      .then((querySnapshot) => {
        const coupons = [];
        querySnapshot.forEach((doc) => {
          coupons.push({ ...doc.data(), id: doc.id });
        });

        setCouponData(coupons);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);

  console.log(couponData);

  // Function to handle applying the coupon code
  const applyCoupon = () => {
    const matchedCoupon = couponData.find(
      (coupon) => coupon.code.toUpperCase() === couponCode.toUpperCase()
    );
  
    if (matchedCoupon) {
      const expiryDate = new Date(matchedCoupon.expirydate);
  
      if (expiryDate > new Date()) {
        const discount = parseFloat(matchedCoupon.price);
        setDiscountPrice(discount);
        const percentage = subTotal/discount
        const discountAmount = subTotal - percentage;
  
        console.log("Subtotal before discount:", subTotal);
        console.log("Discount amount:", discount);
        console.log("New Subtotal after discount:", discountAmount);
        setSubTotal(discountAmount);
        setCouponApplied(true);
      } else {
        setCouponApplied(false);
        console.error("Coupon has expired.");
        toast.error("Coupon has expired.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      setCouponApplied(false);
      console.error("Invalid coupon code. Please try again.");
      toast.error("Invalid coupon code. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  
  const hasSelectedDate = Object.values(cart).some((item) => item.selectedDate);
  return (
    <div >
      <div class="relative font-sans min-h-screen mx-auto w-full bg-white">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Script
          type="application/javascript"
          crossorigin="anonymous"
          src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
        />
        <div class="grid py-12  grid-cols-10">
          <div class="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div class="mx-auto w-full max-w-lg">
              <h1 class="relative uppercase text-2xl font-medium text-black sm:text-3xl">
                {" "}
                Checkout
                <span class="mt-2 block h-1 w-10 bg-red-600 sm:w-20"></span>
              </h1>
              <form action="" class="mt-10 flex flex-col space-y-4">
                <div>
                  <label for="name" class="text-xs font-semibold text-black">
                    Name
                  </label>
                  <input
                    onChange={handleChange}
                    value={name}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Your Name"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label for="email" class="text-xs font-semibold text-black">
                    Email
                  </label>
                  {user && user.token ? (
                    <input
                      value={user.email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                      readOnly // Making the input read-only when the user is logged in
                    />
                  ) : (
                    <input
                      onChange={handleChange}
                      value={email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                      // Allowing the user to type in the email when not logged in
                    />
                  )}
                </div>

                <div>
                  <label for="phone" class="text-xs font-semibold text-black">
                    Mobile Number
                  </label>
                  <input
                    onChange={handleChange}
                    value={phone}
                    type="phone"
                    id="phone"
                    name="phone"
                    placeholder="Enter Your 10 Digit Phone Number"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label for="address" class="text-xs font-semibold text-black">
                    Address
                  </label>
                  <textarea
                    onChange={handleChange}
                    value={address}
                    name="address"
                    id="address"
                    cols="30"
                    row="2"
                    placeholder="Enter Your Address"
                    class="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>
              </form>
              <p class="mt-10 text-center text-sm font-semibold text-black">
                By placing this order you agree to the{" "}
                <a
                  href="#"
                  class="whitespace-nowrap text-red-600 underline hover:text-red-600"
                >
                  Terms and Conditions
                </a>
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
  {hasSelectedDate ? (
    <div className="flex items-center">
      <input
        type="radio"
        className="w-5 h-5 cursor-pointer"
        id="cod"
        checked={paymentMethod === "cod"}
        onChange={() => handlePaymentMethodChange("cod")}
      />
      <label
        htmlFor="cod"
        className="ml-4 flex gap-2 cursor-pointer"
      >
        <h1>Pay at checkout </h1>
      </label>
    </div>
  ) : (
    <div className="flex items-center">
      <input
        type="radio"
        className="w-5 h-5 cursor-pointer"
        id="card"
        checked={paymentMethod === "cod"}
        onChange={() => handlePaymentMethodChange("cod")}
      />
      <label
        htmlFor="card"
        className="ml-4 flex gap-2 cursor-pointer"
      >
        <h1>Cash On Delivery</h1>
      </label>
    </div>
  )}
  <div className="flex items-center">
    <input
      type="radio"
      className="w-5 h-5 cursor-pointer"
      id="paypal"
      checked={paymentMethod === "pay"}
      onChange={() => handlePaymentMethodChange("pay")}
    />
    <label
      htmlFor="paypal"
      className="ml-4 flex gap-2 cursor-pointer"
    >
      <h1>Pay</h1>
    </label>
  </div>
</div>


              {isLoading ? (
  <div className="mx-4">
    <button className="mt-4 inline-flex w-full items-center justify-center rounded bg-red-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-red-600 sm:text-lg">
      Loading...
    </button>
  </div>
) : (
  paymentMethod === "pay" && (
    <Link href="/checkout">
      <button
        disabled={disabled}
        // onClick={initiatePayment} // commented to remove payment. 
        className="mt-4 inline-flex w-full items-center justify-center rounded bg-red-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-red-600 sm:text-lg"
      >
        Make Payment ₹{subTotal}
      </button>
    </Link>
  )
)}

{paymentMethod === "cod" && (
  <button
    disabled={disabled}
    onClick={initiatePayment}
    className="mt-4 inline-flex w-full items-center justify-center rounded bg-red-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-red-600 sm:text-lg"
  >
    Confirm Order ₹{subTotal}
  </button>
)}


            </div>
          </div>
        

          <div class="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
            <div class="px-4 pt-8">
              <p class="text-xl font-medium uppercase">Order Summary</p>
              <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
  {Object.keys(cart).length === 0 && (
    <div className="my-4 font-semibold uppercase">Your Cart is Empty!</div>
  )}
  <div>
    {Object.keys(cart).map((k) => (
      <div key={k} className="flex flex-col rounded-lg bg-white sm:flex-row">
        <img
          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
          src={cart[k].frontImage}
          alt= {cart[k].name}
        />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold text-center">
            {cart[k].name}
          </span>
          <p className="text-lg font-bold text-center">
            ₹ {cart[k].price}
          </p>
          {/* Display the selected dates in the cart */}
          {cart[k].selectedDate && (
            <p className="text-center text-sm text-black">
              Booking Date: {cart[k].selectedDate.start} - {cart[k].selectedDate.end}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

              <div className="flex justify-center items-center mt-2 ">
                <Link href="/our-store">
                  <button className="px-6 py-3 text-white bg-green-600 rounded-md shadow-lg hover:bg-green-600">
                    Back to our Store
                  </button>
                </Link>
              </div>
              <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
  <h1 class="text-2xl font-semibold mb-4">Apply Coupon Code</h1>
  <span class="block text-gray-700 font-semibold mb-2">For Discount</span>
  <div class="mb-4">
    <input
      type="text"
      id="coupon"
      name="coupon"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500"
      placeholder="Enter your coupon code"
    />
  </div>
  <div class="text-center">
    <button
      onClick={applyCoupon}
      class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
    >
      Apply Coupon
    </button>
  </div>
{couponApplied && discountPrice > 0 && (
  <div class="mt-4 text-green-500">
    Coupon code applied successfully! You saved Flat {discountPrice}%.
  </div>
)}
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
