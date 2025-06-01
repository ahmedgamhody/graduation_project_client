import React, { useState, useEffect } from "react";
import Star from "./Star";

interface StarRatingProps {
  maxRating?: number;
  color?: string;
  size?: string;
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = "42px",
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
  disabled = false,
}: StarRatingProps) {
  const textStyle: React.CSSProperties = {
    lineHeight: "0",
    margin: "0",
    color,
    fontSize: size,
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const starContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  // Update rating when defaultRating changes
  useEffect(() => {
    setRating(defaultRating);
  }, [defaultRating]);
  function handleRating(rating: number) {
    if (disabled) return;
    setRating(rating);
    if (onSetRating) onSetRating(rating);
  }

  function handleTempRating(rating: number) {
    if (disabled) return;
    setTempRating(rating);
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {" "}
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => handleTempRating(i + 1)}
            onHoverOut={() => handleTempRating(0)}
            color={disabled ? "#ccc" : color}
            size={size}
            disabled={disabled}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
