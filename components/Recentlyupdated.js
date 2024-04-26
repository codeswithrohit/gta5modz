import React from "react";

const RecentlyUpdated = ({ Productdata,addToCart }) => {
  console.log("recently product",Productdata)
  return (
    <div class="font-[sans-serif]">
    <div class="p-4 mx-auto lg:max-w-6xl max-w-xl md:max-w-full">
      <h2 class="text-xl font-extrabold text-gray-800 mb-12">Recently Uploaded</h2>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Productdata.map((Product) => (
        <div class="bg-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all relative">
          <div
            class="bg-gray-200 w-30 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4">
             <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                  co-owner
                </span>
          </div>
          <div class="w-2/3 h-[220px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
            <img src={Product.frontImage} alt={Product.name} class="h-full w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-lg font-extrabold text-gray-800">{Product.name}</h3>
            <h4 class="text-2xl text-gray-800 font-bold mt-4">${Product.price} 
            </h4>
            <button type="button" onClick={() =>
    addToCart(
      Product.id, // Pass productdata.id as itemCode
      1,
      Product.price,
      Product.name,
      Product.frontImage
    )
  }
              class="w-full flex items-center justify-center gap-3 mt-6 px-4 py-2.5 bg-transparent hover:bg-gray-200 text-base text-[#333] border-2 font-semibold border-[#333] rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512">
                <path
                  d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                  data-original="#000000"></path>
              </svg>
              Add to cart</button>
          </div>
        </div>
          ))}
  
      </div>
    </div>
  </div>
  );
};

export default RecentlyUpdated;
