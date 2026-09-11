import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { servicesAPI } from "../api/servicesApi";
import { contactAPI } from "../api/contactApi";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaBuilding,
  FaChartLine,
  FaCity,
  FaClipboardList,
  FaHandshake,
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaSearchDollar,
  FaTools,
  FaShieldAlt,
  FaCheckCircle,
  FaPaperPlane,
  FaClock,
  FaUserCheck,
  FaArrowRight,
  FaStar,
  FaPhone
} from "react-icons/fa";

const iconMap = {
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaChartLine,
  FaBuilding,
  FaTools,
  FaHandshake,
  FaCity,
  FaSearchDollar,
  FaClipboardList,
};

const DEFAULT_SERVICES = [
  {
    _id: "valuation-advisory",
    title: "Property Valuation & Pricing Strategy",
    description: "Accurate, data-driven market valuations and comparative pricing analysis to maximize your return on investment whether selling or buying.",
    icon: "FaChartLine",
    longDescription: "Our comprehensive valuation service combines real-time neighborhood transaction data, physical inspection metrics, and market momentum analysis. We ensure your property is listed at peak market value or that your purchase offer is backed by rigorous financial justification.",
    benefits: [
      "Comparative Market Analysis (CMA) by certified appraisers",
      "Historical price trend evaluation & projected appreciation",
      "Customized pricing strategy for competitive advantages",
      "Detailed structural & amenity impact reports"
    ],
    steps: [
      "Property Inspection & Data Collection",
      "Comprehensive Market Comparison",
      "Custom Valuation Report Generation",
      "Pricing Strategy & Consultation"
    ]
  },
  {
    _id: "vip-buying-selling",
    title: "VIP Buying & Selling Advisory",
    description: "End-to-end guidance for high-value residential and commercial property transactions with dedicated real estate specialists.",
    icon: "FaHandshake",
    longDescription: "Navigating premium real estate requires discrete, high-touch advisory. We manage private off-market listings, perform buyer qualification, handle contract negotiations, and coordinate all closing logistics to guarantee a seamless transaction.",
    benefits: [
      "Exclusive access to off-market & pocket listings",
      "Tailored negotiation strategy for optimal transaction terms",
      "Dedicated senior estate advisor throughout the process",
      "Complete escrow and closing coordination"
    ],
    steps: [
      "Requirements & Financial Alignment",
      "Curated Property Shortlisting",
      "Strategic Offer & Negotiation",
      "Seamless Closing & Keys Handover"
    ]
  },
  {
    _id: "legal-coordination",
    title: "Legal & Title Coordination",
    description: "Expert legal review of property deeds, title searches, zoning restrictions, and contract disclosures to protect your investment.",
    icon: "FaShieldAlt",
    longDescription: "Real estate transactions involve complex legal frameworks. Our team works directly with licensed real estate attorneys and title companies to audit title chains, verify encumbrances, and ensure every contract strictly protects your rights.",
    benefits: [
      "Thorough title search and lien verification",
      "Contract drafting and legal compliance review",
      "HOA covenants and zoning restriction analysis",
      "Dispute prevention and escrow risk mitigation"
    ],
    steps: [
      "Document Audit & Title Search",
      "Contract Review & Redlining",
      "Title Insurance & Escrow Setup",
      "Final Execution & Recording"
    ]
  },
  {
    _id: "property-management",
    title: "Property Management & Maintenance",
    description: "Full-service management for asset owners including tenant screening, rental collection, regular maintenance, and financial reporting.",
    icon: "FaBuilding",
    longDescription: "Maximize your rental yield without the stress of daily landlord responsibilities. We handle tenant recruitment, 24/7 maintenance dispatch, lease enforcement, and transparent monthly accounting reports.",
    benefits: [
      "Comprehensive background & credit screening for tenants",
      "Automated online rent collection & direct deposit",
      "On-demand 24/7 emergency maintenance response",
      "Quarterly property inspections and financial statements"
    ],
    steps: [
      "Property Onboarding & Audit",
      "Tenant Marketing & Screening",
      "Lease Agreement & Deposit Handling",
      "Ongoing Management & Yield Tracking"
    ]
  }
];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setInquiryData((prev) => ({
        ...prev,
        fullname: user.username || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        // Fetch all services to populate fallback/related list
        const res = await servicesAPI.getServices();
        let fetchedList = [];
        if (res && res.data) {
          fetchedList = res.data;
        } else if (Array.isArray(res)) {
          fetchedList = res;
        }
        setAllServices(fetchedList.length > 0 ? fetchedList : DEFAULT_SERVICES);

        // Fetch target service by ID
        let found = fetchedList.find((s) => s._id === id || s.slug === id);

        if (!found && id) {
          try {
            const singleRes = await servicesAPI.getServiceById(id);
            if (singleRes && singleRes.data) {
              found = singleRes.data;
            }
          } catch {
            console.log("Service ID lookup fallback check");
          }
        }

        // If still not found, check default static list
        if (!found) {
          found = DEFAULT_SERVICES.find((s) => s._id === id || s.title.toLowerCase().includes(id.toLowerCase())) || DEFAULT_SERVICES[0];
        }

        setService(found);
      } catch (err) {
        console.error("Error fetching service details:", err);
        // Fallback to default static service matching
        const fallback = DEFAULT_SERVICES.find((s) => s._id === id) || DEFAULT_SERVICES[0];
        setService(fallback);
        setAllServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleInquiryChange = (e) => {
    setInquiryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to send a service inquiry.");
      navigate("/login");
      return;
    }

    if (!inquiryData.fullname.trim() || !inquiryData.email.trim()) {
      toast.error("Please provide your name and email.");
      return;
    }

    setInquiryLoading(true);
    try {
      await contactAPI.sendMessage({
        ...inquiryData,
        subject: `Inquiry regarding service: ${service?.title || "Real Estate Service"}`,
      });
      toast.success("Inquiry sent successfully! Our specialist will call you back.");
      setInquirySent(true);
      setInquiryData((prev) => ({ ...prev, message: "", phone: "" }));
    } catch (err) {
      toast.error(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading service details...</p>
        </div>
      </div>
    );
  }

  const IconComp = iconMap[service?.icon] || FaBuilding;

  const benefitsList = service?.benefits || [
    "Dedicated real estate advisor assigned to your account",
    "Data-driven valuation and comparative market reports",
    "Complete legal, title, and escrow coordination",
    "Guaranteed 24-hour turnaround on initial consultations"
  ];

  const stepsList = service?.steps || [
    "Initial Discovery & Requirement Analysis",
    "Custom Strategy & Market Evaluation",
    "Execution, Negotiation & Management",
    "Final Settlement & Outcome Delivery"
  ];

  const relatedServices = allServices.filter((s) => s._id !== service?._id).slice(0, 3);

  return (
    <div className="bg-slate-950 min-h-screen pt-24 pb-20 text-slate-100 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 font-semibold text-xs transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-xs" />
            Back to All Services
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            Real Estate Services / <strong className="text-slate-300">{service?.title}</strong>
          </span>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl mb-12 relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <FaShieldAlt /> Premium Service Offering
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {service?.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {service?.longDescription || service?.description}
              </p>

              {/* Service Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
                  <FaUserCheck className="text-emerald-400 text-sm" />
                  <span>Expert Advisor Support</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
                  <FaClock className="text-blue-400 text-sm" />
                  <span>Rapid 2-Hour Response</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
                  <FaStar className="text-amber-400 text-sm" />
                  <span>4.9 / 5 Client Rating</span>
                </div>
              </div>
            </div>

            {/* Icon Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-1 shadow-2xl flex items-center justify-center text-white text-5xl sm:text-6xl">
                <div className="w-full h-full bg-slate-950/90 rounded-[22px] flex items-center justify-center text-amber-400">
                  <IconComp />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dual Grid: Benefits & Step-by-Step Process */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-slate-900/70 border border-slate-800 p-8 rounded-3xl space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaCheckCircle className="text-amber-400 text-xl" />
              Key Benefits & Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              When you engage our real estate team for <strong className="text-slate-200">{service?.title}</strong>, you receive complete professional backing:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefitsList.map((benefit, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-400 text-base shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-slate-900/70 border border-slate-800 p-8 rounded-3xl space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Execution Process</h2>
            <div className="space-y-4">
              {stepsList.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{step}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Embedded Inquiry Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl mb-16"
        >
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Direct Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Request Advisory for {service?.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Fill out the form below to speak with an accredited specialist regarding this service.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3 max-w-lg mx-auto">
              <FaCheckCircle className="text-emerald-400 text-4xl mx-auto" />
              <h3 className="text-xl font-bold text-white">Inquiry Received!</h3>
              <p className="text-xs text-slate-300">
                Thank you for your interest in {service?.title}. One of our senior advisors will reach out within 2 hours.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    placeholder="John Doe"
                    value={inquiryData.fullname}
                    onChange={handleInquiryChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={inquiryData.email}
                    onChange={handleInquiryChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Phone Number <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={inquiryData.phone}
                  onChange={handleInquiryChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Additional Details or Requirements
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder={`Describe your specific needs for ${service?.title}...`}
                  value={inquiryData.message}
                  onChange={handleInquiryChange}
                  className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={inquiryLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {inquiryLoading ? (
                  "Submitting Request..."
                ) : (
                  <>
                    <span>Submit Service Inquiry</span>
                    <FaPaperPlane className="text-xs" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Explore Other Services */}
        {relatedServices.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Explore Other Advisory Services</h3>
              <Link to="/#services" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
                <span>View All</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedServices.map((rel) => {
                const RelIcon = iconMap[rel.icon] || FaBuilding;
                return (
                  <div
                    key={rel._id}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-lg">
                        <RelIcon />
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-400 transition">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {rel.description}
                      </p>
                    </div>

                    <Link
                      to={`/services/${rel.slug || rel._id}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Explore</span>
                      <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

