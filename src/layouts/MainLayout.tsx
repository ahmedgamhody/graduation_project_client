import { Outlet } from "react-router";
import NavBar from "../components/headers/NavBar";
import Footer from "../components/footer/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
