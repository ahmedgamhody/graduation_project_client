import { Outlet } from "react-router";
import AdminSideBar from "../components/admin/AdminSideBar";

export default function AdminDashboardLayout() {
  return (
    <div className="flex  min-h-screen">
      <AdminSideBar />
      <main className="flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
