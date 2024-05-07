import React, { useState, useEffect } from "react";
import { RiDownload2Line } from 'react-icons/ri';
import { firebase } from "../Firebase/config";
import "firebase/firestore";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecentlyUpdated = ({ Productdata, addToCart, membertype, user }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [userDownloads, setUserDownloads] = useState(null);

  useEffect(() => {
    // Fetch user's download data when the component mounts
    const fetchUserDownloads = async () => {
      if (user) {
        const userRef = firebase.firestore().collection("Users").doc(user);
        const doc = await userRef.get();
        if (doc.exists) {
          setUserDownloads(doc.data());
        }
      }
    };

    fetchUserDownloads();
  }, [user]);

  useEffect(() => {
    // Update the download count in Firestore when downloadCount changes
    if (user && downloadCount > 0) {
      const userRef = firebase.firestore().collection("Users").doc(user);
      userRef.update({
        todaydownload: firebase.firestore.FieldValue.increment(1),
        thismonthdownload: firebase.firestore.FieldValue.increment(1),
        totaldownload: firebase.firestore.FieldValue.increment(1)
      });

      // Check membership type and download limit
      if (userDownloads && userDownloads.member === 'GOLD MEMBER' && userDownloads.thismonthdownload >= 100) {
        toast.error("Download limit reached for this month!");
      } else if (userDownloads && userDownloads.member === 'SILVER MEMBER' && userDownloads.thismonthdownload >= 50) {
        toast.error("Download limit reached for this month!");
      }
    }
  }, [downloadCount, user, userDownloads]);

  const handleDownload = (url) => {
    // Check if the download limit for the month has been reached
    if (
      userDownloads &&
      userDownloads.member === 'GOLD MEMBER' &&
      userDownloads.thismonthdownload >= 100
    ) {
      toast.error("Download limit reached for this month!");
    } else if (
      userDownloads &&
      userDownloads.member === 'SILVER MEMBER' &&
      userDownloads.thismonthdownload >= 50
    ) {
      toast.error("Download limit reached for this month!");
    } else {
      // Proceed with the download
      setDownloading(true);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Product.zip";
      anchor.click();
      setDownloading(false);
      setDownloadCount(prevCount => prevCount + 1);
      console.log("Download count:", downloadCount);
    }
  };
  

  useEffect(() => {
    // Log user's download data when fetched
    console.log("User downloads:", userDownloads);
  }, [userDownloads]);

  return (
    <div className=" bg-white min-h-screen font-[sans-serif] py-4">
      <div className="p-4 mx-auto lg:max-w-6xl max-w-xl md:max-w-full">
        <h2 className="text-xl font-extrabold text-gray-800 mb-12">All Mods</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6">
          {Productdata.map((Product) => (
            <div className="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative" key={Product.id}>
              <div className="w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute -top-2 right-1">
                <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  {Product.MemberType}
                </span>
              </div>
              <a href={`/Product-Details?id=${Product.id}`} >
                <div className="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                  <img src={Product.frontImage} alt={Product.name} className="h-full w-full rounded-xl object-contain" />
                </div>
              </a>
              <div className="text-center mt-4">
                <h3 className="text-sm font-extrabold text-gray-800">{Product.name}</h3>
                <h4 className="text-xl text-gray-800 font-bold mt-4">${Product.price}</h4>
                {Product.MemberType === membertype || membertype === 'DIAMOND MEMBER' ? (
                  <button
                    type="button"
                    onClick={() => handleDownload(Product.zipfile)}
                    className="w-full flex items-center justify-center gap-3 mt-6 px-4 py-1.5 bg-transparent hover:bg-gray-200 text-base text-[#333] border-2 font-semibold border-[#333] rounded-xl"
                    disabled={downloading}
                  >
                    {downloading ? "Downloading..." : (
                      <>
                        <RiDownload2Line size={20} />
                        Download
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        Product.id,
                        1,
                        Product.price,
                        Product.name,
                        Product.frontImage
                      )
                    }
                    className="w-full flex items-center justify-center gap-3 mt-6 px-4 py-1.5 bg-transparent hover:bg-gray-200 text-base text-[#333] border-2 font-semibold border-[#333] rounded-xl"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default RecentlyUpdated;
