import { Outlet } from "react-router";
import NavBar from "../components/headers/NavBar";

export default function MainLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
