import React,{useState,useEffect} from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import { useRouter } from "next/router";
const Subscription = ({user,userData}) => {

  const router = useRouter();
  // Define an array of plan data
  const plans = [
    {
      id: 1,
      name: "DIAMOND MEMBER",
      img:"https://gta5modaz.com/wp-content/uploads/2021/08/silver-1.png",
      price: 34.95,
      duration: "MONTH",
      features: [
        "Get access to Diamond Mods - Weapon - Vehicle - Map/Prop Area. (Paid Mod not included)",
        "Get an EXTRA 15% DISCOUNT when buying PAID MODS",
        "12 Download per day. Totally 360 download per month.",
        "Your support help us keep the website up and running",
        "Live Chat support 24/7",
        "All Mods won't be released anywhere else ever",
        "Secure payment with Razorpay"
      ]
    },
    {
      id: 2,
      name: "CO-OWNER MEMBER",
      img:"https://gta5modaz.com/wp-content/uploads/2021/08/exclusive.png",
      price: 699,
      duration: "ONE TIME PAYMENT",
      features: [
        "Download Everything on Website for FREE!",
        "Download All Diamond Mods Area unlimited times for life for FREE",
        "Download All Paid Mods Area unlimited times for life for FREE",
        "Download All Bundle Area unlimited times for life for FREE",
        "You are the Co-owner member of our TEAM !",
        "Secure payment with Razorpay"
      ]
    },
    {
      id: 3,
      name: "LIFETIME DIAMOND",
      img:"https://gta5modaz.com/wp-content/uploads/2021/08/gold140.png",
      price: 299,
      duration: "ONE TIME PAYMENT",
      features: [
        "Get access to Diamond Mods - Weapon - Vehicle - Map/Prop Area. (Paid Mod not included)",
        "Get an EXTRA 20% DISCOUNT when buying PAID MODS",
        "Unlimited download",
        "You support our TEAM alot !",
        "Can ask for Technical support",
        "All Mods won't be released anywhere else ever",
        "Secure payment with Razorpay"
      ]
    }
  ];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const [isLoading, setIsLoading] = useState(false);

  const openPopup = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const loadScript = async (src) => {
    try {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
        return true;
    } catch (error) {
        console.error('Error loading script:', error);
        toast.error('Failed to load Razorpay SDK. Please try again later.');
        return false;
    }
};

  const initiatePayment = async () => {
    try {
      setIsLoading(true);
      const userDataToSubmit = {
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phoneNumber: userData?.phoneNumber || '',
      };

      const planDataToSubmit = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        duration: selectedPlan.duration,
      };

      const submissionData = {
        userData: userDataToSubmit,
        planData: planDataToSubmit,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // Display payment modal
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Failed to load Razorpay SDK. Please try again later.');
        return;
      }
  
      const amountInPaise = selectedPlan.price* 100;
  
      const options = {
        key: 'rzp_test_td8CxckGpxFssp', // Replace 'YOUR_RAZORPAY_KEY' with your actual Razorpay API key
        currency: 'INR',
        amount: amountInPaise,
        name: 'Games',
        description: 'Thanks for purchasing',
        image: 'logo.png',
        handler: async function (response) {
          try {
            // Handle payment success
             await firebase.firestore().collection('Users').doc(userData?.email).update({
            member: selectedPlan.name // Update the 'member' field with the selected plan's name
          });
            const docRef = await firebase.firestore().collection('subscriptions').add(submissionData);
            console.log('Payment Successful:', response);
            console.log("id",docRef.id)
            toast.success('Payment Successful!');
            router.push(`/subscriptionorder?id=${docRef.id}`); // Redirect to confirmation page with Firebase document ID
          } catch (error) {
            console.error('Error handling payment success:', error);
            toast.error('Failed to handle payment. Please contact support.');
          }
        },
        prefill: {
          name: userData?.firstName || '',
          email: userData?.email || '',
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const PlanPopup = ({ plan }) => (
    <div className="fixed top-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
    <div class="font-[sans-serif] bg-gray-50">
      <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
        <div class="bg-[#3f3f3f] lg:h-screen lg:sticky lg:top-0">
          <div class="relative h-full">
            <div class="p-8 lg:overflow-auto lg:h-[calc(100vh-60px)]">
              <h2 class="text-2xl font-bold text-white">Order Summary</h2>
              <div class="space-y-6 mt-10">
                
                <div class="grid sm:grid-cols-2 items-start gap-6">
                  <div class="px-4 py-6 shrink-0 bg-gray-50 rounded-md">
                    <img src={plan.img} class="w-full object-contain" />
                  </div>
                  <div>
                    <h3 class="text-base text-white">{plan.name}</h3>
                    <ul class="text-xs text-white space-y-3 mt-4">
                    <p className="text-white font-bold text-xl mb-4">${plan.price} / {plan.duration}</p>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute left-0 bottom-0 bg-[#444] w-full p-4">
              <h4 class="flex flex-wrap gap-4 text-base text-white">Total <span class="ml-auto">${plan.price}</span></h4>
            </div>
          </div>
        </div>
        <div class="xl:col-span-2 h-max rounded-md p-8 sticky top-0">
          <h2 class="text-2xl font-bold text-[#333]">Complete your order</h2>
          <form class="mt-10">
            <div>
              <h3 class="text-lg font-bold text-[#333] mb-6">Personal Details</h3>
              <div class="grid sm:grid-cols-2 gap-6">
                <div class="relative flex items-center">
                  <input type="text" placeholder="First Name" value={userData?.firstName || ""}
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"></path>
                  </svg>
                </div>
                <div class="relative flex items-center">
                  <input type="text" placeholder="Last Name"  value={userData?.lastName || ""}
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"></path>
                  </svg>
                </div>
                <div class="relative flex items-center">
                  <input type="email" placeholder="Email"   value={userData?.email || ""}
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 682.667 682.667">
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                      </clipPath>
                    </defs>
                    <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                      <path fill="none" stroke-miterlimit="10" stroke-width="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"></path>
                    </g>
                  </svg>
                </div>
                <div class="relative flex items-center">
                  <input type="number" placeholder="Phone No."    value={userData?.phoneNumber || ""}
                    class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" />
                  <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                    <path
                      d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                      data-original="#000000"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="mt-6">
            
              <div class="flex gap-6 max-sm:flex-col mt-10">
                <button onClick={closePopup} type="button" class="rounded-md px-6 py-3 w-full text-sm font-semibold bg-transparent hover:bg-gray-100 border-2 text-[#333]">Cancel</button>
                {isLoading ? (
  <div className="loader">Loading...</div>
) : (
  <button
    type="button"
    onClick={initiatePayment}
    className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-[#333] text-white hover:bg-[#222]"
  >
    Complete Purchase
  </button>
)}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );



  return (
    <div className='bg-white'>
      <main className="max-w-6xl mx-auto pt-10 pb-36 px-8">
        <div className="max-w-md mx-auto mb-14 text-center">
          <h1 className="text-4xl font-semibold mb-6 lg:text-5xl"><span className="text-indigo-600">Flexible</span> Plans</h1>
          <p className="text-xl text-gray-500 font-medium">Choose a plan that works best for you and your team.</p>
        </div>

        <div className="flex flex-col justify-between items-center lg:flex-row lg:items-start">
          {plans.map(plan => (
            <div key={plan.id} className="w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none transition-transform duration-300 transform hover:scale-105">
              <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                <img src={plan.img} alt="" className="rounded-3xl w-20 h-20" />
                <div className="ml-5">
                  <span className="block text-xl font-bold">{plan.name}</span>
                  <span><span className="font-medium text-gray-500 text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold">{plan.price} </span></span><span className="text-gray-500 font-medium">/ {plan.duration}</span>
                  <span className="block text-xs font-bold text-yellow-500">Your support help us keep the website up and running, help our TEAM work</span>
                </div>
              </div>
              <ul className="mb-7 font-medium text-gray-500">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex text-lg mb-2">
                    <img src={"https://res.cloudinary.com/williamsondesign/check-grey.svg"} alt="check mark" />
                    <span className="ml-3">{feature}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => openPopup(plan)} className="flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl">
                Choose Plan
                <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" alt="arrow" className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </main>
      <ToastContainer/>
      {showPopup && <PlanPopup plan={selectedPlan} />}
    </div>
  );
};

export default Subscription;
