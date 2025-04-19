import { Route, Routes } from "react-router";
import { lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ProtectedAuthRoutes from "./routes/ProtectedAuthRoutes";
import PageSuspenseFallback from "./animations/PageSuspenseFallback";
import SingleTourism from "./pages/Type of Tourism/SingleTourism";
import SingleGovernorate from "./pages/Governorates/SingleGovernorate";

// Lazy Load Pages
const HomePage = lazy(() => import("./pages/homePage/HomePage"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/registerPage/RegisterPage"));
const TypeOfTourism = lazy(
  () => import("./pages/Type of Tourism/TypeOfTourism")
);
const Governorates = lazy(() => import("./pages/Governorates/Governorates"));
const Suggestions = lazy(() => import("./pages/Suggestions/Suggestions"));
const SinglePlace = lazy(() => import("./pages/Single place/SinglePlace"));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<ProtectedAuthRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/"
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
              path="/type-of-tourism"
              element={
                <PageSuspenseFallback>
                  <TypeOfTourism />
                </PageSuspenseFallback>
              }
            />
            <Route
              path="/governorates"
              element={
                <PageSuspenseFallback>
                  <Governorates />
                </PageSuspenseFallback>
              }
            />
            <Route
              path="/governorates/:name"
              element={
                <PageSuspenseFallback>
                  <SingleGovernorate />
                </PageSuspenseFallback>
              }
            />
            <Route
              path="/suggestions"
              element={
                <PageSuspenseFallback>
                  <Suggestions />
                </PageSuspenseFallback>
              }
            />
            <Route
              path="/places/:name"
              element={
                <PageSuspenseFallback>
                  <SinglePlace />
                </PageSuspenseFallback>
              }
            />
            <Route
              path="/type-of-tourism/:name"
              element={
                <PageSuspenseFallback>
                  <SingleTourism />
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
