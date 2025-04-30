import { Card, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TPlaceHome } from "../../../types";

import { useState } from "react";

export default function PlaceCard({ place }: { place: TPlaceHome }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="max-w-sm">
        <div className="h-48 w-full overflow-hidden bg-gray-200 relative rounded-md">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-300 z-10 "></div>
          )}
          <img
            src={place.photo}
            alt={place.name}
            className="w-full h-full object-cover"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <div className="flex  items-center justify-between">
          <h5 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
            {place.name}
          </h5>
          {place?.googleRate && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
              {place?.googleRate}
            </div>
          )}
        </div>
        <Link to={`/places/${place.name}`}>
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
      </Card>
    </motion.div>
  );
}
