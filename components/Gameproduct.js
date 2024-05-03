import React, { useState } from "react";
import { RiDownload2Line } from 'react-icons/ri'; 

const Gameproduct = ({ Productdata, addToCart, membertype }) => {
  console.log("recently product",  Productdata);
  const hotProducts = Productdata.filter(product => product.category === "HOT MODS");
  const bestProducts = Productdata.filter(product => product.category === "BEST SELLING MODS");
  const topProducts = Productdata.filter(product => product.category === "TOP RATED MODS");
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
    <div>
        <section class="bg-white py-12 text-gray-700 sm:py-8 lg:py-10">
  <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    

    <div class="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-3 lg:mt-2">
      
      
    <div class="mt-10 flex flex-col gap-6 lg:mt-2">
      
    <div class="mx-auto max-w-md text-center">
      <h2 class="font-serif text-sm font-bold sm:text-lg uppercase">Hot mods</h2>
      <div class="border-b-4 border-black w-16 mx-auto mt-2"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {hotProducts.map((Product) => (
            <div class="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
              <div class="w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute -top-2 right-1">
                <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  {Product.MemberType}
                </span>
              </div>
              <div class="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                <img src={Product.frontImage} alt={Product.name} class="h-full w-full rounded-xl object-contain" />
              </div>
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


    <div class="mt-10 flex flex-col gap-6 lg:mt-2">
    <div class="mx-auto max-w-md text-center">
      <h2 class="font-serif text-sm font-bold sm:text-lg uppercase">Best selling mods</h2>
      <div class="border-b-4 border-black w-16 mx-auto mt-2"></div>
    </div>
      
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {bestProducts.map((Product) => (
            <div class="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
              <div class="w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute -top-2 right-1">
                <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  {Product.MemberType}
                </span>
              </div>
              <div class="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                <img src={Product.frontImage} alt={Product.name} class="h-full w-full rounded-xl object-contain" />
              </div>
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
    
    {/* <div class="mt-10 flex flex-col gap-6 lg:mt-2">
      
    <div class="mx-auto max-w-md text-center">
      <h2 class="font-serif text-sm font-bold sm:text-lg uppercase">Bundles</h2>
      <div class="border-b-4 border-black w-16 mx-auto mt-2"></div>
    </div>
    <article class="relative h-72 w-48 flex flex-col overflow-hidden rounded-lg border">
        <div class=" overflow-hidden">
          <img class="h-72 w-48 object-cover transition-all duration-300 group-hover:scale-125" src="a3.png" alt="" />
        </div>

        <div class="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
          <div class="mb-2 flex">
            <p class="mr-3 text-sm font-semibold">$99.00</p>
            <del class="text-xs text-gray-400"> $79.00 </del>
          </div>
          <h3 class="mb-2 text-sm text-gray-400">thumbweb</h3>
        </div>
        <button class="group mx-auto mb-2 flex h-10 w-10/12 items-stretch overflow-hidden rounded-md text-gray-600">
          <div class="flex w-full items-center justify-center bg-gray-100 text-xs uppercase transition group-hover:bg-emerald-600 group-hover:text-white">Add</div>
          <div class="flex items-center justify-center bg-gray-200 px-5 transition group-hover:bg-emerald-500 group-hover:text-white">+</div>
        </button>
      </article>
      
      
    </div> */}
    <div class="mt-10 flex flex-col gap-6 lg:mt-2">
    <div class="mx-auto max-w-md text-center">
      <h2 class="font-serif text-sm font-bold sm:text-lg uppercase">top rated mods</h2>
      <div class="border-b-4 border-black w-16 mx-auto mt-2"></div>
    </div>
      
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {topProducts.map((Product) => (
            <div class="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
              <div class="w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute -top-2 right-1">
                <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  {Product.MemberType}
                </span>
              </div>
              <div class="w-4/3 h-[120px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                <img src={Product.frontImage} alt={Product.name} class="h-full w-full rounded-xl object-contain" />
              </div>
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
  </div>
</section>

    </div>
  )
}

export default Gameproduct