import { useParams } from "react-router-dom";

export default function SinglePlace() {
  const { id } = useParams();
  return <div>SinglePlace {id}</div>;
}
