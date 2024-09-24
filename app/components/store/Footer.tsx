import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-12 bg-black text-white">
      <div className="mx-6 md:mx-12 p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-col md:flex md:flex-row gap-6 md:justify-around md:items-center">
          <div className="flex flex-col gap-4">
            <div>SHOWROOM INFORMATION:</div>
            <p>Email: aisnk001@gmail.com</p>
            <div>AISNK.com</div>
            <div className="font-semibold text-lg">👟 Subscribe for exclusive sneaker news!</div>
            <div className="flex w-full md:max-w-sm md:items-center space-x-2">
              <Input type="email" placeholder="Email" />
              <Button type="submit" size="lg" className="outline-non bg-white text-black  hover:text-white">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 underline">
            <Link href="/web/service/about-us">About US</Link>
            <Link href="/web/service/delivery-method">Delivery Method</Link>
            <Link href="/web/service/returns-cancellations">Returns Cancellations</Link>
            <Link href="/web/service/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div className="my-6 text-center">© 2024, AISNK.</div>
      </div>
    </div>
  );
};

export default Footer;
