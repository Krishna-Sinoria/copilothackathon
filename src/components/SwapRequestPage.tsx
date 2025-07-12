import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ChevronDown, X, Plus } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface SwapRequestPageProps {
  targetUserId?: string;
  onRequestSent?: () => void;
}

const SwapRequestPage: React.FC<SwapRequestPageProps> = ({ targetUserId, onRequestSent }) => {
  const { user } = useAuth();
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsRequested, setSkillsRequested] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showOfferedDropdown, setShowOfferedDropdown] = useState(false);
  const [showRequestedDropdown, setShowRequestedDropdown] = useState(false);

  const targetUser = targetUserId ? mockUsers.find(u => u.id === targetUserId) : null;
  const currentUser = mockUsers.find(u => u.id === user?.id);

  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 'Figma',
    'Adobe Creative Suite', 'Data Analysis', 'Machine Learning', 'Swift',
    'Kotlin', 'Flutter', 'Solidity', 'Web3', 'DevOps', 'AWS'
  ];

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (skillsOffered.length === 0 || skillsRequested.length === 0) {
      alert('Please select at least one skill to offer and one skill to request.');
      return;
    }

    // In real app, this would send the request to the backend
    console.log('Sending swap request:', { 
      skillsOffered, 
      skillsRequested, 
      message, 
      targetUserId 
    });
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg z-50 backdrop-blur-sm';
    successDiv.style.fontFamily = 'Orbitron, monospace';
    successDiv.textContent = 'SWAP REQUEST SENT SUCCESSFULLY!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      document.body.removeChild(successDiv);
      // Redirect to home page and reset scroll
      if (onRequestSent) {
        onRequestSent();
        setTimeout(() => window.scrollTo(0, 0), 100);
      }
    }, 2000);
    
    setSkillsOffered([]);
    setSkillsRequested([]);
    setMessage('');
  };

  const addSkillOffered = (skill: string) => {
    if (!skillsOffered.includes(skill)) {
      setSkillsOffered([...skillsOffered, skill]);
    }
    setShowOfferedDropdown(false);
  };

  const addSkillRequested = (skill: string) => {
    if (!skillsRequested.includes(skill)) {
      setSkillsRequested([...skillsRequested, skill]);
    }
    setShowRequestedDropdown(false);
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillRequested = (skill: string) => {
    setSkillsRequested(skillsRequested.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-teal-500/30 rounded-2xl p-6 sm:p-8"
          style={{ boxShadow: '0 0 50px rgba(0, 229, 255, 0.1)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              INITIATE SWAP
            </motion.h1>
            {targetUser && (
              <p className="text-gray-400 text-sm sm:text-base">
                Requesting skill exchange with <span className="text-teal-400">{targetUser.username}</span>
              </p>
            )}
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Skills Offered */}
            <div className="relative">
              <label className="block text-gray-300 font-medium mb-3">
                Skills You're Offering
              </label>
              
              {/* Selected Skills */}
              {skillsOffered.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {skillsOffered.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillOffered(skill)}
                        className="ml-2 text-purple-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOfferedDropdown(!showOfferedDropdown)}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white text-left focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 flex items-center justify-between"
                >
                  <span className="text-gray-400 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add skills to offer
                  </span>
                  <ChevronDown className={`transform transition-transform duration-200 ${showOfferedDropdown ? 'rotate-180' : ''}`} size={16} />
                </button>

                {showOfferedDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-purple-500/30 rounded-lg max-h-48 overflow-y-auto z-10"
                  >
                    {(currentUser?.skillsOffered || commonSkills).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkillOffered(skill)}
                        disabled={skillsOffered.includes(skill)}
                        className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                          skillsOffered.includes(skill)
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-white hover:bg-purple-500/20'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Skills Requested */}
            <div className="relative">
              <label className="block text-gray-300 font-medium mb-3">
                Skills You're Requesting
              </label>
              
              {/* Selected Skills */}
              {skillsRequested.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {skillsRequested.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillRequested(skill)}
                        className="ml-2 text-green-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRequestedDropdown(!showRequestedDropdown)}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-green-500/30 rounded-lg text-white text-left focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 flex items-center justify-between"
                >
                  <span className="text-gray-400 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add skills to request
                  </span>
                  <ChevronDown className={`transform transition-transform duration-200 ${showRequestedDropdown ? 'rotate-180' : ''}`} size={16} />
                </button>

                {showRequestedDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto z-10"
                  >
                    {(targetUser ? targetUser.skillsOffered : commonSkills).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkillRequested(skill)}
                        disabled={skillsRequested.includes(skill)}
                        className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                          skillsRequested.includes(skill)
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-white hover:bg-green-500/20'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Holographic Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Craft your swap proposal message..."
                rows={6}
                className="w-full px-4 py-4 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                style={{ 
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
                  background: 'linear-gradient(45deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))'
                }}
              />
            </div>

            {/* Send Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={skillsOffered.length === 0 || skillsRequested.length === 0 || !message}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-bold rounded-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
                fontFamily: 'Orbitron, monospace',
                animation: 'pulse 2s infinite'
              }}
            >
              <Send className="mr-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
              SEND REQUEST
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default SwapRequestPage;