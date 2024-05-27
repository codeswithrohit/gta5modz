import React, { useState, useEffect } from "react";
import { RiDownload2Line } from 'react-icons/ri';
import { firebase } from "../Firebase/config";
import "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Gameproduct = ({ Productdata, addToCart, membertype, user }) => {
  console.log("recently product", Productdata);
  const hotProducts = Productdata.filter(product => product.category === "HOT MODS");
  const bestProducts = Productdata.filter(product => product.category === "BEST SELLING MODS");
  const topProducts = Productdata.filter(product => product.category === "TOP RATED MODS");
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

  const renderProducts = (products, category) => (
    <div className="mt-10 flex flex-col gap-6 lg:mt-2">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-serif text-sm font-bold sm:text-lg uppercase">{category}</h2>
        <div className="border-b-4 border-black w-16 mx-auto mt-2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.slice(0, 2).map((Product) => (
          <div key={Product.id} className="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
            <div className="absolute top-0 left-2 flex flex-row gap-1">
              {Product.MemberType.map((member) => (
                <div
                  key={member.value}
                  className="w-30 h-10 flex flex-row items-center justify-center rounded-full cursor-pointer"
                >
                  <span className="uppercase text-[7px] font-bold bg-green-50 p-0.5 border-green-500 border rounded text-red-600 font-medium select-none">
                    {member.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 mt-2 aspect-h-8">
              <img src={Product.frontImage} alt={Product.name} className="h-full w-full rounded-xl object-contain" />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-sm font-extrabold text-gray-800">{Product.name}</h3>
              <h4 className="text-xl text-gray-800 font-bold mt-4">${Product.price}</h4>
              {Product.MemberType.some(member => member.label === membertype) || membertype === 'DIAMOND MEMBER' ? (
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
      <div className="text-center mt-4">
        <a href={`/${category.replace(/\s+/g, '-').toLowerCase()}`} className="text-blue-500 hover:underline">View All</a>
      </div>
    </div>
  );

  return (
    <div>
      <section className="bg-white py-12 text-gray-700 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-3 lg:mt-2">
            {renderProducts(hotProducts, "Hot mods")}
            {renderProducts(bestProducts, "Best selling mods")}
            {renderProducts(topProducts, "Top rated mods")}
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default Gameproduct;
