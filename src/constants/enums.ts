export enum AppRoutes {
  // Auth Pages
  LOGIN = "/login",
  REGISTER = "/register",
  REGISTER_USER = "/register/user",
  REGISTER_TOUR_GUIDE = "/register/tour-guide",

  // Main Pages
  ROOT = "/",
  TYPE_OF_TOURISM = "/type-of-tourism",
  GOVERNORATES = "/governorates",
  MACHINE_QUOTATIONS = "/machine-quotations",

  // Dynamic Pages
  SINGLE_TOURISM = "/type-of-tourism/:name",
  SINGLE_GOVERNORATE = "/governorates/:name",
  SINGLE_PLACE = "/places/:name",
  TRIP_DETAILS = "/recommendation/trips/:name",

  // Protected Pages
  RECOMMENDATION = "/recommendation",
  USER_PROFILE = "/user-profile",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
