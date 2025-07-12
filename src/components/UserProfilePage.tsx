import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Save, RotateCcw, MapPin, User, Mail, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const currentUserProfile = mockUsers.find(u => u.id === user?.id) || mockUsers[0];
  
  const [profile, setProfile] = useState({
    name: currentUserProfile.name,
    location: currentUserProfile.location || '',
    skillsOffered: [...currentUserProfile.skillsOffered],
    skillsWanted: [...currentUserProfile.skillsWanted],
    availability: [...currentUserProfile.availability],
    isPublic: currentUserProfile.isPublic,
    profileImage: currentUserProfile.profileImage
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const availabilityOptions = ['weekdays', 'weekends', 'evenings'];

  const handleSave = () => {
    console.log('Saving profile:', profile);
    alert('Profile saved successfully!');
  };

  const handleReset = () => {
    setProfile({
      name: currentUserProfile.name,
      location: currentUserProfile.location || '',
      skillsOffered: [...currentUserProfile.skillsOffered],
      skillsWanted: [...currentUserProfile.skillsWanted],
      availability: [...currentUserProfile.availability],
      isPublic: currentUserProfile.isPublic,
      profileImage: currentUserProfile.profileImage
    });
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !profile.skillsOffered.includes(newSkillOffered.trim())) {
      setProfile(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !profile.skillsWanted.includes(newSkillWanted.trim())) {
      setProfile(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const removeSkillWanted = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const toggleAvailability = (option: string) => {
    setProfile(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // In real app, handle file upload here
    console.log('Image dropped');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 lg:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              NEURAL PROFILE
            </motion.h1>
            <p className="text-gray-400">Configure your digital identity</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="xl:col-span-1 space-y-6">
              {/* Profile Image Upload */}
              <div className="text-center">
                <label className="block text-gray-300 font-medium mb-4">
                  Avatar Upload Zone
                </label>
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  className={`relative w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-dashed ${
                    isDragOver ? 'border-teal-400 bg-teal-400/10' : 'border-gray-600'
                  } transition-all duration-300 mx-auto flex items-center justify-center group cursor-pointer`}
                >
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="text-gray-400 group-hover:text-teal-400 transition-colors duration-200" size={24} />
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Upload className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    <User className="inline mr-2" size={16} />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Profile Stats */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Star className="mr-2 text-yellow-400" size={16} />
                  Profile Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-yellow-400">{currentUserProfile.rating.toFixed(1)} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skills Offered:</span>
                    <span className="text-green-400">{profile.skillsOffered.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skills Wanted:</span>
                    <span className="text-purple-400">{profile.skillsWanted.length}</span>
                  </div>
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Public Profile</h3>
                  <p className="text-gray-400 text-sm">Make your profile visible to others</p>
                </div>
                <motion.button
                  onClick={() => setProfile(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    profile.isPublic ? 'bg-teal-500' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: profile.isPublic ? 24 : 2 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Right Column - Skills and Availability */}
            <div className="xl:col-span-2 space-y-6">
              {/* Skills Offered */}
              <div>
                <label className="block text-gray-300 font-medium mb-3">
                  Skills Offered
                </label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                  {profile.skillsOffered.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkillOffered(skill)}
                        className="ml-2 text-purple-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                    placeholder="Add skill..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={addSkillOffered}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <label className="block text-gray-300 font-medium mb-3">
                  Skills Wanted
                </label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                  {profile.skillsWanted.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkillWanted(skill)}
                        className="ml-2 text-green-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                    placeholder="Add skill..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  />
                  <button
                    onClick={addSkillWanted}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-gray-300 font-medium mb-3">
                  Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availabilityOptions.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => toggleAvailability(option)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-3 rounded-lg border transition-all duration-300 text-center ${
                        profile.availability.includes(option)
                          ? 'bg-teal-500/20 border-teal-500/30 text-teal-400'
                          : 'bg-gray-800/30 border-gray-600 text-gray-400 hover:border-teal-500/30'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center"
                >
                  <RotateCcw className="mr-2" size={18} />
                  CANCEL
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-bold rounded-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 flex items-center justify-center"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Save className="mr-2" size={18} />
                  SAVE CHANGES
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;