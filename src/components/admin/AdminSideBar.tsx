import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  Settings,
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Building2,
  Plane,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  openDashboardSidebar,
  closeDashboardSidebar,
} from "../../store/ui/uiSlice";

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
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: Home,
    },
    {
      path: "/admin/users",
      name: "Users",
      icon: Users,
    },
    {
      path: "/admin/places",
      name: "Places",
      icon: MapPin,
    },
    {
      path: "/admin/governorates",
      name: "Governorates",
      icon: Building2,
    },
    {
      path: "/admin/tourism-types",
      name: "Tourism Types",
      icon: Plane,
    },
    {
      path: "/admin/analytics",
      name: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/admin/messages",
      name: "Messages",
      icon: MessageSquare,
    },
    {
      path: "/admin/settings",
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out relative ${
        isDashboardSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 z-10"
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          {isDashboardSidebarOpen && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-gray-400 text-sm">Manage your app</p>
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
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div
          className={`flex items-center space-x-3 p-3 bg-gray-800 rounded-lg ${
            !isDashboardSidebarOpen && "justify-center"
          }`}
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          {isDashboardSidebarOpen && (
            <div>
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-gray-400 text-xs">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
