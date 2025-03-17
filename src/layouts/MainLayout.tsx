import { Outlet } from "react-router";
import { useAppDispatch } from "../store/hooks";
import { authLogout } from "../store/auth/authSlice";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 p-4 bg-section overflow-auto">
        <button
          onClick={() => {
            dispatch(authLogout());
          }}
        >
          LogOut
        </button>
        <Outlet />
      </div>
    </div>
  );
}
