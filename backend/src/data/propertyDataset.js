

const rawCities = [
  ["Jagatpura", "Jaipur", "Rajasthan", "302017", 26.8417, 75.8203, 431],
  ["Vaishali Nagar", "Jaipur", "Rajasthan", "302021", 26.9124, 75.7486, 430],
  ["Malviya Nagar", "Jaipur", "Rajasthan", "302017", 26.8500, 75.8120, 430],
  ["Mansarovar", "Jaipur", "Rajasthan", "302020", 26.8500, 75.7630, 431],
  ["C-Scheme", "Jaipur", "Rajasthan", "302001", 26.9124, 75.7873, 431],
  ["Udaipur", "Udaipur", "Rajasthan", "313001", 24.5854, 73.7125, 598],
  ["Ratanada", "Jodhpur", "Rajasthan", "342001", 26.2389, 73.0243, 231],
  ["Sector 150", "Noida", "Uttar Pradesh", "201310", 28.4275, 77.3760, 200],
  ["Sector Alpha", "Greater Noida", "Uttar Pradesh", "201310", 28.4744, 77.5030, 216],
  ["Golf Course Road", "Gurugram", "Haryana", "122011", 28.4595, 77.0965, 217],
  ["Whitefield", "Bengaluru", "Karnataka", "560066", 12.9698, 77.7499, 911],
  ["Sarjapur Road", "Bengaluru", "Karnataka", "560035", 12.9105, 77.6871, 897],
  ["ECR", "Chennai", "Tamil Nadu", "600041", 12.9150, 80.2500, 7],
  ["Candolim", "Goa", "Goa", "403515", 15.5182, 73.7626, 11],
  ["Lonavala", "Lonavala", "Maharashtra", "410401", 18.7546, 73.4062, 622],
  ["Hinjewadi", "Pune", "Maharashtra", "411057", 18.5913, 73.7389, 560],
  ["Bandra West", "Mumbai", "Maharashtra", "400050", 19.0607, 72.8362, 10],
  ["Alipore", "Kolkata", "West Bengal", "700027", 22.5307, 88.3297, 9],
  ["Banjara Hills", "Hyderabad", "Telangana", "500034", 17.4156, 78.4347, 536],
  ["Gachibowli", "Hyderabad", "Telangana", "500032", 17.4401, 78.3489, 542],
  ["Rishikesh", "Rishikesh", "Uttarakhand", "249201", 30.0869, 78.2676, 372],
  ["Rajpur Road", "Dehradun", "Uttarakhand", "248001", 30.3165, 78.0322, 640],
  ["Bhopal Lake", "Bhopal", "Madhya Pradesh", "462001", 23.2599, 77.4126, 527],
  ["Vijay Nagar", "Indore", "Madhya Pradesh", "452010", 22.7533, 75.8937, 553],
  ["Banjara Hills", "Hyderabad", "Telangana", "500034", 17.4156, 78.4347, 536],
  ["New Town", "Kolkata", "West Bengal", "700156", 22.5770, 88.4795, 12],
  ["Viman Nagar", "Pune", "Maharashtra", "411014", 18.5679, 73.9143, 560],
  ["Thiruvananthapuram", "Thiruvananthapuram", "Kerala", "695001", 8.5241, 76.9366, 10],
  ["Whitefield", "Bengaluru", "Karnataka", "560066", 12.9698, 77.7499, 911],
  ["Sector 44", "Chandigarh", "Chandigarh", "160047", 30.7046, 76.7179, 321],
];

const rawTitles = [
  "Modern Luxury Pool Villa", "Royal Heritage Villa", "Contemporary Garden Villa",
  "Premium Family Villa", "Executive Pool Residence", "Lakeview Premium Villa",
  "Royal Garden Residence", "Modern White Villa", "Premium Golf Villa",
  "Contemporary City Villa", "Palm Residence", "Gardenia Luxury Villa",
  "Seaside Luxury Villa", "Palm Beach Villa", "Hillside Retreat Villa",
  "Elite Business District Villa", "Skyline Premium Villa", "Royal Palm Estate",
  "Heritage Courtyard Home", "Premium Tech Park Villa", "Peaceful Riverside Villa",
  "Mountain View Estate", "Modern Lake Villa", "Urban Luxury Residence",
  "Imperial Courtyard Villa", "The Grand Estate", "Luxury Courtyard Villa",
  "Green Valley Residence", "Royal City Villa", "The Imperial Luxury Villa"
];

