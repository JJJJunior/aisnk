import React from "react";

const Notication = () => {
  return (
    <div className="mx-auto px-2 md:px-12 h-8 md:h-10 bg-black text-white text-xs md:text-sm flex justify-center items-center">
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="w-full inline-block animate-marquee text-white">
          We offer all products shipped within 12 hours!
        </div>
      </div>
    </div>
  );
};

export default Notication;
