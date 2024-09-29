import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { prisma } from "@/prisma/db";
import Image from "next/image";
const page = async ({ params }: { params: { title: string } }) => {
  const titles = await prisma.qA.groupBy({
    by: ["title"],
  });

  const qas = await prisma.qA.findMany({
    where: { title: params.title.split("-").join(" ") },
    orderBy: {
      created_at: "asc",
    },
  });

  return (
    <div className="mx-6 mt-6 lg:mx-16 lg:flex">
      <div className="underline flex text-sm lg:text-lg lg:flex lg:flex-col gap-6 lg:w-1/4">
        {titles &&
          titles.length > 0 &&
          titles.map((t, index) => (
            <Link
              key={index}
              href={`/web/service/${
                t.title && t.title.toLowerCase().split(" ").length > 0
                  ? t.title.toLowerCase().split(" ").join("-")
                  : t.title && t.title.toLowerCase()
              }`}
            >
              {t.title}
            </Link>
          ))}
      </div>
      <div className="lg:w-3/4">
        <h1 className="text-lg mt-6 mb-6 lg:text-2xl lg:mb-4 mx-auto text-center font-semibold text-gray-600">
          Contact Us
        </h1>
        <div className="lg:flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <div>Customer Service</div>
            <div>Monday to Friday: 24 hours service</div>
            <div>Saturday and Sunday: 08:00-15:00 (EST)</div>
            <div>Support Email:</div>
            <div className="flex gap-4">
              <div>aisnk001@gmail.com</div> <div>aisnk012@gmail.com</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div>Our customer service staff will answer your questions as soon as possible</div>
            <div>
              You will generally receive a response within 24 hours, but during festive seasons, discounts or special
              events it may take longer. Want to contact us? You can find our contact details on the scroll down page.
            </div>
          </div>
        </div>
        {qas &&
          qas.length > 0 &&
          qas.map((item) => (
            <Accordion type="single" collapsible key={item.id}>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm">{item.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
    </div>
  );
};

export default page;
