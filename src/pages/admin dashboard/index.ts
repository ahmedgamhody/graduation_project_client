const visitingHoursOptions = [
  "8 AM - 12 PM",
  "9 AM - 5 PM",
  "10 AM - 6 PM",
  "12 PM - 4 PM",
  "4 PM - 8 PM",
  "8 PM - 12 AM",
] as const;

const allGovernorates = [
  "Alexandria",
  "Aswan",
  "Bahariya",
  "Cairo",
  "Esna",
  "Fayoum",
  "Giza",
  "Ismailia",
  "Kafr El-Sheikh",
  "Luxor",
  "Matrouh",
  "Minya",
  "New Valley",
  "Qena",
  "Rashid",
  "Red Sea",
  "Sharqia",
  "Sinai",
  "Siwa",
  "Sohag",
  "Suez",
  "Tanta",
  "Wadi El Natrun",
] as const;

const allTypesOfTourism = [
  "Adventure",
  "Cultural",
  "Environmental",
  "Festivals",
  "Heritage",
  "Historical",
  "Marine",
  "Recreational",
  "Religious",
] as const;

const allProgramsNames = [
  "Adventure Program",
  "Beach Program",
  "Historical Program",
  "Major Cities Program",
  "Relaxation Program",
] as const;

export {
  visitingHoursOptions,
  allGovernorates,
  allTypesOfTourism,
  allProgramsNames,
};
