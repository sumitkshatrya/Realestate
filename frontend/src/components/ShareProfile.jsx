import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShareAlt, FaLink, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useClickOutside } from '../hooks/useClickOutside';

const ShareProfile = ({ agent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const profileUrl = window.location.href;
  const shareText = `Check out the profile of ${agent.username} on RealEstate!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success('Profile link copied!');
      setIsOpen(false);
    }, () => {
      toast.error('Failed to copy link.');
      setIsOpen(false);
    });
  };

  const shareOptions = [
    { name: 'Copy Link', icon: <FaLink />, action: copyToClipboard, color: 'text-slate-600', hover: 'hover:bg-slate-100' },
    { name: 'Facebook', icon: <FaFacebook />, action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank'), color: 'text-blue-600', hover: 'hover:bg-blue-50' },
    { name: 'Twitter', icon: <FaTwitter />, action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`, '_blank'), color: 'text-sky-500', hover: 'hover:bg-sky-50' },
    { name: 'LinkedIn', icon: <FaLinkedin />, action: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(shareText)}`, '_blank'), color: 'text-blue-800', hover: 'hover:bg-blue-50' },
    { name: 'Email', icon: <FaEnvelope />, action: () => { window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`I thought you might be interested in this agent's profile: ${profileUrl}`)}`; setIsOpen(false); }, color: 'text-gray-700', hover: 'hover:bg-gray-100' },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary inline-flex items-center justify-center gap-2 w-full md:w-auto"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaShareAlt />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          >
            <div className="py-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link' && option.name !== 'Email') {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${option.color} ${option.hover}`}
                >
                  <span className="text-base">{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareProfile;