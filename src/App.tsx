import { Navigate, Route, Routes } from "react-router";
import { lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ProtectedAuthRoutes from "./routes/ProtectedAuthRoutes";
import PageSuspenseFallback from "./animations/PageSuspenseFallback";
import TourGuideRegisterPage from "./pages/registerPage/TourGuideRegisterPage";
import { AppRoutes, UserRoles } from "./constants/enums";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

const HomePage = lazy(() => import("./pages/homePage/HomePage"));
// pages
const ContactUsPage = lazy(() => import("./pages/contact us/ContactUsPage"));
const SearchPlacePage = lazy(
  () => import("./pages/search place/SearchPlacePage")
);
const SinglePlace = lazy(() => import("./pages/Single place/SinglePlace"));
// Recommendation Pages
const Recommendation = lazy(
  () => import("./pages/Recommendation/Recommendation")
);
const TripDetails = lazy(
  () => import("./pages/Recommendation/Trip Details/TripDetails")
);
// Auth Pages
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const UserRegisterPage = lazy(
  () => import("./pages/registerPage/UserRegisterPage")
);
const RegisterPage = lazy(() => import("./pages/registerPage/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/forgot password/ForgotPasswordPage")
);
const OPTCodePage = lazy(() => import("./pages/forgot password/OPTCodePage"));
const ResetPasswordPage = lazy(
  () => import("./pages/forgot password/ResetPasswordPage")
);
const ConfirmedTourGuideRegister = lazy(
  () => import("./pages/registerPage/ConfirmedTourGuideRegister")
);

// Tourism Pages
const TypeOfTourism = lazy(
  () => import("./pages/Type of Tourism/TypeOfTourism")
);
const SingleTourism = lazy(
  () => import("./pages/Type of Tourism/SingleTourism")
);
// Governorates Pages
const Governorates = lazy(() => import("./pages/Governorates/Governorates"));
const SingleGovernorate = lazy(
  () => import("./pages/Governorates/SingleGovernorate")
);

// Machine Quotations Page
const MachineQuotations = lazy(
  () => import("./pages/Machine Quotations/MachineQuotations")
);
// User Profile Pages and Favorite Places
const UserProfile = lazy(() => import("./pages/profile/UserProfile"));
const ShowUserProfile = lazy(() => import("./pages/profile/ShowUserProfile"));
const FavoritePlaces = lazy(
  () => import("./pages/favorite places/FavoritePlaces")
);
const ShowTourGuideProfile = lazy(
  () => import("./pages/profile/ShowTourGuideProfile")
);
// Admin Pages
const AdminDashboard = lazy(
  () => import("./pages/admin dashboard/AdminDashboard")
);
const AdminTourGuidesRequest = lazy(
  () => import("./pages/admin dashboard/AdminTourGuidesRequest")
);
const AdminPlaces = lazy(() => import("./pages/admin dashboard/AdminPlaces"));
const AdminUsersContactUsProblems = lazy(
  () => import("./pages/admin dashboard/AdminUsersContactUsProblems")
);
function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<ProtectedAuthRoutes />}>
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
          <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
          <Route
            path={AppRoutes.REGISTER_USER}
            element={<UserRegisterPage />}
          />
          <Route
            path={AppRoutes.REGISTER_TOUR_GUIDE}
            element={<TourGuideRegisterPage />}
          />
          <Route
            path={AppRoutes.CONFIRMED_TOUR_GUIDE_REGISTER}
            element={<ConfirmedTourGuideRegister />}
          />
          <Route
            path={AppRoutes.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route path={AppRoutes.OPT_CODE} element={<OPTCodePage />} />
          <Route
            path={AppRoutes.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Admin Layout and Routes , all Routes are private   */}
        <Route element={<ProtectedRoutes allowedRoles={[UserRoles.ADMIN]} />}>
          <Route
            path={AppRoutes.ADMIN}
            element={
              <PageSuspenseFallback>
                <AdminDashboardLayout />
              </PageSuspenseFallback>
            }
          >
            <Route
              index
              element={<Navigate to={AppRoutes.ADMIN_DASHBOARD} replace />}
            />
            <Route
              path={AppRoutes.ADMIN_DASHBOARD}
              element={
                <PageSuspenseFallback>
                  <AdminDashboard />
                </PageSuspenseFallback>
              }
            />

            <Route
              path={AppRoutes.ADMIN_TOUR_GUIDES_REQUEST}
              element={
                <PageSuspenseFallback>
                  <AdminTourGuidesRequest />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.ADMIN_PLACES}
              element={
                <PageSuspenseFallback>
                  <AdminPlaces />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.ADMIN_USERS_CONTACT_US_PROBLEMS}
              element={
                <PageSuspenseFallback>
                  <AdminUsersContactUsProblems />
                </PageSuspenseFallback>
              }
            />
          </Route>
        </Route>

        {/* Main Layout and Routes for User , some pages public and some private*/}
        <Route
          path={AppRoutes.ROOT}
          element={
            <PageSuspenseFallback>
              <MainLayout />
            </PageSuspenseFallback>
          }
        >
          <Route
            index
            element={
              <PageSuspenseFallback>
                <HomePage />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.SEARCH_PLACES}
            element={
              <PageSuspenseFallback>
                <SearchPlacePage />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.TYPE_OF_TOURISM}
            element={
              <PageSuspenseFallback>
                <TypeOfTourism />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.GOVERNORATES}
            element={
              <PageSuspenseFallback>
                <Governorates />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.SINGLE_TOURISM}
            element={
              <PageSuspenseFallback>
                <SingleTourism />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.SINGLE_GOVERNORATE}
            element={
              <PageSuspenseFallback>
                <SingleGovernorate />
              </PageSuspenseFallback>
            }
          />
          <Route
            path={AppRoutes.MACHINE_QUOTATIONS}
            element={
              <PageSuspenseFallback>
                <MachineQuotations />
              </PageSuspenseFallback>
            }
          />
          {/* SinglePlace route for both Admin and Member */}
          <Route
            element={
              <ProtectedRoutes
                allowedRoles={[UserRoles.ADMIN, UserRoles.MEMBER]}
              />
            }
          >
            <Route
              path={AppRoutes.SINGLE_PLACE}
              element={
                <PageSuspenseFallback>
                  <SinglePlace />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.SHOW_USER_PROFILE}
              element={
                <PageSuspenseFallback>
                  <ShowUserProfile />
                </PageSuspenseFallback>
              }
            />

            <Route
              path={AppRoutes.SHOW_TOUR_GUIDE_PROFILE}
              element={
                <PageSuspenseFallback>
                  <ShowTourGuideProfile />
                </PageSuspenseFallback>
              }
            />
          </Route>
          <Route
            element={<ProtectedRoutes allowedRoles={[UserRoles.MEMBER]} />}
          >
            <Route
              path={AppRoutes.RECOMMENDATION}
              element={
                <PageSuspenseFallback>
                  <Recommendation />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.USER_PROFILE}
              element={
                <PageSuspenseFallback>
                  <UserProfile />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.TRIP_DETAILS}
              element={
                <PageSuspenseFallback>
                  <TripDetails />
                </PageSuspenseFallback>
              }
            />

            <Route
              path={AppRoutes.CONTACT_US}
              element={
                <PageSuspenseFallback>
                  <ContactUsPage />
                </PageSuspenseFallback>
              }
            />
            <Route
              path={AppRoutes.FAVORITE_PLACES}
              element={
                <PageSuspenseFallback>
                  <FavoritePlaces />
                </PageSuspenseFallback>
              }
            />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
