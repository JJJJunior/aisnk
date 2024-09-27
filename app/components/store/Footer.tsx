import React from "react";
import Link from "next/link";
import SubcribeFrom from "./SubcribeFrom";
import Image from "next/image";
import { prisma } from "@/prisma/db";
import { ArrowBigRightIcon } from "lucide-react";

const Footer = async () => {
  const settings = await prisma.settings.findMany();
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
          <p className="w-[300px] p-4 border rounded-xl top-0 left-[300px]">
            "Got a question? 🤔 Feel free to hit us up anytime 📲—We're always here and ready to chat! 💬✨"
          </p>
          <div className="flex flex-col gap-4 underline">
            <Link href="/web/service/about-us">About US</Link>
            <Link href="/web/service/delivery-method">Delivery Method</Link>
            <Link href="/web/service/returns-cancellations">Returns Cancellations</Link>
            <Link href="/web/service/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div className="w-full flex gap-2 items-center justify-center relative">
          <ArrowBigRightIcon size={30} />
          <Link href={settings.find((item) => item.key === "whatsapp" && item.value)?.value || ""}>
            <Image src="/whatsapp.png" width={30} height={30} alt="whatsapp" className="rounded-md" />
          </Link>
          <Link href={settings.find((item) => item.key === "discord" && item.value)?.value || ""}>
            <Image src="/discord.png" width={30} height={30} alt="discord" className="rounded-md" />
          </Link>
          <Link href={settings.find((item) => item.key === "ins" && item.value)?.value || ""}>
            <Image src="/ins.png" width={30} height={30} alt="ins" className="rounded-md" />
          </Link>
          <Link href={settings.find((item) => item.key === "youtube" && item.value)?.value || ""}>
            <Image src="/youtube.png" width={30} height={30} alt="youtube" className="rounded-md" />
          </Link>
          <Link href={settings.find((item) => item.key === "tiktok" && item.value)?.value || ""}>
            <Image src="/tiktok.png" width={30} height={30} alt="tiktok" className="rounded-md" />
          </Link>
        </div>
        <div className="text-center">© 2024, AISNK.</div>
      </div>
    </div>
  );
};

export default Footer;
