import Lottie from "lottie-react";

import mainlottie from "../assets/eye_loading.json";

const lottieFilesTypes = {
  mainlottie, // mainlottie : mainlottie
};

type LottieHandlerProps = {
  type: keyof typeof lottieFilesTypes;
  message?: string;
  className?: string;
};

export default function LottieHandler({
  type,
  message,
  className = "",
}: LottieHandlerProps) {
  const lottie = lottieFilesTypes[type];
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <Lottie
        animationData={lottie}
        style={{ height: "300px", marginBottom: "30px" }}
        loop={false}
      />
      {message && (
        <h3
          style={{ fontSize: "19px", marginBottom: "30px" }}
          className={`${className}`}
        >
          {message}
        </h3>
      )}
    </div>
  );
}
