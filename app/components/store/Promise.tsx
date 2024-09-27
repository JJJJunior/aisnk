import { Headset, Package2Icon, ThumbsUpIcon, Undo2 } from "lucide-react";
import React from "react";

const Promise = () => {
  return (
    <div className="w-full mx-auto h-14 my-4 justify-around items-center hidden lg:flex">
      <div className="flex gap-4">
        <Package2Icon />
        <div>Ships within 12 hours</div>
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
