
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { firebase } from "../Firebase/config";
import "firebase/firestore";
import "firebase/storage";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = ({ bookNow, addToCart,cart }) => {
  console.log(cart)
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const handleRatingSelection = (selectedRating) => {
    setRating(selectedRating === rating ? 0 : selectedRating);
  };

  const [productdata, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("description"); // State to manage active tab

  // Your existing code for fetching product data, reviews, and user data...

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
  
    const db = firebase.firestore();
    const productRef = db.collection("Bundlemod").doc(id);
  
    productRef.get().then((doc) => {
      if (doc.exists) {
        // Use doc.id to include the document ID in the product data
        setProductData({ ...doc.data(), id: doc.id });
      } else {
        console.log("Document not found!");
      }
      setIsLoading(false);
    });
  }, []);
  

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    // Fetch reviews for the product
    const fetchReviews = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (!id) {
          throw new Error("No ID found in URL params");
        }

        const db = firebase.firestore();
        const reviewsRef = db
          .collection("Product")
          .doc(id)
          .collection("reviews")
          .where('approved', '==', 'Active')

        const snapshot = await reviewsRef.get();
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (reviewsData.length > 0) {
          // Calculate average rating only if reviews exist and have a 'rating' field
          const totalRating = reviewsData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          const avgRating = totalRating / reviewsData.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0);
        }

        setReviews(reviewsData);
        setLoadingReviews(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoadingReviews(false);
        // Handle specific errors or set error state for UI feedback
      }
    };


    if (id) {
      fetchReviews();
    }
  }, []);

  const shareOnSocialMedia = async (platform) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productdata.productname,
          text: productdata.description,
          url: window.location.href
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(productdata.description)}`, '_blank');
          break;
        case 'instagram':
          // For Instagram, you might need a different approach (as it doesn't support direct sharing via URL)
          // You can show a popup/modal with instructions or use a third-party library that supports Instagram sharing.
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        default:
          break;
      }
    }
  };

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
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
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  const [submitting, setSubmitting] = useState(false);
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userData) {
      // Show a toast message
      toast.error("Please log in before submitting a review", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect the user to the login page
      router.push("/signin");
      return;
    }
    const formData = new FormData(e.target);
    const message = formData.get('message');
  
    if (rating > 0 && message.trim() !== '') {
      try {
        setSubmitting(true); // Set loading state to true while submitting review
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        const db = firebase.firestore();
        const reviewRef = db
        .collection("Product")
        .doc(id)
        .collection("reviews")
  
        // Add the review to Firestore
        await reviewRef.add({
          message: message,
          approved:"Pending",
          rating: rating,
          userName: userData ? userData.name : '',
          userEmail: userData ? userData.email : '',
          userPhotoURL: userData ? userData.photoURL : '',
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
  
        // Clear form and set loading to false after successful review submission
        e.target.reset();
        setRating(0);
        setSubmitting(false);
  
        // Display success toast message
        toast.success('Review submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error('Error submitting review:', error);
        setSubmitting(false); // Set loading state to false in case of an error
        toast.error('Failed to submit review. Please try again later.', {
          // Display error toast message
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      console.error('Please select a rating and enter a message before submitting.');
    }
  };
  useEffect(() => {
    const imageContainer = document.querySelector(".imageContainer");

    if (imageContainer) { // Check if imageContainer exists
      const handleMouseMove = (e) => {
        const { left, top, width, height } = imageContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        imageContainer.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      };

      const handleMouseLeave = () => {
        imageContainer.style.transform = "none";
      };

      imageContainer.addEventListener("mousemove", handleMouseMove);
      imageContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        imageContainer.removeEventListener("mousemove", handleMouseMove);
        imageContainer.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);


  return (
    <div class="font-[sans-serif] bg-white ">
         {isLoading ? (
          <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
          <span class='sr-only'>Loading...</span>
           <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
         <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
         <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
     </div>
        ) : (
    <div class="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
      <div class="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
        <div class="w-full lg:sticky top-0 text-center">
          <div class="lg:h-[600px]">
            <img    src={productdata.frontImage} alt="Product" class="lg:w-11/12 w-96 h-96 rounded-xl object-cover object-top" />
          </div>
        
        </div>
        <div>
          <div class="flex flex-wrap items-start gap-4">
            <div>
              <h2 class="text-2xl font-extrabold text-gray-800">{productdata.name}</h2>
              <p class="text-sm text-gray-400 mt-2">{productdata.MemberType} Membership</p>
            </div>
          
          </div>
          <hr class="my-8" />
          <div class="flex flex-wrap gap-4 items-start">
            <div>
              <p class="text-gray-800 text-3xl font-bold">${productdata.price}</p>
              {/* <p class="text-gray-400 text-xl mt-1"><strike>$42</strike> <span class="text-sm ml-1">Tax included</span></p> */}
            </div>
            <div class="flex flex-wrap gap-4">
              <button type="button" class="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center">
                <svg class="w-3 mr-1" fill="currentColor" viewBox="0 0 14 13"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                {averageRating.toFixed(1)}
              </button>
              {/* <button type="button" class="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 mr-1" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M14.236 21.954h-3.6c-.91 0-1.65-.74-1.65-1.65v-7.201c0-.91.74-1.65 1.65-1.65h3.6a.75.75 0 0 1 .75.75v9.001a.75.75 0 0 1-.75.75zm-3.6-9.001a.15.15 0 0 0-.15.15v7.2a.15.15 0 0 0 .15.151h2.85v-7.501z" data-original="#000000" />
                  <path d="M20.52 21.954h-6.284a.75.75 0 0 1-.75-.75v-9.001c0-.257.132-.495.348-.633.017-.011 1.717-1.118 2.037-3.25.18-1.184 1.118-2.089 2.28-2.201a2.557 2.557 0 0 1 2.17.868c.489.56.71 1.305.609 2.042a9.468 9.468 0 0 1-.678 2.424h.943a2.56 2.56 0 0 1 1.918.862c.483.547.708 1.279.617 2.006l-.675 5.401a2.565 2.565 0 0 1-2.535 2.232zm-5.534-1.5h5.533a1.06 1.06 0 0 0 1.048-.922l.675-5.397a1.046 1.046 0 0 0-1.047-1.182h-2.16a.751.751 0 0 1-.648-1.13 8.147 8.147 0 0 0 1.057-3 1.059 1.059 0 0 0-.254-.852 1.057 1.057 0 0 0-.795-.365c-.577.052-.964.435-1.04.938-.326 2.163-1.71 3.507-2.369 4.036v7.874z" data-original="#000000" />
                  <path d="M4 31.75a.75.75 0 0 1-.612-1.184c1.014-1.428 1.643-2.999 1.869-4.667.032-.241.055-.485.07-.719A14.701 14.701 0 0 1 1.25 15C1.25 6.867 7.867.25 16 .25S30.75 6.867 30.75 15 24.133 29.75 16 29.75a14.57 14.57 0 0 1-5.594-1.101c-2.179 2.045-4.61 2.81-6.281 3.09A.774.774 0 0 1 4 31.75zm12-30C8.694 1.75 2.75 7.694 2.75 15c0 3.52 1.375 6.845 3.872 9.362a.75.75 0 0 1 .217.55c-.01.373-.042.78-.095 1.186A11.715 11.715 0 0 1 5.58 29.83a10.387 10.387 0 0 0 3.898-2.37l.231-.23a.75.75 0 0 1 .84-.153A13.072 13.072 0 0 0 16 28.25c7.306 0 13.25-5.944 13.25-13.25S23.306 1.75 16 1.75z" data-original="#000000" />
                </svg>
                87 Reviews
              </button> */}
            </div>
          </div>
         
         
          <hr class="my-8" />
          <div class="flex flex-wrap gap-4">
          <button
  onClick={() =>
    bookNow(
      productdata.id, // Pass productdata.id as itemCode
      1,
      productdata.price,
      productdata.name,
      productdata.frontImage
    )
  }
  type="button"
  class="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded"
>
  Buy now
</button>
<button
  onClick={() =>
    addToCart(
      productdata.id, // Pass productdata.id as itemCode
      1,
      productdata.price,
      productdata.name,
      productdata.frontImage
    )
  }
  type="button"
  class="min-w-[200px] px-4 py-2.5 border border-gray-800 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-bold rounded"
>
  Add to cart
</button>

          </div>
        </div>
      </div>
      <div class="mt-24 max-w-4xl">
      <ul className="flex border-b">
              <li
                className={`text-gray-800 font-bold text-sm bg-gray-100 py-3 px-8 border-b-2 ${
                  activeTab === "description" ? "border-gray-800" : ""
                } cursor-pointer transition-all`}
                onClick={() => handleTabClick("description")}
              >
                Description
              </li>
              <li
                className={`text-gray-400 font-bold text-sm hover:bg-gray-100 py-3 px-8 cursor-pointer transition-all ${
                  activeTab === "reviews" ? "text-gray-800 border-b-2 border-gray-800" : ""
                }`}
                onClick={() => handleTabClick("reviews")}
              >
                Reviews
              </li>
            </ul>
        
            {activeTab === "description" ? (
              <div>
                <h3 className="text-lg font-bold text-gray-800">Product Description</h3>
                <p className="text-sm text-gray-400 mt-4">{productdata.description}</p>
                {/* Your additional description content */}
              </div>
            ) : (
              <div>
                {/* Your review display section */}
              </div>
            )}
      </div>
    </div>
        )}
  </div>
  )
}

export default ProductDetails