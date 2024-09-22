import React from "react";
import { prisma } from "@/prisma/db";
import { Navbar } from "./Navbar";

export async function NavbarPage() {
  const sneakers = await prisma.parent.findUnique({
    where: {
      name: "sneakers",
    },
    include: {
      collections: {
        include: {
          images: true,
        },
      },
    },
  });

  const accessoires = await prisma.parent.findUnique({
    where: {
      name: "accessoires",
    },
    include: {
      collections: {
        include: {
          images: true,
        },
      },
    },
  });
  // console.log(accessoires);
  return <Navbar sneakers={sneakers} accessoires={accessoires} />;
}
