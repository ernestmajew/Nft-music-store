"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";

export default function TextCard({ header, info, url, style }) {
  return (
    <Link href={url}>
      <Card
        shadow="xl"
        className={`group/card bg-opacity-50 hover:bg-opacity-80 p-4 transition-all + ${style}`}
      >
        <CardHeader>
          <h4 className="font-bold text-2xl transition-all">{header}</h4>
        </CardHeader>
        <CardBody className="p-3">
          <h3 className="text-xl overflow-auto opacity-80">{info}</h3>
        </CardBody>
        <CardFooter className="flex justify-end">
          <PiArrowRightBold className=" text-3xl group-hover/card:translate-x-2 transition-all" />
        </CardFooter>
      </Card>
    </Link>
  );
}
