import { Star } from "lucide-react";

export const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`w-4 h-4 ${
        index < Math.floor(rating)
          ? "text-yellow-300 fill-current"
          : "text-gray-300"
      }`}
    />
  ));
};
