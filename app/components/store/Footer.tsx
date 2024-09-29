import React from "react";
import Link from "next/link";
import SubcribeFrom from "./SubcribeFrom";
import Image from "next/image";
import { prisma } from "@/prisma/db";
import { ArrowBigRightIcon } from "lucide-react";
import PayInfo from "./PayInfo";

const Footer = async () => {
  const settings = await prisma.settings.findMany({});
  return (
    <div className="w-full mx-auto mt-12 bg-black text-white">
      <div className="flex flex-col p-12 justify-between gap-6">
        <div className="flex flex-col md:flex md:flex-row gap-6 md:justify-around md:items-center">
          <div className="flex flex-col gap-4">
            <div>SHOWROOM INFORMATION:</div>
            <p>Email: aisnk001@gmail.com</p>
            <div>AISNK.com</div>
            <div className="font-semibold text-lg">👟 Subscribe for exclusive sneaker news!</div>
            <div className="flex w-full md:max-w-sm md:items-center space-x-2">
              <SubcribeFrom />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="w-[300px] p-4 border rounded-xl">
              "Got a question? 🤔 Feel free to hit us up anytime 📲—We're always here and ready to chat! 💬✨"
            </p>
            <div className="flex gap-2 items-center">
              <ArrowBigRightIcon size={30} />
              <Link href={settings.find((item) => item.key === "whatsapp" && item.value)?.value || ""}>
                <p className="w-8 h-8">
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#25d366" height="512" rx="15%" width="512" />
                    <path d="m123 393 14-65a138 138 0 1 1 50 47z" fill="#25d366" stroke="#fff" stroke-width="26" />
                    <path
                      d="m308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
                      fill="#fff"
                    />
                  </svg>
                </p>
              </Link>
              <Link href={settings.find((item) => item.key === "discord" && item.value)?.value || ""}>
                <p className="w-8 h-8">
                  <svg fill="#7289da" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <rect height="512" rx="15%" width="512" />
                    <path
                      d="m346 392-21-25c41-11 57-39 57-39-52 49-194 51-249 0 0 0 14 26 56 39l-23 25c-70-1-97-48-97-48 0-104 46-187 46-187 47-33 90-33 90-33l3 4c-58 16-83 42-83 42 68-46 208-42 263 0 1-1-33-28-86-42l5-4s43 0 90 33c0 0 46 83 46 187 0 0-27 47-97 48z"
                      fill="#fff"
                    />
                    <ellipse cx="196" cy="279" rx="33" ry="35" />
                    <ellipse cx="312" cy="279" rx="33" ry="35" />
                  </svg>
                </p>
              </Link>
              <Link href={settings.find((item) => item.key === "ins" && item.value)?.value || ""}>
                <p className="w-8 h-8">
                  <svg
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <radialGradient id="a" cx=".4" cy="1" r="1">
                      <stop offset=".1" stop-color="#fd5" />
                      <stop offset=".5" stop-color="#ff543e" />
                      <stop offset="1" stop-color="#c837ab" />
                    </radialGradient>
                    <linearGradient id="b" x2=".2" y2="1">
                      <stop offset=".1" stop-color="#3771c8" />
                      <stop offset=".5" stop-color="#60f" stop-opacity="0" />
                    </linearGradient>
                    <rect id="c" height="512" rx="15%" width="512" />
                    <use fill="url(#a)" xlinkHref="#c" />
                    <use fill="url(#b)" xlinkHref="#c" />
                    <g fill="none" stroke="#fff" stroke-width="30">
                      <rect height="308" rx="81" width="308" x="102" y="102" />
                      <circle cx="256" cy="256" r="72" />
                      <circle cx="347" cy="165" r="6" />
                    </g>
                  </svg>
                </p>
              </Link>
              <Link href={settings.find((item) => item.key === "youtube" && item.value)?.value || ""}>
                <p className="w-8 h-8 mt-2">
                  <svg
                    viewBox="0 0 256 180"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <linearGradient id="a" x1="49.980476%" x2="49.980476%" y1=".000001%" y2="100.030167%">
                      <stop offset="0" stop-color="#e52d27" />
                      <stop offset="1" stop-color="#bf171d" />
                    </linearGradient>
                    <path d="m101.6 123.2 69.2-35.8-69.2-36.1z" fill="#fff" />
                    <path d="m101.6 51.3 60.7 40.5 8.5-4.4z" fill="#420000" opacity=".12" />
                    <path
                      d="m253.301054 38.8s-2.499024-17.6-10.196017-25.4c-9.696212-10.2-20.591956-10.2-25.689965-10.8-35.68606-2.6-89.365092-2.6-89.365092-2.6h-.09996s-53.6790321 0-89.5650141 2.6c-4.9980477.6-15.8937915.6-25.6899649 10.8-7.59703241 7.8-10.09605623 25.4-10.09605623 25.4s-2.59898477 20.8-2.59898477 41.5v19.4c0 20.7 2.59898477 41.4 2.59898477 41.4s2.49902382 17.6 10.19601723 25.4c9.6962124 10.2 22.4912143 9.9 28.1889886 10.9 20.4919953 2 86.9660294 2.6 86.9660294 2.6s53.778992-.1 89.565013-2.7c4.998048-.6 15.893792-.6 25.689965-10.8 7.696993-7.8 10.196017-25.4 10.196017-25.4s2.598985-20.7 2.598985-41.4v-19.4c-.099961-20.7-2.698946-41.5-2.698946-41.5zm-151.740726 84.4v-71.9l69.172979 36.1z"
                      fill="url(#a)"
                    />
                  </svg>
                </p>
              </Link>
              <Link href={settings.find((item) => item.key === "tiktok" && item.value)?.value || ""}>
                <Image src="/tiktok.png" width={30} height={30} alt="tiktok" className="rounded-md" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between underline">
            <Link href="/web/service/about-us">About US</Link>
            <Link href="/web/service/delivery-method">Delivery Method</Link>
            <Link href="/web/service/returns-cancellations">Returns Cancellations</Link>
            <Link href="/web/service/privacy-policy">Privacy Policy</Link>
            <PayInfo />
          </div>
        </div>
        <div className="text-center">© 2024, AISNK.</div>
      </div>
    </div>
  );
};

export default Footer;
