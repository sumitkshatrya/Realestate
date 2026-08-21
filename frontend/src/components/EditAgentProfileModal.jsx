import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { agentAPI } from '../api/agentApi';
import { FaTimes, FaUser, FaInfoCircle, FaPhone, FaCamera } from 'react-icons/fa';

const EditAgentProfileModal = ({ isOpen, onClose, agent, onProfileUpdate }) => {
  const modalRef = useFocusTrap(isOpen, onClose);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    phone: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        username: agent.username || '',
        bio: agent.bio || '',
        phone: agent.phone || '',
      });
      setPreview(agent.profilePicture || '');
      setProfilePicture(null);
    }
  }, [agent, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append('username', formData.username);
    submissionData.append('bio', formData.bio);
    submissionData.append('phone', formData.phone);
    if (profilePicture) {
      submissionData.append('profilePicture', profilePicture);
    }

    try {
      const response = await agentAPI.updateAgentProfile(submissionData);
      onProfileUpdate(response.data.agent);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
            role="dialog"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close modal">
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Your Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={preview || 'https://via.placeholder.com/96'} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-slate-200" />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 h-8 w-8 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700">
                    <FaCamera />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-semibold mb-2 text-slate-600 flex items-center gap-2"><FaUser /> Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required className="form-input w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600 flex items-center gap-2"><FaPhone /> Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600 flex items-center gap-2"><FaInfoCircle /> Biography</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="form-input w-full" placeholder="Tell everyone a little about yourself..."></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAgentProfileModal;