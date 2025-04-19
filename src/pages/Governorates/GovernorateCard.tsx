import { TGovernorate } from "../../types";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useState } from "react";
export default function GovernorateCard({
  governorate,
}: {
  governorate: TGovernorate;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center bg-white rounded-lg  gap-4 p-4">
        <div className="h-48 w-48 overflow-hidden  relative rounded-md">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-300 z-10 rounded-full"></div>
          )}
          <img
            src={governorate.photo}
            alt={governorate.name}
            className="w-full h-full object-cover rounded-full"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {governorate.name}
        </h5>

        <Link to={`/governorates/${governorate.name}`}>
          <Button className="bg-primary enabled:hover:bg-secondary !important">
            <span className="flex items-center">
              Read more
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
