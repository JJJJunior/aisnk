import { Fingerprint, Headset, ThumbsUpIcon, Undo2 } from "lucide-react";
import React from "react";

const Promise = () => {
  return (
    <div className="h-14 mx-36 my-2 mt-6 bg-white justify-around items-center hidden md:flex">
      <div className="flex gap-4">
        <Fingerprint />
        <div>Authentic Products</div>
      </div>
      <div className="flex gap-4">
        <Undo2 />
        <div>Returns Possible</div>
      </div>
      <div className="flex gap-4">
        <Headset />
        <div>Personal service</div>
      </div>
      <div className="flex gap-4">
        <ThumbsUpIcon />
        <div>Trusted Seller</div>
      </div>
    </div>
  );
};

export default Promise;
