import React,{useState} from 'react';

const Subscription = () => {
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




  const openPopup = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };




  const PlanPopup = ({ plan }) => (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-xl max-w-md">
        <h2 className="text-2xl font-bold mb-4">{plan.name} Details</h2>
        <p className="text-gray-600 mb-4">${plan.price} / {plan.duration}</p>
        <ul className="text-gray-600 mb-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" alt="check mark" className="w-4 h-4 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button onClick={closePopup} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Close</button>
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
                <img src={`https://gta5modaz.com/wp-content/uploads/2021/08/${plan.id}.png`} alt="" className="rounded-3xl w-20 h-20" />
                <div className="ml-5">
                  <span className="block text-xl font-bold">{plan.name}</span>
                  <span><span className="font-medium text-gray-500 text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold">{plan.price} </span></span><span className="text-gray-500 font-medium">/ {plan.duration}</span>
                  <span className="block text-xs font-bold text-yellow-500">Your support help us keep the website up and running, help our TEAM work</span>
                </div>
              </div>
              <ul className="mb-7 font-medium text-gray-500">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex text-lg mb-2">
                    <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" alt="check mark" />
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
      {showPopup && <PlanPopup plan={selectedPlan} />}
    </div>
  );
};

export default Subscription;
