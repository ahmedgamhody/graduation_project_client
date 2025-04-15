import { Suspense } from "react";
import LottieHandler from "./LottieHandler";

export default function PageSuspenseFallback({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <LottieHandler type="mainlottie" message="loading please wait ...." />
      }
    >
      {children}
    </Suspense>
  );
}
