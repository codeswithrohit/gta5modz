import React, { useState, useEffect, useRef } from "react";

const HomeCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = [
    {
      id: 1,
      imageUrl: "gm1.png",
    },
    {
      id: 2,
      imageUrl: "gm2.png",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex justify-center items-center md:px-0 px-4 py-4">
      <div className="px-0">
        {/* Image Slider */}
        <div>
          <div className="lg:pr-1 lg:py-4">
            <img
              src={imageList[currentImageIndex].imageUrl}
              className="h-full w-full object-cover rounded-xl"
              alt={`Slider Image ${currentImageIndex + 1}`}
            />
          </div>
        </div>
        {/* Dots for Navigation */}
        <div className="flex justify-center -mt-8 lg:-mt-12">
          {imageList.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 lg:w-4 lg:h-4 mx-1 rounded-full cursor-pointer ${
                index === currentImageIndex ? "bg-white" : "bg-gray-300"
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
