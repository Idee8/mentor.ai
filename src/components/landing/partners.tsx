"use client";

import React, { useEffect, useRef, useState } from "react";
import { Marquee } from "../ui/marquee";
import Image from "next/image";

// Sample partner data - with images from public folder
const partners = [
  {
    id: 1,
    name: "MIT",
    image: "/users/mit.png",
  },
  {
    id: 2,
    name: "General-mills",
    image: "/users/General-mills.svg",
    industry: "Finance",
  },
  {
    id: 4,
    name: "Stanford University",
    image: "/users/stanford.png",
  },
  {
    id: 5,
    name: "Mercado Libre",
    image: "/users/mercado_libre.svg",
  },
];

export const Partners: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 shadow-md bg-background relative overflow-hidden space-y-8">
      <div className="flex flex-col items-center">
        <h2 className="text-xl text-neutral-400">
          Trusted by Students and businesses across the world
        </h2>
      </div>
      <Marquee pauseOnHover className="[--duration:20s]">
        {partners.map((partner, idx) => (
          <div key={idx} className="mx-12">
            <Image
              src={partner.image}
              alt={partner.name}
              className=""
              width={70}
              height={80}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};
