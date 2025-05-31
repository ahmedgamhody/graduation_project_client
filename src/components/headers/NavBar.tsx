import { useState } from "react";
import { PopoverGroup } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authLogout } from "../../store/auth/authSlice";
import avatar from "../../../public/avatar.png";
import toast from "react-hot-toast";
import { AppRoutes, UserRoles } from "../../constants/enums";
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const dispatch = useAppDispatch();
  const { name, token, role } = useAppSelector((state) => state.auth);
  const nav = useNavigate();
  const handleSignOut = async () => {
    try {
      const result = await dispatch(authLogout());
      if (result) {
        nav("/login");
      } else {
        toast.error("Error signing out");
      }
    } catch (error) {
      toast.error("Error signing out" + error);
    }
  };
  const navLinks = [
    { to: AppRoutes.ROOT, label: "Home" },
    { to: AppRoutes.TYPE_OF_TOURISM, label: "Type of Tourism" },
    { to: AppRoutes.GOVERNORATES, label: "Governorates" },
    ...(role === UserRoles.MEMBER
      ? [
          { to: AppRoutes.RECOMMENDATION, label: "Recommendation" },
          { to: AppRoutes.CONTACT_US, label: "Contact Us" },
        ]
      : []),
  ];
  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to={AppRoutes.ROOT} className="-m-1.5 p-1.5">
            <img src="/main_logo.png" alt="main logo" className="h-24 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden bg-gray-200 rounded-lg p-2 ">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 font-bold"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-8" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm/6 font-semibold py-1 px-2 rounded-lg duration-150 ${
                  isActive
                    ? "text-white bg-primary"
                    : "text-gray-900 hover:text-white hover:bg-secondary"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {token && name ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  {name}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>{" "}
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  {role === UserRoles.ADMIN && (
                    <MenuItem>
                      <Link
                        to={AppRoutes.ADMIN_DASHBOARD}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Dashboard
                      </Link>
                    </MenuItem>
                  )}
                  {role === UserRoles.MEMBER && (
                    <MenuItem>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        onClick={() => nav(AppRoutes.USER_PROFILE)}
                      >
                        Profile
                      </button>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={AppRoutes.LOGIN}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#4E4FEB] transition bg-gray-200 rounded-full"
              >
                Login
              </Link>
              <Link
                to={AppRoutes.REGISTER}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-full hover:bg-[#3c3cd1] transition duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Drawer open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Menu" />
        <DrawerItems>
          <div className="flex items-center justify-center">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                src="/main_logo.png"
                alt="main logo"
                className="h-24 w-auto"
              />
            </Link>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `block text-sm font-semibold py-2 px-3 rounded-lg duration-150 ${
                        isActive
                          ? "text-white bg-primary"
                          : "text-gray-900 hover:text-white hover:bg-secondary"
                      }`
                    }
                    onClick={handleClose}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="py-6 flex justify-center">
                {token ? (
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {name}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="-mr-1 size-5 text-gray-400"
                        />
                      </MenuButton>
                    </div>{" "}
                    <MenuItems
                      transition
                      className="absolute left-0 z-10 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        {role === UserRoles.ADMIN && (
                          <MenuItem>
                            <Link
                              to={AppRoutes.ADMIN_DASHBOARD}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                              Dashboard
                            </Link>
                          </MenuItem>
                        )}
                        {role === UserRoles.MEMBER && (
                          <MenuItem>
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                              onClick={() => nav(AppRoutes.USER_PROFILE)}
                            >
                              Profile
                            </button>
                          </MenuItem>
                        )}

                        <MenuItem>
                          <button
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            onClick={handleSignOut}
                          >
                            Sign out
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <Link
                      to={AppRoutes.LOGIN}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#4E4FEB] transition bg-gray-200 rounded-full w-full text-center"
                      onClick={handleClose}
                    >
                      Login
                    </Link>
                    <Link
                      to={AppRoutes.REGISTER}
                      className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-full hover:bg-[#3c3cd1] transition duration-300 w-full text-center"
                      onClick={handleClose}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </header>
  );
}
