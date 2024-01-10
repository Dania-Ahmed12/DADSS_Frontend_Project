import { Col, Row, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Cookies from "js-cookie";

// const navItems = [
//   {
//     title: "Fishing Vessel Activity Trends",
//     img: (
//       <Image alt="icon-1" src={require("/public/images/home/Icons-15.svg")} />
//     ),
//     to: "/activitymapsandtrends/fishingvessels/activitytrends",
//   },
//   {
//     title: "Fishing vessel Heat Map",
//     img: (
//       <Image alt="icon-2" src={require("/public/images/home/Icons-16.svg")} />
//     ),
//     to: "/activitymapsandtrends/fishingvessels/densityheatmap",
//   },
//   // {
//   //   title: "MSA Events Heat Map",
//   //   img: (
//   //     <Image alt="icon-3" src={require("/public/images/home/Icons-17.svg")} />
//   //   ),
//   //   to: "/activitymapsandtrends/fishingvessels/densityheatmap",
//   // },
//   // {
//   //   title: "MSA Mission Costs",
//   //   img: (
//   //     <Image alt="icon-4" src={require("/public/images/home/Icons-18.svg")} />
//   //   ),
//   //   to: "/activitymapsandtrends/fishingvessels/densityheatmap",
//   // },
//   // {
//   //   title: "MSA Vessels Data Entry Form",
//   //   img: (
//   //     <Image alt="icon-5" src={require("/public/images/home/Icons-19.svg")} />
//   //   ),
//   //   to: "/activitymapsandtrends/fishingvessels/densityheatmap",
//   // },
//   // {
//   //   title: "MSA Router Heat Map",
//   //   img: (
//   //     <Image alt="icon-6" src={require("/public/images/home/Icons-20.svg")} />
//   //   ),
//   //   to: "/activitymapsandtrends/fishingvessels/densityheatmap",
//   // },
//   {
//     title: "Fishing Vessel Harbour",
//     img: (
//       <Image alt="icon-1" src={require("/public/images/home/Icons-17.svg")} />
//     ),
//     to: "/activitymapsandtrends/fishingvessels/enteringleavingharbour",
//   },
//   {
//     title: "Fishing vessel Over Stay",
//     img: (
//       <Image alt="icon-2" src={require("/public/images/home/Icons-18.svg")} />
//     ),
//     to: "/activitymapsandtrends/fishingvessels/overstay",
//   },
//   {
//     title: "Fishing Vessel Duration at Sea",
//     img: (
//       <Image alt="icon-1" src={require("/public/images/home/Icons-19.svg")} />
//     ),
//     to: "/activitymapsandtrends/fishingvessels/durationatsea",
//   },
//   {
//     title: "Merchant vessel Visiting Pakistan",
//     img: (
//       <Image alt="icon-2" src={require("/public/images/home/Icons-20.svg")} />
//     ),
//     to: "/activitymapsandtrends/merchantvesseltrends/visitingpakistan",
//   },
// ];

// function getItem(img , to , title , key ) {
//   if (Cookies.get("category") === "B" && ["2", "3", "8"].includes(key)) {
//     return undefined;
//   }
//   if (
//     Cookies.get("category") === "C" &&
//     ["2", "3", "4", "5", "6", "7"].includes(key)
//   ) {
//     return undefined;
//   }
//   if (Cookies.get("category") === "A" && ["2", "3"].includes(key)) {
//     return undefined;
//   }
//   return {
//     img,
//     to,
//     title,
//     key,
//   };
// }
//   const items = [
//     //       getItem(
//     //         {title: "Fishing Vessel Activity Trends"},
//     //         "1",

//     //  {       img:  <Image alt="icon-1" src={require("/public/images/home/Icons-15.svg")} />}
//     //         ,
//     //     { to:   "/activitymapsandtrends/fishingvessels/activitytrends"}
//     //       ),
//     getItem(
//       <Image
//         alt="icon-1"
//         src={require("/public/images/home/Icons-15.svg")}
//       />,
//       "/activitymapsandtrends/fishingvessels/activitytrends",
//       "Fishing Vessel Activity Trends",
//       "1"
//     ),
//   ];

function getItem(imgSrc, to, key) {
  const keyToTitle = {
    1: "Fishing Vessel Activity Trends",
    2: "Fishing Vessel Heat Map",
    3: "Fishing Vessel Harbour",
    4: "Fishing vessel Over Stay",
    5: "Fishing Vessel Duration at Sea",
    6: "Merchant vessel Visiting Pakistan",
    7: "General Report",
    8: "Special Report (Merchant Vessel)",
    9: "Sepecial Report (Fishing Vessel)",

    // Add more mappings here as needed
  };
  // Determine the title based on the key
  const title = keyToTitle[key] || "";
  // You can add your logic here to set the title and key based on imgSrc or 'to' value

  if (
    Cookies.get("category") === "B" &&
    ["1", "2", "3", "4", "5", "6"].includes(key)
  ) {
    return undefined;
  }
  if (Cookies.get("category") === "null" && ["7", "8", "9"].includes(key)) {
    return undefined;
  }
  return {
    img: <Image alt="icon" src={imgSrc} />,
    to,
    title,
    key,
  };
}
const items = [
  getItem(
    require("/public/images/home/Icons-15.svg"),
    "/activitymapsandtrends/fishingvessels/activitytrends",
    "1"
  ),
  getItem(
    require("/public/images/home/Icons-16.svg"),
    "/activitymapsandtrends/fishingvessels/densityheatmap",
    "2"
  ),
  getItem(
    require("/public/images/home/Icons-17.svg"),
    "/activitymapsandtrends/fishingvessels/enteringleavingharbour",
    "3"
  ),
  getItem(
    require("/public/images/home/Icons-18.svg"),
    "/activitymapsandtrends/fishingvessels/overstay",
    "4"
  ),
  getItem(
    require("/public/images/home/Icons-19.svg"),
    "/activitymapsandtrends/fishingvessels/durationatsea",
    "5"
  ),
  getItem(
    require("/public/images/home/Icons-20.svg"),
    "/activitymapsandtrends/merchantvesseltrends/visitingpakistan",
    "6"
  ),
  getItem(require("/public/images/home/Icons-18.svg"), "/generalreport", "7"),
  getItem(require("/public/images/home/Icons-19.svg"), "/merchantvessel", "8"),
  getItem(require("/public/images/home/Icons-20.svg"), "/fishingvessel", "9"),

  // Add more items here if needed
];
function Index() {
  return (
    <div className="mb-10">
      <Row className="flex justify-center gap-x-8 gap-y-10">
        {items.map((items, i) => {
          if (!items) return null; // Skip items that should not be rendered
          return (
            <Col span={6} key={i}>
              <Link href={items.to}>
                <div className="bg-white hover:border-blue cursor-pointer rounded-lg shadow-xl border-2 border-slate-200 p-5 h-60">
                  <div className="flex justify-end">
                    <HiOutlineArrowNarrowRight fontSize={25} />
                  </div>
                  <div className="flex flex-col justify-end items-center">
                    {items.img}
                    <Typography className="text-lg mt-5 text-center">
                      {items.title}
                    </Typography>
                  </div>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Index;
