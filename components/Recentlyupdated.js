import React, { useState } from "react";
import { RiDownload2Line } from 'react-icons/ri'; 

const RecentlyUpdated = ({ Productdata, addToCart, membertype }) => {
  console.log("recently product",  Productdata);
  const recentlyProducts = Productdata.filter(product => product.category === "RECENTLY PRODUCTS");
  const [downloading, setDownloading] = useState(false);
  const handleDownload = (url) => {
    setDownloading(true); // Set downloading status to true
    // Create a temporary anchor element
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Product.zip"; // Set the filename for the download
    anchor.click(); // Trigger the click event
    setDownloading(false); // Set downloading status to false after download is complete
  };
  return (
    <div class="font-[sans-serif] py-4">
      <div class="p-4 mx-auto lg:max-w-6xl max-w-xl md:max-w-full">
        <h2 class="text-xl font-extrabold text-gray-800 mb-12">Recently Uploaded</h2>

        <div class="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6">
          {recentlyProducts.map((Product) => (
            <div class="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
              <div class="w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute -top-2 right-1">
                <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  {Product.MemberType}
                </span>
              </div>
              <a href={`/Product-Details?id=${Product.id}`} >
              <div class="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                <img src={Product.frontImage} alt={Product.name} class="h-full w-full rounded-xl object-contain" />
              </div>
              </a>
              <div class="text-center mt-4">
                <h3 class="text-sm font-extrabold text-gray-800">{Product.name}</h3>
                <h4 class="text-xl text-gray-800 font-bold mt-4">${Product.price}</h4>
                {Product.MemberType === membertype ? (
                  <button
                  type="button"
                  onClick={() => handleDownload(Product.zipfile)}
                  className="w-full flex items-center justify-center gap-3 mt-6 px-4 py-1.5 bg-transparent hover:bg-gray-200 text-base text-[#333] border-2 font-semibold border-[#333] rounded-xl"
                  disabled={downloading} // Disable button while downloading
                >
                  {downloading ? "Downloading..." : (
                    <>
                      <RiDownload2Line size={20} /> {/* Using the download icon component */}
                      Download
                    </>
                  )}
                </button>
                ) : (
                  <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      Product.id, // Pass productdata.id as itemCode
                      1,
                      Product.price,
                      Product.name,
                      Product.frontImage
                    )
                  }
                  class="w-full flex items-center justify-center gap-3 mt-6 px-4 py-1.5 bg-transparent hover:bg-gray-200 text-base text-[#333] border-2 font-semibold border-[#333] rounded-xl"
                >
                  Add to cart
                </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyUpdated;
