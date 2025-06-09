import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MapPinHouse,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  openDashboardSidebar,
  closeDashboardSidebar,
} from "../../store/ui/uiSlice";
import { AppRoutes } from "../../constants/enums";

export default function AdminSideBar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isDashboardSidebarOpen } = useAppSelector((state) => state.ui);

  const toggleSidebar = () => {
    if (isDashboardSidebarOpen) {
      dispatch(closeDashboardSidebar());
    } else {
      dispatch(openDashboardSidebar());
    }
  };

  const menuItems = [
    {
      path: AppRoutes.ADMIN_DASHBOARD,
      name: "Dashboard",
      icon: Home,
    },
    {
      path: AppRoutes.ADMIN_TOUR_GUIDES_REQUEST,
      name: "Tour Guides Requests",
      icon: Users,
    },
    {
      path: AppRoutes.ADMIN_PLACES,
      name: "Places",
      icon: MapPinHouse,
    },
  ];

  return (
    <div
      className={`bg-gray-200 text-black transition-all duration-300 ease-in-out relative ${
        isDashboardSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-secondary text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 z-10"
      >
        {isDashboardSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src="/main_logo.png"
              alt="main logo"
              className="h-8 w-8 rounded-full object-contain"
            />
          </div>
          {isDashboardSidebarOpen && (
            <div>
              <h2 className="font-bold text-lg">Egypt Guide</h2>
              <p className="text-gray-600 text-sm">Manage your app</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        <ul
          className={`space-y-2 px-4 ${
            !isDashboardSidebarOpen &&
            "flex flex-col items-center justify-center"
          }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={` flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-primary text-white "
                      : "text-black hover:bg-secondary hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isDashboardSidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isDashboardSidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0">
        <ul
          className={`px-4 ${
            !isDashboardSidebarOpen &&
            "flex flex-col items-center justify-center"
          }`}
        >
          <li>
            <Link
              to="/"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative text-black hover:bg-secondary hover:text-white`}
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              {isDashboardSidebarOpen && (
                <span className="font-medium">Back to Home</span>
              )}

              {/* Tooltip for collapsed state */}
              {!isDashboardSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Back to Home
                </div>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
