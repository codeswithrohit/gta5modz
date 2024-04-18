import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPinterest, FaLinkedinIn, FaChartBar, FaHome, FaCube, FaTags, FaMoneyBillAlt, FaEllipsisH, FaInfoCircle } from 'react-icons/fa';

import { firebase } from '../Firebase/config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Link from "next/link";
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Import the cart icon

const AvatarMenu = ({ userData,handleLogout }) => {
    const [state, setState] = useState(false);
    const profileRef = useRef();

    const navigation = [
        { title: "Dashboard", path: "javascript:void(0)" },
        { title: "Analytics", path: "javascript:void(0)" },
        { title: "Profile", path: "javascript:void(0)" },
        { title: "Settings", path: "javascript:void(0)" },
    ];

    useEffect(() => {
        const handleDropDown = (e) => {
            if (!profileRef.current.contains(e.target)) setState(false);
        };
        document.addEventListener('click', handleDropDown);
        return () => {
            document.removeEventListener('click', handleDropDown);
        };
    }, []);

    return (
        <div className="relative border-t lg:border-none z-30">
            <div className="">
                <button
                    ref={profileRef}
                    className=""
                    onClick={() => setState(!state)}
                >
                    {userData ? (
                        <FaUser className="md:w-4 md:h-4 w-8 h-8 text-black text-center cursor-pointer" />
                    ) : (
                        <FaUser className="w-full h-full rounded-full" />
                    )}
                </button>
            </div>
            <ul className={`bg-white top-14 right-0 mt-6 space-y-6 lg:absolute lg:border lg:rounded-md lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
            <div class="absolute  right-0 w-48 top-4   bg-white shadow-lg rounded-2xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div
                          class="py-1 border-b border-gray-200 dark:border-gray-600"
                          role="none"
                        >
                          <p class="px-4 pt-2 mb-1 font-normal text-black dark:text-black">
                            Signed in as:
                          </p>
                          <a
                            href="/Profile"
                            class="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600 dark:hover:text-red-600"
                          >
                            <span class="mr-2">
                              {userData.photoURL ? (
                                  <FaUser className="w-4 h-4 text-black cursor-pointer" />
                              ) : (
                                <FaUser className="w-4 h-4 text-black cursor-pointer" />
                              )}
                            </span>
                            {userData.username}
                          </a>
                        </div>

                        <div class="py-1" role="none">
                          <a
                            href="/Order-History"
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Our Order
                          </a>
                        </div>

                        <div class="py-1" role="none">
                          <button
                            onClick={handleLogout}
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-box-arrow-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                                />
                              </svg>
                            </span>
                            Logout
                          </button>
                        </div>
                      </div>
            </ul>
        </div>
    );
};

const SubmenuNavItem = ({ title, Icon }) => (
    <li className="py-1 border-b-2 border-transparent">
        <a href="javascript:void(0)" className="flex items-center justify-start uppercase py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150">
            <Icon className="mr-2" />
            {title}
        </a>
    </li>
);

export default () => {
    const [state, setState] = useState(false);
    const navigation = [
        { title: "3344 mods", path: "javascript:void(0)" },
        { title: "8716 orders", path: "javascript:void(0)" },
    ];
    
    const submenuNav = [
        { title: "Membership", Icon: FaChartBar },
        { title: "Home", Icon: FaHome },
        { title: "All Mods", Icon: FaCube },
        { title: "Bundle", Icon: FaTags },
        { title: "Paid Mod", Icon: FaMoneyBillAlt },
        { title: "Miscellaneous", Icon: FaEllipsisH },
        { title: "About Us", Icon: FaInfoCircle },
    ];

    const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Add a listener to check for changes in the user's authentication state
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'Users', user.email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      } else {
        // Handle case where user data doesn't exist in Firestore
        // You can create a new user profile or handle it based on your app's logic
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true); // Start the loading state
      const auth = getAuth();
      await signOut(auth);
      setIsLoading(false); // End the loading state
      toast.success('You have successfully logged out!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setIsLoading(false); // End the loading state in case of error
      console.error('Error logging out:', error);
    }
  };
console.log("user",user,"userdat",userData)
const [showDropdown, setShowDropdown] = useState(false);

const handleMouseEnter = () => {
  setShowDropdown(true);
};

const handleMouseLeave = () => {
  setShowDropdown(false);
};

    return (
        <div>
            <div className="hidden lg:block px relative z-40 ">
                <section className="py-1 bg-gray-500 px-10 flex justify-between">
                    <div className="flex flex-row">
                        <a href="#"><FaFacebookF className="mx-2 text-white" /></a>
                        <a href="#"><FaTwitter className="mx-2 text-white" /></a>
                        <a href="#"><FaInstagram className="mx-2 text-white" /></a>
                        <a href="#"><FaEnvelope className="mx-2 text-white" /></a>
                        <a href="#"><FaPinterest className="mx-2 text-white" /></a>
                        <a href="#"><FaLinkedinIn className="mx-2 text-white" /></a>
                    </div>
                    <div>
                        <p className="text-white text-xs">Server maintenance is performed every Wednesday 05:00 - 06:00 (UTC)
                            Website backup is performed every day from 23:00 - 23:30 (UTC)
                            Credits are renewed every day at 8:00 (UTC)</p>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-[#007bff] text-white rounded uppercase hover:bg-[#0056b3]">Download Everything for free! become co-owner of our team</button>
                    </div>
                </section>
            </div>
            <header className="text-base bg-white lg:text-sm relative z-40">
                <div className={`bg-white items-center gap-x-14 px-4 max-w-screen-xl mx-auto lg:flex lg:px-8 lg:static ${state ? "h-full fixed inset-x-0" : ""}`}>
                    <div className="flex items-center justify-between py-3 lg:py-5 lg:block">
                        <a href="javascript:void(0)">
                           <h1 className="text-sm font-bold " >logo</h1>
                        </a>
                        <div className="lg:hidden">
                            <button className="text-gray-500 hover:text-gray-800" onClick={() => setState(!state)}>
                                {state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={`nav-menu flex-1 pb-28 mt-8 overflow-y-auto max-h-screen lg:block lg:overflow-visible lg:pb-0 lg:mt-0 ${state ? "" : "hidden"}`}>
                        <ul className="items-center space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
                            <form onSubmit={(e) => e.preventDefault()} className='flex-1 items-center justify-start pb-4 lg:flex lg:pb-0'>
                                <div className="flex items-center gap-1 px-2 border rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Enter name of mod you want here"
                                        className="w-full px-2 py-2 text-gray-500 bg-transparent rounded-md outline-none"
                                    />
                                </div>
                            </form>
                            {navigation.map((item, idx) => (
                                <li key={idx}>
                                    <a href={item.path} className="block text-black hover:text-black py-2 px-4 rounded-md bg-gray-200 hover:bg-white">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                            {userData ? <AvatarMenu handleLogout={handleLogout} userData={userData} /> : <li><Link href="/login"><div className="block text-black hover:text-black py-2 px-4 rounded-md bg-gray-200 hover:bg-white">Login/Register</div></Link></li>}
                        </ul>
                    </div>
                </div>
                <nav className="border-b">
                    <ul className="flex items-center gap-x-3 max-w-screen-xl mx-auto px-4 overflow-x-auto lg:px-8">
                        {submenuNav.map((item, idx) => (
                            <SubmenuNavItem key={idx} title={item.title} Icon={item.Icon} />
                        ))}
                    </ul>
                </nav>
            </header>
        </div>
    );
};