const rawImageIds = [
  "1600607687920-4e2a09cf159d", "1600585154340-be6161a56a0c",
  "1600566753190-17f0baa2a6c3", "1600607688969-a5bfcd646154",
  "1600607687939-ce8a6c25118c", "1600585154526-990dced4db0d",
  "1600047509807-ba8f99d2cdde", "1613490493576-7fde63acd811",
  "1600566753086-00f18fb6b3ea", "1613977257363-707ba9348227",
  "1564013799919-ab600027ffc6", "1605146769289-440113cc3d00",
  "1582268611958-ebfd161ef9cf", "1600047509807-ba8f99d2cdde",
  "1600607688969-a5bfcd646154", "1600566753190-17f0baa2a6c3",
  "1613490493576-7fde63acd811", "1605146769289-440113cc3d00",
  "1600585154526-990dced4db0d", "1600607687920-4e2a09cf159d",
  "1564013799919-ab600027ffc6", "1600566753190-17f0baa2a6c3",
  "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c",
  "1613977257363-707ba9348227", "1600585154526-990dced4db0d",
  "1600566753086-00f18fb6b3ea", "1600047509807-ba8f99d2cdde",
  "1564013799919-ab600027ffc6", "1613490493576-7fde63acd811"
];

const rawPrices = [
  28500000, 42000000, 31000000, 19500000, 57500000, 49000000, 33500000, 29500000, 38500000, 62000000,
  45000000, 39000000, 52000000, 47500000, 34000000, 27500000, 125000000, 65000000, 58000000, 44000000,
  28500000, 36500000, 21000000, 32000000, 54000000, 68000000, 31500000, 26000000, 47000000, 72000000
];

const rawBeds = [4, 5, 4, 4, 5, 4, 4, 4, 5, 5, 4, 4, 5, 4, 4, 4, 5, 5, 5, 4, 4, 5, 4, 4, 5, 6, 4, 3, 5, 6];
const rawBaths = [4, 5, 4, 3, 6, 5, 4, 4, 5, 6, 5, 4, 5, 5, 4, 4, 6, 6, 5, 5, 4, 5, 4, 4, 5, 7, 5, 3, 5, 7];
const rawAreas = [3200, 4800, 3500, 2800, 5200, 4600, 3900, 3300, 4700, 5500, 4200, 3800, 5000, 4300, 3600, 3100, 5200, 6000, 5100, 4100, 3400, 4700, 3000, 3600, 5000, 7200, 3500, 2700, 4400, 6800];

export const initialPropertyDataset = rawCities.map((c, i) => {
  const [locality, city, state, pincode, lat, lng] = c;
  const title = rawTitles[i];
  const imageId = rawImageIds[i];
  const priceVal = rawPrices[i];
  const bed = rawBeds[i];
  const bath = rawBaths[i];
  const areaSqft = rawAreas[i];

  let purpose = "buy";
  if (i % 3 === 1) purpose = "rent";
  if (i % 3 === 2 || title.toLowerCase().includes("business")) purpose = "commercial";

  let category = "Private Villa / House";
  if (title.toLowerCase().includes("villa")) category = "Private Villa / House";
  else if (title.toLowerCase().includes("residence") || title.toLowerCase().includes("estate")) category = "Luxury Apartment";
  else if (purpose === "commercial") category = "Commercial Space";
  else if (title.toLowerCase().includes("skyline")) category = "Penthouse / Condo";
  else if (i % 4 === 0) category = "Townhome";

  let status = "available";
  if (i % 5 === 1) status = "booked";
  if (i % 5 === 2) status = "rented";
  if (i % 5 === 3) status = "sold";

  let formattedPrice = `₹ ${priceVal.toLocaleString("en-IN")}`;
  if (purpose === "rent") {
    formattedPrice = `₹ ${(Math.round(priceVal / 250)).toLocaleString("en-IN")}/mo`;
  }

  const imageUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=1200&q=80`;

  return {
    name: title,
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}-${i + 1}`,
    address: `${locality}, ${city}, ${state} - ${pincode}`,
    price: formattedPrice,
    bed: bed,
    bath: bath,
    area: `${areaSqft} sq ft`,
    latitude: lat,
    longitude: lng,
    images: [imageUrl],
    description: `Luxury property in ${locality}, ${city}, ${state}. Features ${bed} bedrooms, ${bath} bathrooms, and ${areaSqft} sq ft living area.`,
    isActive: true,
    purpose: purpose,
    category: category,
    status: status,
  };
});

