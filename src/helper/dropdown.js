export const country_list = ["Pakistan", "Iran", "China", "India"];

export const ethnicity_list = [
  "Punjabi",
  "Muhajir",
  "Balochi",
  "Pushtun",
  "Sindhi",
  "Other",
];
export const province = {
  Pakistan: ["Sindh", "Punjab", "KPK", "Balochistan"],
  India: ["A", "B", "C"],
  Iran: ["X", "Y", "Z"],
  China: ["L", "M", "N"],
};
export const type_list = ["Launch", "Hora", "Donda", "Work_boat"];
export const patrol_type_list = [
  "Anti-Poaching",
  "Anti-Narco",
  "Anti Human Trafficking",
  "Law Enforcement",
  "SAR",
];
export const movement_list = ["Fast", "Slow", "Medium", "Stop"];
export const action_list = ["Query", "Boarding", "Apprehension"];
export const platform_type_list = [
  "Cargo Vessels",
  "Container Vessels",
  "Reefer Vessels",
  "Bulk carrier",
  
];
export const port_list = [
  "Qasim",
  "Karachi",
  "Gwadar",
  "Pasni",
  "Keti Bandar",
  "Ormara",
  "Jiwani",
  "Gadani",
  "Somiani",
  "Cochin",
  "Mangalore",
  "Goa",
  "Mumbai",
  "Jamnagar",
  "Kandla",
  "Mundra",
  "Muscat",
  "Abu Dhabi",
  "Dammam",
  "Mina Rashid",
  "Bandar Abbas",
];
export const harbor_list = [
  "BABA ISLAND",
  "BHIT ISLAND",
  "GWADAR",
  "HAWKSBAY PARADISE",
  "IBRAHIM HYDRI",
  "JIWANI",
  "KARACHI FISHIRY",
  "KEMARI",
  "KETI BANDAR",
  "KHADDA",
  "KoFH",
  "MANORA",
  "MARINA CLUB",
  "MOOSA LANE",
  "ORMARA",
  "PASNI",
  "PISHUKAN",
  "SEA MAX",
  "SHAMAS PIR",
  "SONEHRI",
  "SUR BANDER",
  "YOUNAS ABAD",
  "WORLD",
];

export const portListMerchantOverstay = ["GWADAR", "PORT QASIM"];

export const dsrc = ["TER", "SAT"];

export const ais_type_summary = [
  "Tanker",
  "Cargo",
  "Tug",
  "Special Craft",
  "Fishing",
  "Sailing Vessel",
  "Search and Rescue",
  "Pleasure Craft",
  "Other",
];

export const aisTypeSummaryNames = [
  {
    category: "Tanker",
    subcategories: [
      "Crude Oil Tanker",
      "Asphalt/Bitumen Tanker",
      "LPG Tanker",
      "Oil/Chemical Tanker",
      "Oil Products Tanker",
      "LNG Tanker",
      "Chemical Tanker",
      "Shuttle Tanker",
      "Floating Storage/Production",
      "Tanker",
      // ... other subcategories for Tanker ...
    ],
  },
  {
    category: "Cargo",
    subcategories: [
      "Container Ship",
      "Bulk Carrier",
      "Obo Carrier",
      "General Cargo",
      "Ro-Ro Cargo",
      "Heavy Lift Vessel",
      "Cargo",
      "Vehicles Carrier",
      "Timber Carrier",
      "Reefer/Containership",
      // ... other subcategories for Cargo ...
    ],
  },
  {
    category: "Tug",
    subcategories: ["Tug"],
  },
  {
    category: "Special Craft",
    subcategories: [
      "Fire Fighting Vessel",
      "Pilot Vessel",
      "Motor Hopper",
      "Utility Vessel",
      "Hopper Dredger",
      "Landing Craft",
      "Military Ops",
      "Pilot Ship",
      "Offshore Supply Ship",
      "Local Vessel",
    ],
  },
  {
    category: "Fishing",
    subcategories: ["Fishing", "Fishing Vessel"],
  },
  {
    category: "Sailing Vessel",
    subcategories: ["Sailing Vessel"],
  },
  {
    category: "SAR Aircraft",
    subcategories: ["SAR Aircraft"],
  },

  {
    category: "Pleasure Craft",
    subcategories: ["Pleasure Craft"],
  },
  {
    category: "Other",
    subcategories: ["Other"],
  },
];

export const smuggled_Items_Categories = [
  "Drugs/Narco",
  "Liquor",
  "Cooking Oil",
  "Diesel/petroleum",
  "Electronic Items",
  "Vehicles",
];

export const sumggled_items_subCategories = [
  {
    category: "Drugs/Narco",
    subcategories: [
      "Heroin",
      "Hashish",
      "Morphine",
      "Opium",
      "Crystal-White",
      "Crystal–Brown",
      "Crystal-Afghani",
      "Ecstasy Tabs",
      "Methamphetamine (Ice)",
      "Weed",
      "Cocain",
    ],
  },
  {
    category: "Electronic Items",
    subcategories: [
      "A/c",
      "Radio/ Tap Records/ VCR",
      "Computer/ Laptops",
      "LCD/ LED",
      "	Home Appliances",
    ],
  },
  {
    category: "Liquor",
    subcategories: ["-"],
  },
  { category: "Cooking Oil", subcategories: ["-"] },
  { category: "Diesel/petroleum", subcategories: ["-"] },
  { category: "Vehicles", subcategories: ["-"] },
];

export const mission_details_vessel_type = [
  "AU",
  "AMO",
  "AMC",
  "Navy",
  "Coast guard",
];

export const machineryDefects = [
  "Main Propulsion",
  "Power Generator ",
  "Auxiliary Machinery",
  "Communication Sensor",
  "Radar",
  "Weapons",
];

export const TypesOfOperation = [
  "Shadowing",
  "Boarding",
  "SAR",
  "Intereception",
  "Anti-Poaching",
  "Anti-Smuggling",
  "Anti-Narco",
  "Anti-Piracy",
  "Anti-Trafficing",
];

export const Likeliness = [
  "Most Likeness",
  "Likely",
  "Neutal",
  "Un Likely",
  "Most Unlikely",
];

export const condition = [
  "Low Limitation",
  "Partial Limitation",
  "Hampered Limitation",
];
export const ReaonCondition = ["weather", "Fuel", "Machinery"];

export const limitationReason = ["Weather", "Fuel", "MAchinery"];

export const TypeOfEvents = [
  "Excecise",
  "Presence of ERF",
  "Presence of ICG Ship",
  "Presence of IN Ship",
];

export const supportRecieved = ["Air Survillance", "Intel", "Surface Picture"];

export const supportLevel = ["High", "Medium", "Low"];
