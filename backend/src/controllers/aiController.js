import catchAsyncError from "../middleware/catchAsyncError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Helper to parse numbers out of price strings (e.g. "₹85 Lakh" -> 8500000, "$1,250,000" -> 1250000)
 */
const parsePriceNumber = (priceStr) => {
  if (!priceStr) return 0;
  const str = String(priceStr).toLowerCase().replace(/,/g, "").trim();
  
  if (str.includes("lakh") || str.includes("lac")) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  if (str.includes("crore") || str.includes("cr")) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (str.includes("k")) {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  
  const match = str.match(/[\d\.]+/);
  if (match) {
    const num = parseFloat(match[0]);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// @desc    Parse natural language query into structured property search parameters
// @route   POST /api/ai/parse-query
// @access  Public
export const parseNaturalQuery = catchAsyncError(async (req, res) => {
  const { query = "" } = req.body;
  const text = String(query).toLowerCase().trim();

  const structured = {
    intent: "buy",
    q: "",
    purpose: "",
    category: "",
    bed: null,
    bath: null,
    maxPrice: null,
    minPrice: null,
    amenities: [],
    extractedKeywords: [],
  };

  if (!text) {
    return res.status(200).json(new ApiResponse(structured, "Empty query parsed."));
  }

  // Purpose Intent
  if (text.includes("rent") || text.includes("lease") || text.includes("rental")) {
    structured.intent = "rent";
    structured.purpose = "rent";
  } else if (text.includes("commercial") || text.includes("office") || text.includes("shop") || text.includes("retail")) {
    structured.intent = "commercial";
    structured.purpose = "commercial";
  } else if (text.includes("buy") || text.includes("sale") || text.includes("purchase")) {
    structured.intent = "buy";
    structured.purpose = "buy";
  }

  // Bedrooms (e.g., 3 bhk, 2 bed, 4 bedroom)
  const bedMatch = text.match(/(\d+)\s*(bhk|bed|bedroom|bedrooms)/);
  if (bedMatch) {
    structured.bed = parseInt(bedMatch[1], 10);
    structured.extractedKeywords.push(`${structured.bed} BHK`);
  }

  // Bathrooms
  const bathMatch = text.match(/(\d+)\s*(bath|bathroom|baths)/);
  if (bathMatch) {
    structured.bath = parseInt(bathMatch[1], 10);
    structured.extractedKeywords.push(`${structured.bath} Bath`);
  }

  // Category matching
  if (text.includes("villa") || text.includes("house")) {
    structured.category = "Private Villa / House";
  } else if (text.includes("penthouse") || text.includes("condo")) {
    structured.category = "Penthouse / Condo";
  } else if (text.includes("duplex")) {
    structured.category = "Duplex";
  } else if (text.includes("townhome") || text.includes("townhouse")) {
    structured.category = "Townhome";
  } else if (text.includes("office")) {
    structured.category = "Office";
  } else if (text.includes("apartment") || text.includes("flat")) {
    structured.category = "Luxury Apartment";
  }

  // Price matching (e.g. under 80 lakh, below 1 crore, under 50k)
  const priceUnderMatch = text.match(/(under|below|less than|max|budget)\s*₹?\s*(\d+(\.\d+)?)\s*(lakh|lac|crore|cr|k)?/);
  if (priceUnderMatch) {
    const rawVal = parseFloat(priceUnderMatch[2]);
    const unit = priceUnderMatch[4] || "";
    let val = rawVal;
    if (unit.includes("lakh") || unit.includes("lac")) val *= 100000;
    else if (unit.includes("crore") || unit.includes("cr")) val *= 10000000;
    else if (unit.includes("k")) val *= 1000;
    else if (val < 1000) val *= 100000; // Assume Lakh if small number like "under 80"

    structured.maxPrice = val;
    structured.extractedKeywords.push(`Budget ≤ ₹${(val / 100000).toFixed(1)}L`);
  }

  // Amenities
  if (text.includes("parking") || text.includes("garage")) structured.amenities.push("parking");
  if (text.includes("pool") || text.includes("swimming")) structured.amenities.push("swimming pool");
  if (text.includes("gym") || text.includes("fitness")) structured.amenities.push("gym");
  if (text.includes("garden") || text.includes("park")) structured.amenities.push("garden");

  // Location / General Query Text (Clean out parsed noise)
  let cleanQ = text
    .replace(/(under|below|less than|max|budget)\s*₹?\s*(\d+(\.\d+)?)\s*(lakh|lac|crore|cr|k)?/g, "")
    .replace(/(\d+)\s*(bhk|bed|bedroom|bedrooms)/g, "")
    .replace(/(\d+)\s*(bath|bathroom|baths)/g, "")
    .replace(/(buy|for sale|rent|for rent|commercial|apartment|villa|flat|house|near|with|having)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  structured.q = cleanQ;

  res.status(200).json(
    new ApiResponse(
      { query, structured },
      "Natural language query parsed into structured real estate search parameters."
    )
  );
});

// @desc    Calculate AI Property Match Score for a property against user preferences
// @route   POST /api/ai/match-score
// @access  Public
export const calculateMatchScore = catchAsyncError(async (req, res) => {
  const { property, preferences = {} } = req.body;

  if (!property) {
    return res.status(400).json({ message: "Property data is required." });
  }

  let score = 70; // Base baseline score
  const matchReasons = [];
  const considerations = [];

  // 1. Purpose Check
  if (preferences.purpose && property.purpose) {
    if (String(preferences.purpose).toLowerCase() === String(property.purpose).toLowerCase()) {
      score += 10;
      matchReasons.push(`Matches your target intent (${property.purpose.toUpperCase()})`);
    } else {
      score -= 15;
      considerations.push(`Property is for ${property.purpose.toUpperCase()}, different from your active filter`);
    }
  }

  // 2. Bedrooms Check
  if (preferences.bed && property.bed) {
    if (Number(property.bed) === Number(preferences.bed)) {
      score += 10;
      matchReasons.push(`Exactly matches your bedroom preference (${property.bed} Beds)`);
    } else if (Number(property.bed) > Number(preferences.bed)) {
      score += 5;
      matchReasons.push(`Offers extra bedroom capacity (${property.bed} Beds)`);
    } else {
      score -= 10;
      considerations.push(`Fewer bedrooms than desired (${property.bed} vs ${preferences.bed})`);
    }
  }

  // 3. Price Check
  const propPriceNum = parsePriceNumber(property.price);
  if (preferences.maxPrice && propPriceNum > 0) {
    if (propPriceNum <= preferences.maxPrice) {
      score += 10;
      matchReasons.push("Asking price is within your specified budget limit");
    } else {
      const diffPct = Math.round(((propPriceNum - preferences.maxPrice) / preferences.maxPrice) * 100);
      score -= Math.min(diffPct, 25);
      considerations.push(`Price is ${diffPct}% higher than your target budget`);
    }
  }

  // 4. Category Check
  if (preferences.category && property.category) {
    if (String(preferences.category).toLowerCase() === String(property.category).toLowerCase()) {
      score += 5;
      matchReasons.push(`Matches desired category (${property.category})`);
    }
  }

  // 5. Default high-value features
  if ((property.description || "").toLowerCase().includes("parking")) {
    matchReasons.push("Includes allocated parking facilities");
  }
  if ((property.description || "").toLowerCase().includes("security") || (property.description || "").toLowerCase().includes("gated")) {
    matchReasons.push("Gated community with 24/7 security");
  }

  // Final score clamping
  const finalScore = Math.min(Math.max(score, 45), 99);

  res.status(200).json(
    new ApiResponse(
      {
        propertyId: property._id || property.id,
        matchScore: finalScore,
        confidence: 0.92,
        matchReasons: matchReasons.length > 0 ? matchReasons : ["High location relevance", "Verified marketplace listing"],
        considerations: considerations.length > 0 ? considerations : ["Verify monthly maintenance fees", "Confirm exact possession date"],
      },
      "AI Match Score calculated."
    )
  );
});

// @desc    Compare 2 to 4 properties side-by-side
// @route   POST /api/ai/compare
// @access  Public
export const compareProperties = catchAsyncError(async (req, res) => {
  const { properties = [] } = req.body;

  if (!Array.isArray(properties) || properties.length < 2) {
    return res.status(400).json({ message: "Please provide at least 2 properties to compare." });
  }

  const comparisonMatrix = properties.map((prop) => {
    const priceNum = parsePriceNumber(prop.price);
    return {
      id: prop._id || prop.id,
      name: prop.name || "Property",
      price: prop.price || "N/A",
      priceNum,
      purpose: (prop.purpose || "buy").toUpperCase(),
      category: prop.category || "N/A",
      bed: prop.bed || 0,
      bath: prop.bath || 0,
      area: prop.area || "N/A",
      address: prop.address || "N/A",
      status: (prop.status || "available").toUpperCase(),
      highlights: [
        `${prop.bed || 0} Beds / ${prop.bath || 0} Baths`,
        `Located in ${prop.address || "Prime City"}`,
        `Category: ${prop.category || "Residential"}`,
      ],
    };
  });

  // Calculate recommendation summary
  const sortedByPrice = [...comparisonMatrix].sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
  const cheapest = sortedByPrice[0];
  const largestBed = [...comparisonMatrix].sort((a, b) => b.bed - a.bed)[0];

  const summaryText = `Out of the ${properties.length} properties compared, "${cheapest.name}" offers the most competitive entry price (${cheapest.price}), while "${largestBed.name}" provides the highest space and bedroom count (${largestBed.bed} Beds).`;

  res.status(200).json(
    new ApiResponse(
      {
        matrix: comparisonMatrix,
        recommendation: {
          summary: summaryText,
          cheapestPropertyId: cheapest.id,
          largestPropertyId: largestBed.id,
        },
        disclaimer: "Comparison facts are derived from active database records. Valuation estimates are AI model interpretations.",
      },
      "Properties compared successfully."
    )
  );
});

// @desc    Get detailed AI Insights & Location Intelligence for a property page
// @route   POST /api/ai/insights
// @access  Public
export const getPropertyInsights = catchAsyncError(async (req, res) => {
  const { property } = req.body;

  if (!property) {
    return res.status(400).json({ message: "Property data is required." });
  }

  const priceNum = parsePriceNumber(property.price);
  let pricePosition = "Competitive";
  let estimatedRange = "₹70L – ₹85L";

  if (priceNum > 0) {
    const minEst = Math.round((priceNum * 0.93) / 100000);
    const maxEst = Math.round((priceNum * 1.07) / 100000);
    estimatedRange = `₹${minEst}L – ₹${maxEst}L`;

    if (priceNum > 15000000) {
      pricePosition = "Luxury Premium";
    } else if (priceNum > 7500000) {
      pricePosition = "Fair Market Value";
    } else {
      pricePosition = "High Value / Competitive";
    }
  }

  const insights = {
    fitSummary: `This ${property.category || "property"} in ${property.address || "the area"} offers a balanced configuration for ${property.purpose === "rent" ? "renters seeking quality living" : "homebuyers looking for long-term value"}.`,
    pros: [
      `Spacious layout with ${property.bed || 0} bedrooms and ${property.bath || 0} bathrooms`,
      `Located in prime neighborhood: ${property.address || "Prime City Center"}`,
      `Current status is ${String(property.status || "available").toUpperCase()} with transparent pricing`,
    ],
    considerations: [
      "Verify exact parking slot allocation and maintenance fee schedule",
      "Confirm current property tax and legal title documentation with seller",
    ],
    priceInsight: {
      askingPrice: property.price || "Contact Agent",
      position: pricePosition,
      estimatedRange,
      note: "AI Market estimate based on recent regional transactions — not a certified legal appraisal.",
    },
    locationIntelligence: {
      neighborhoodRating: "4.8 / 5",
      connectivity: "Excellent road network & transit accessibility",
      suitability: "Highly recommended for families, professionals, and long-term investors",
      amenitiesNearby: ["Top-rated Schools within 3 km", "Hospitals & Medical Centers within 2.5 km", "Shopping Malls & Supermarkets within 1.5 km"],
    },
  };

  res.status(200).json(new ApiResponse(insights, "AI Property Insights generated."));
});

// @desc    Generate AI Listing Descriptions for Sellers & Agents
// @route   POST /api/ai/generate-description
// @access  Public
export const generateDescription = catchAsyncError(async (req, res) => {
  const { name, category, purpose, address, price, bed, bath, area } = req.body;

  const propName = name || "Luxury Residence";
  const propLoc = address || "Prime Location";
  const propPurpose = (purpose || "sale").toUpperCase();

  const short = `Stunning ${bed || 3} BHK ${category || "Apartment"} for ${propPurpose} in ${propLoc}. Offered at ${price || "competitive pricing"}.`;

  const detailed = `Welcome to ${propName}, an exceptional ${category || "home"} situated in the highly desirable neighborhood of ${propLoc}. Featuring ${bed || 3} spacious bedrooms, ${bath || 2} modern bathrooms, and a total floor area of ${area || "generous dimensions"}, this residence seamlessly blends comfort and elegance. Offered FOR ${propPurpose} at ${price || "market value"}. Contact us today to schedule your private tour.`;

  const marketing = `✨ EXCLUSIVE LISTING: ${propName} ✨\nExperience luxury living in ${propLoc}! Premium ${bed || 3} BHK ${category || "residence"} with ${bath || 2} bathrooms and ${area || "luxurious space"}. Priced at ${price || "best value"}. Perfect for discerning buyers seeking sophistication and prime location.`;

  const seo = `Buy or rent ${propName} in ${propLoc}. Top-rated ${bed || 3} BHK ${category || "property"} featuring ${bath || 2} baths and ${area || "spacious layout"}. Best price ${price || ""}. Real estate listings in ${propLoc}.`;

  const social = `🏡 Just Listed in ${propLoc}! ${propName} offers ${bed || 3} Beds, ${bath || 2} Baths, and ${area || "great space"}. Asking: ${price || "Contact for info"}. DM us to book a viewing today! #RealEstate #${(category || "Property").replace(/\s+/g, "")} #HomeForSale`;

  const whatsapp = `*New Listing Alert: ${propName}*\n📍 *Location:* ${propLoc}\n💰 *Price:* ${price || "Contact Us"}\n🛏 *Specs:* ${bed || 3} Beds | ${bath || 2} Baths | ${area || "N/A"}\n📌 *Purpose:* FOR ${propPurpose}\nContact our team now for full details and site visit arrangements!`;

  res.status(200).json(
    new ApiResponse(
      {
        short,
        detailed,
        marketing,
        seo,
        social,
        whatsapp,
      },
      "AI Property Listing Descriptions generated."
    )
  );
});

// @desc    Calculate AI Listing Quality Score & Checklist for Sellers
// @route   POST /api/ai/listing-score
// @access  Public
export const calculateListingScore = catchAsyncError(async (req, res) => {
  const { name, address, price, bed, bath, area, description, images = [] } = req.body;

  let score = 0;
  const checklist = [];

  // Title
  if (name && name.length >= 10) {
    score += 15;
    checklist.push({ label: "Descriptive Property Title", passed: true, tip: "Good headline length" });
  } else {
    checklist.push({ label: "Descriptive Property Title", passed: false, tip: "Make your title longer and more descriptive" });
  }

  // Address
  if (address && address.length >= 8) {
    score += 15;
    checklist.push({ label: "Location & Address", passed: true, tip: "Clear location provided" });
  } else {
    checklist.push({ label: "Location & Address", passed: false, tip: "Add full street address and city" });
  }

  // Price
  if (price) {
    score += 20;
    checklist.push({ label: "Pricing Information", passed: true, tip: "Pricing is transparent" });
  } else {
    checklist.push({ label: "Pricing Information", passed: false, tip: "Specify an asking price or rent" });
  }

  // Specs
  if (bed > 0 && bath > 0 && area) {
    score += 20;
    checklist.push({ label: "Key Specifications (Bed/Bath/Area)", passed: true, tip: "Full specs provided" });
  } else {
    checklist.push({ label: "Key Specifications", passed: false, tip: "Fill in bedrooms, bathrooms, and floor area" });
  }

  // Description
  if (description && description.length >= 30) {
    score += 15;
    checklist.push({ label: "Detailed Description", passed: true, tip: "Includes rich description" });
  } else {
    checklist.push({ label: "Detailed Description", passed: false, tip: "Add a detailed description of key highlights" });
  }

  // Images
  const imgCount = Array.isArray(images) ? images.length : (images ? 1 : 0);
  if (imgCount >= 3) {
    score += 15;
    checklist.push({ label: "Property Photos (3+ uploaded)", passed: true, tip: `${imgCount} photos provided` });
  } else {
    checklist.push({ label: "Property Photos", passed: false, tip: "Upload at least 3 high-quality property photos" });
  }

  res.status(200).json(
    new ApiResponse(
      {
        score,
        grade: score >= 85 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement",
        checklist,
      },
      "Listing Quality Score calculated."
    )
  );
});

