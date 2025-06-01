import { motion } from "framer-motion";
import { Card, Button } from "flowbite-react";
import { TTripPlace } from "../../types";
import { Link } from "react-router-dom";
export default function TripPlaceCard({
  tripPlace,
}: {
  tripPlace: TTripPlace;
}) {
  console.log("TripPlaceCard rendered for:", tripPlace);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="max-w-sm shadow-xl border border-gray-300 dark:border-gray-700">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          {tripPlace.name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 text-sm line-clamp-4">
          {tripPlace.description}
        </p>

        <div className="mt-4 flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-200">
          <p>
            🗓️ Days: <strong>{tripPlace.days}</strong>
          </p>
          <p>
            📍 Sites: <strong>{tripPlace.number_of_Sites}</strong>
          </p>
          <p>
            💰 Price: <strong>${tripPlace.price.toFixed(2)}</strong>
          </p>
        </div>
        <Link to={`/recommendation/trips/${tripPlace.name}`}>
          <Button className="bg-primary mt-4 enabled:hover:bg-secondary !important">
            <span className="flex items-center">
              View Details
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
