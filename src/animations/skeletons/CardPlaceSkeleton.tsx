import ContentLoader from "react-content-loader";

export default function CardPlaceSkeleton() {
  return (
    <ContentLoader
      speed={2}
      width={380}
      height={350}
      viewBox="0 0 350 350"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="20" y="20" rx="0" ry="0" width="380" height="350" />
    </ContentLoader>
  );
}
