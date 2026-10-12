import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaRobot, 
  FaXmark, 
  FaPaperPlane, 
  FaMagnifyingGlass, 
  FaPhone, 
  FaEnvelope, 
  FaWhatsapp, 
  FaBuilding, 
  FaBed, 
  FaBath, 
  FaCalculator, 
  FaCalendarCheck, 
  FaHeart, 
  FaArrowsRotate, 
  FaWandMagicSparkles, 
  FaArrowRight, 
  FaCircleCheck,
  FaChevronDown,
  FaLocationDot
} from "react-icons/fa6";
import { propertyAPI } from "../api/propertyApi";
import { contactAPI } from "../api/contactApi";
import { aiAPI } from "../api/aiApi";
import { getImageUrl } from "../utils/backendUrl";
import toast from "react-hot-toast";

export default function AiChatBox() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [recentlyViewedProps, setRecentlyViewedProps] = useState([]);
  const [contactingProperty, setContactingProperty] = useState(null);
  const [inquiryData, setInquiryData] = useState({ name: "", email: "", message: "" });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  // EMI Calculator state
  const [showEmiCalc, setShowEmiCalc] = useState(false);
  const [emiParams, setEmiParams] = useState({ amount: 5000000, rate: 8.5, years: 20 });
  const [calculatedEmi, setCalculatedEmi] = useState(null);

  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: "init-1",
      sender: "ai",
      text: "👋 Welcome to **PROPSESTATE AI Assistant**!\n\nI can help you search properties, contact dealers for listings you've viewed, calculate loan EMIs, and explore platform features. What would you like to do?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Listen for custom open event (e.g. from Footer or other components)
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    };
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  // Fetch recently viewed properties on open
  useEffect(() => {
    if (isOpen) {
      loadRecentlyViewed();
      setHasUnread(false);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen, isMinimized]);

  const loadRecentlyViewed = async () => {
    try {
      const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      if (viewedIds && viewedIds.length > 0) {
        const res = await propertyAPI.getPropertiesByIds(viewedIds);
        const data = res?.data || res || [];
        setRecentlyViewedProps(Array.isArray(data) ? data : []);
      } else {
        setRecentlyViewedProps([]);
      }
    } catch (err) {
      console.error("Error loading recently viewed properties:", err);
    }
  };

  const quickChips = [
    { label: "🔍 Search Properties", action: "search_prompt" },
    { label: "📞 Contact Dealers (Viewed)", action: "contact_dealers" },
    { label: "🏢 Property Details & Features", action: "property_features" },
    { label: "🧮 EMI Calculator", action: "emi_calc" },
    { label: "📅 Schedule a Visit", action: "schedule_tour" },
    { label: "❤️ My Saved Properties", action: "my_favorites" },
  ];

  const handleChipClick = (action) => {
    if (action === "search_prompt") {
      handleSend("Show me available luxury properties for sale");
    } else if (action === "contact_dealers") {
      handleSend("I want to contact the dealers of the properties I viewed");
    } else if (action === "property_features") {
      handleSend("What details and features can I check for properties on this website?");
    } else if (action === "emi_calc") {
      setShowEmiCalc(true);
      handleSend("Open mortgage and EMI calculator");
    } else if (action === "schedule_tour") {
      handleSend("How can I schedule a property tour or site visit?");
    } else if (action === "my_favorites") {
      handleSend("Where can I see my saved or favorite properties?");
    }
  };

  const calculateEmiValue = (principal, annualRate, tenureYears) => {
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const handleCalculateEmi = (e) => {
    e.preventDefault();
    const emi = calculateEmiValue(emiParams.amount, emiParams.rate, emiParams.years);
    setCalculatedEmi(emi);
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    const q = textToSend.toLowerCase().trim();

    try {
      // 1. DEALER CONTACT FOR VIEWED PROPERTIES
      if (q.includes("contact") || q.includes("dealer") || q.includes("agent") || q.includes("owner") || q.includes("call")) {
        await loadRecentlyViewed();
        const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

        let viewedList = [];
        if (viewedIds.length > 0) {
          const res = await propertyAPI.getPropertiesByIds(viewedIds);
          viewedList = res?.data || res || [];
        }

        if (viewedList.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "ai",
              text: `Here are the **dealers and agents** for the **${viewedList.length} property listing(s)** you have viewed recently. You can call, email, chat on WhatsApp, or send an inquiry directly below:`,
              type: "dealers_list",
              dealersList: viewedList,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "ai",
              text: "You haven't viewed any specific properties yet!\n\nWhen you click on any property on our website, its dealer details will automatically be saved here for quick contact.\n\nIn the meantime, you can reach our **24/7 Central Property Desk**:\n• **Phone:** +91 9528865099\n• **Email:** skumar21082001@gmail.com\n• **Address:** 100 Real Estate Blvd, Suite 400, Uttar Pradesh, India",
              actionButton: { text: "Browse Properties", link: "/#properties" },
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      } 
      // 2. SEARCH PROPERTIES
      else if (
        q.includes("search") || 
        q.includes("find") || 
        q.includes("bhk") || 
        q.includes("apartment") || 
        q.includes("villa") || 
        q.includes("house") || 
        q.includes("rent") || 
        q.includes("sale") || 
        q.includes("commercial") || 
        q.includes("lakh") || 
        q.includes("crore") ||
        q.includes("budget")
      ) {
        // Try parsing query with backend AI
        let parsed = null;
        try {
          const parseRes = await aiAPI.parseQuery(textToSend);
          parsed = parseRes?.data?.structured || parseRes?.structured;
        } catch (e) {
          console.warn("AI parse query fallback:", e);
        }

        // Fetch properties
        const propRes = await propertyAPI.getProperties();
        const allProps = propRes?.data || propRes || [];

        let matches = [];
        if (Array.isArray(allProps) && allProps.length > 0) {
          matches = allProps.filter((p) => {
            const nameMatch = (p.name || "").toLowerCase().includes(parsed?.q || q);
            const addrMatch = (p.address || "").toLowerCase().includes(parsed?.q || q);
            const categoryMatch = parsed?.category ? (p.category || "").toLowerCase().includes(parsed.category.toLowerCase()) : true;
            const purposeMatch = parsed?.purpose ? (p.purpose || "").toLowerCase() === parsed.purpose.toLowerCase() : true;
            const bedMatch = parsed?.bed ? Number(p.bed) === Number(parsed.bed) : true;
            
            return (nameMatch || addrMatch || categoryMatch || purposeMatch || bedMatch);
          });

          // Fallback if strict filter yields 0
          if (matches.length === 0) {
            matches = allProps.slice(0, 3);
          } else {
            matches = matches.slice(0, 4);
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `I searched our listings for "${textToSend}". Here are matching properties found in our database:`,
            type: "property_results",
            properties: matches,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      // 3. PROPERTY DETAILS & FUNCTIONALITIES
      else if (q.includes("detail") || q.includes("feature") || q.includes("function") || q.includes("what can i check")) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `### 🏢 Property Details & Website Functionalities:

Here is everything you can check and do on **PROPSESTATE**:

1. **Property Specifications:**
   • Detailed floor plans, bedroom/bathroom configurations, and total square footage.
   • High-Definition Image Lightbox & photo galleries.
   • Google / Leaflet Interactive Location Map.

2. **AI Intelligence & Valuation:**
   • **AI Match Score:** Calculates how well a home fits your preferences.
   • **Market Price Assessment:** Verifies whether a listing is fair market value or luxury premium.
   • **Neighborhood Intelligence:** Checks schools, hospitals, and transit proximity.

3. **Direct Dealer & Tour Actions:**
   • **Contact Dealer:** Send inquiries or call agents directly.
   • **Schedule a Tour:** Pick date/time for in-person or live video walkthroughs.
   • **Side-by-Side Comparison:** Compare up to 4 properties simultaneously.
   • **Favorites:** Save listings to your personalized shortlist.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      // 4. EMI / MORTGAGE CALCULATOR
      else if (q.includes("emi") || q.includes("mortgage") || q.includes("loan") || q.includes("calculate")) {
        setShowEmiCalc(true);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "Here is our **Interactive EMI Calculator**. You can adjust the loan amount, interest rate, and tenure below to calculate your estimated monthly installment.",
            type: "emi_calculator",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      // 5. SCHEDULE A TOUR
      else if (q.includes("schedule") || q.includes("tour") || q.includes("visit") || q.includes("book")) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `### 📅 How to Schedule a Property Visit:

1. Open any property card or page on the website.
2. Click the **"Schedule a Tour"** button.
3. Select your preferred date, time slot, and tour type (In-Person or Video Call).
4. The verified listing agent will confirm your appointment within 2 hours.`,
            actionButton: { text: "Explore Properties", link: "/#properties" },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      // 6. FAVORITES
      else if (q.includes("favorite") || q.includes("saved") || q.includes("shortlist")) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "You can save any listing by clicking the **Heart icon** on any property card. All your saved listings are stored in your private dashboard.",
            actionButton: { text: "View Saved Properties", link: "/my-favorites" },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      // 7. DEFAULT GENERAL INTELLIGENT FALLBACK
      else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `I'm here to assist with all your real estate needs! You can ask me to:
- 🔍 **Search properties** (e.g., "Find 3 BHK villas under 1 crore")
- 📞 **Contact dealers** for properties you have viewed
- 🏢 **Check property details** (amenities, location score, pricing)
- 🧮 **Calculate mortgage EMIs**
- 📅 **Schedule a visit or video tour**

Select one of the quick options below or type your question:`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("AI Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I encountered a minor issue fetching real-time data. However, you can explore all properties or contact our team directly at **+91 9528865099**.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInquiry = (prop) => {
    setContactingProperty(prop);
    setInquiryData({
      name: "",
      email: "",
      message: `Hi, I am interested in "${prop.name || "this property"}" (ID: ${prop._id || prop.id}). Please share more details and arrange a site visit.`,
    });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email) {
      toast.error("Please enter your name and email.");
      return;
    }

    setSendingInquiry(true);
    try {
      await contactAPI.contactAgent({
        name: inquiryData.name,
        email: inquiryData.email,
        message: inquiryData.message,
        propertyName: contactingProperty?.name,
        propertyId: contactingProperty?._id || contactingProperty?.id,
      });

      toast.success("Inquiry sent to dealer successfully!");
      setContactingProperty(null);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: `✅ **Inquiry Sent!** Your message regarding **"${contactingProperty?.name}"** has been dispatched to the assigned dealer. They will reach out to you at **${inquiryData.email}** shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Inquiry error:", err);
      toast.error("Failed to dispatch inquiry. Please try again or call directly.");
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    setShowEmiCalc(false);
    setCalculatedEmi(null);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Real Estate Assistant"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-extrabold px-4 sm:px-5 py-3.5 rounded-full shadow-2xl shadow-amber-500/30 border border-amber-300/40 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <FaRobot className="size-6 text-slate-950 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-tight leading-none uppercase text-slate-950">
                AI Assistant
              </span>
              <span className="text-[10px] font-bold text-slate-900/80 leading-tight">
                Search & Dealers
              </span>
            </div>

            <FaWandMagicSparkles className="size-3.5 text-slate-950/70 ml-0.5 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[460px] ${
            isMinimized ? "h-[64px]" : "h-[620px] max-h-[92vh]"
          } bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <FaRobot className="size-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-tight">
                  PROPSESTATE AI
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase">
                    PRO
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Search, Dealers & Details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset Chat"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
              >
                <FaArrowsRotate className="size-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
              >
                <FaChevronDown className={`size-3.5 transition-transform ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
              >
                <FaXmark className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60 text-sm scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
                          : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs sm:text-sm">
                        {msg.text}
                      </div>

                      {/* Property Results List */}
                      {msg.type === "property_results" && msg.properties && msg.properties.length > 0 && (
                        <div className="mt-3 space-y-2.5">
                          {msg.properties.map((prop) => (
                            <div
                              key={prop._id || prop.id}
                              className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex gap-3 text-xs hover:border-amber-500/40 transition"
                            >
                              <img
                                src={
                                  Array.isArray(prop.images) && prop.images[0]
                                    ? getImageUrl(prop.images[0])
                                    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"
                                }
                                alt={prop.name}
                                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white truncate text-xs">{prop.name}</h4>
                                <p className="text-amber-400 font-extrabold text-xs">{prop.price}</p>
                                <p className="text-slate-400 text-[11px] truncate flex items-center gap-1 mt-0.5">
                                  <FaLocationDot className="size-2.5 text-slate-500 shrink-0" />
                                  {prop.address || "Prime Location"}
                                </p>
                                <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-800/80">
                                  <Link
                                    to={`/properties/${prop._id || prop.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                                  >
                                    View Details <FaArrowRight className="size-2.5" />
                                  </Link>
                                  <button
                                    onClick={() => handleOpenInquiry(prop)}
                                    className="ml-auto text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer"
                                  >
                                    Contact Dealer
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dealers List for Viewed Properties */}
                      {msg.type === "dealers_list" && msg.dealersList && (
                        <div className="mt-3 space-y-3">
                          {msg.dealersList.map((item) => (
                            <div
                              key={item._id || item.id}
                              className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                                    <FaBuilding className="size-3 text-amber-400" />
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{item.address}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  Verified
                                </span>
                              </div>

                              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex flex-col gap-1 text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">Assigned Dealer:</span>
                                  <span className="font-bold text-slate-200">LuxEstate Senior Advisory</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">Direct Desk:</span>
                                  <span className="font-mono text-amber-400 font-bold">+91 9528865099</span>
                                </div>
                              </div>

                              {/* Dealer Action Buttons */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <a
                                  href="tel:+919528865099"
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                                >
                                  <FaPhone className="size-2.5" /> Call Dealer
                                </a>
                                <a
                                  href={`https://wa.me/919528865099?text=${encodeURIComponent(
                                    `Hello, I viewed ${item.name} on PROPSESTATE and want to connect with the dealer.`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                                >
                                  <FaWhatsapp className="size-3" /> WhatsApp
                                </a>
                                <button
                                  onClick={() => handleOpenInquiry(item)}
                                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                >
                                  <FaEnvelope className="size-2.5" /> Send Inquiry
                                </button>
                                <Link
                                  to={`/properties/${item._id || item.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="ml-auto text-[11px] text-slate-400 hover:text-amber-400 transition"
                                >
                                  Details →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      {msg.actionButton && (
                        <div className="mt-3">
                          {msg.actionButton.link.startsWith("/") ? (
                            <Link
                              to={msg.actionButton.link}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-1.5 rounded-xl font-bold transition"
                            >
                              {msg.actionButton.text} <FaArrowRight className="size-2.5" />
                            </Link>
                          ) : (
                            <a
                              href={msg.actionButton.link}
                              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-1.5 rounded-xl font-bold transition"
                            >
                              {msg.actionButton.text} <FaArrowRight className="size-2.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3.5 py-2.5 rounded-2xl w-fit">
                    <FaWandMagicSparkles className="size-3.5 text-amber-400 animate-spin" />
                    <span>AI is searching listings & agent registry...</span>
                  </div>
                )}

                {/* In-Chat Direct Inquiry Modal / Card */}
                {contactingProperty && (
                  <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/50 shadow-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaEnvelope className="size-3" />
                        Inquire About: {contactingProperty.name}
                      </h4>
                      <button
                        onClick={() => setContactingProperty(null)}
                        className="text-slate-400 hover:text-white p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSubmitInquiry} className="space-y-2 text-xs">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Your Email Address"
                          value={inquiryData.email}
                          onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          required
                          value={inquiryData.message}
                          onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={sendingInquiry}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2 rounded-xl transition cursor-pointer"
                        >
                          {sendingInquiry ? "Dispatching..." : "Send to Dealer"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactingProperty(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* In-Chat EMI Calculator */}
                {showEmiCalc && (
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <FaCalculator className="size-3" /> Mortgage EMI Estimator
                      </span>
                      <button
                        onClick={() => setShowEmiCalc(false)}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCalculateEmi} className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Loan Amount (₹):</span>
                          <span className="font-mono text-white font-bold">
                            ₹{(emiParams.amount / 100000).toFixed(1)} Lakh
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1000000"
                          max="50000000"
                          step="500000"
                          value={emiParams.amount}
                          onChange={(e) => setEmiParams({ ...emiParams, amount: Number(e.target.value) })}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 text-[11px] block mb-1">Interest Rate (%):</label>
                          <input
                            type="number"
                            step="0.1"
                            value={emiParams.rate}
                            onChange={(e) => setEmiParams({ ...emiParams, rate: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 text-[11px] block mb-1">Tenure (Years):</label>
                          <input
                            type="number"
                            value={emiParams.years}
                            onChange={(e) => setEmiParams({ ...emiParams, years: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Calculate Monthly EMI
                      </button>

                      {calculatedEmi && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-[11px] text-slate-400">Estimated Monthly EMI:</p>
                          <p className="text-lg font-black text-emerald-400 font-mono">
                            ₹{calculatedEmi.toLocaleString()} / mo
                          </p>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Chips */}
              <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip.action)}
                    className="whitespace-nowrap bg-slate-950 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-400 text-slate-300 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-800 shadow-sm transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about properties, dealers, EMIs, features..."
                  className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 p-3 rounded-2xl font-bold transition shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
                >
                  <FaPaperPlane className="size-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

