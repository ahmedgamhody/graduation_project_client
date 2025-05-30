import { Route, Routes } from "react-router";
import { lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ProtectedAuthRoutes from "./routes/ProtectedAuthRoutes";
import PageSuspenseFallback from "./animations/PageSuspenseFallback";
import TourGuideRegisterPage from "./pages/registerPage/TourGuideRegisterPage";
import { AppRoutes } from "./constants/enums";

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/homePage/HomePage"));
const ContactUsPage = lazy(() => import("./pages/contact us/ContactUsPage"));
const SearchPlacePage = lazy(
  () => import("./pages/search place/SearchPlacePage")
);
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

const TypeOfTourism = lazy(
  () => import("./pages/Type of Tourism/TypeOfTourism")
);
const Governorates = lazy(() => import("./pages/Governorates/Governorates"));
const Recommendation = lazy(
  () => import("./pages/Recommendation/Recommendation")
);
const SinglePlace = lazy(() => import("./pages/Single place/SinglePlace"));
const SingleTourism = lazy(
  () => import("./pages/Type of Tourism/SingleTourism")
);
const SingleGovernorate = lazy(
  () => import("./pages/Governorates/SingleGovernorate")
);
const MachineQuotations = lazy(
  () => import("./pages/Machine Quotations/MachineQuotations")
);
const TripDetails = lazy(
  () => import("./pages/Recommendation/Trip Details/TripDetails")
);
const UserProfile = lazy(() => import("./pages/profile/UserProfile"));
const ShowUserProfile = lazy(() => import("./pages/profile/ShowUserProfile"));

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
        <Route
          path={AppRoutes.MACHINE_QUOTATIONS}
          element={
            <PageSuspenseFallback>
              <MachineQuotations />
            </PageSuspenseFallback>
          }
        />
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
            path={AppRoutes.CONTACT_US}
            element={
              <PageSuspenseFallback>
                <ContactUsPage />
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

          <Route element={<ProtectedRoutes />}>
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
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
