import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { agentAPI } from "../api/agentApi";
import { userAPI } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import { FaEnvelope, FaPhone, FaUserCircle, FaArrowLeft } from "react-icons/fa";

const AgentProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      window.scrollTo(0, 0);
      try {
        setLoading(true);
        const response = await agentAPI.getAgentProfile(id);
        setAgent(response.data.agent);
        setProperties(response.data.properties);
      } catch (err) {
        setError("Failed to load agent profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProfile();
  }, [id]);

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your favorites.");
      return;
    }

    const isCurrentlyFavorite = user?.favorites?.includes(propertyId);
    const originalFavorites = user?.favorites ? [...user.favorites] : [];

    const newFavorites = isCurrentlyFavorite
      ? originalFavorites.filter((favId) => favId !== propertyId)
      : [...originalFavorites, propertyId];
    updateUser({ favorites: newFavorites });

    try {
      await userAPI.toggleFavorite(propertyId);
    } catch (err) {
      toast.error("Failed to update favorites.");
      updateUser({ favorites: originalFavorites });
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Agent Profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  if (!agent) {
    return <div className="text-center py-20 text-xl">Agent not found.</div>;
  }

  return (
    <div className="section-shell py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={-1} className="inline-flex items-center gap-2 text-rose-600 font-semibold mb-8 hover:underline">
          <FaArrowLeft />
          Back
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-12 flex flex-col md:flex-row items-center gap-8">
          {agent.profilePicture ? (
            <img src={agent.profilePicture} alt={agent.username} className="w-32 h-32 rounded-full object-cover border-4 border-rose-500" />
          ) : (
            <FaUserCircle className="w-32 h-32 text-slate-300" />
          )}
          <div>
            <h1 className="font-serif text-4xl font-bold text-slate-900">{agent.username}</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">{agent.bio || "This agent has not provided a biography yet."}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
              <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-slate-700 hover:text-rose-600">
                <FaEnvelope /> {agent.email}
              </a>
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-rose-600">
                  <FaPhone /> {agent.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8">Properties Listed by {agent.username}</h2>
        {properties.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} isFavorite={user?.favorites?.includes(p._id)} onToggleFavorite={isAuthenticated ? handleToggleFavorite : null} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10 bg-slate-50 rounded-lg">This agent has no active listings.</p>
        )}
      </motion.div>
    </div>
  );
};

export default AgentProfile;