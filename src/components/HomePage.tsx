import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Users, Filter } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import UserCard from './UserCard';
import LoginModal from './LoginModal';

interface HomePageProps {
  onConnectUser: (userId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onConnectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const { user } = useAuth();

  const availabilityOptions = [
    { value: 'all', label: 'All Times' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'evenings', label: 'Evenings' }
  ];

  useEffect(() => {
    let filtered = mockUsers.filter(u => u.isPublic && u.id !== user?.id);

    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(u => u.availability.includes(availabilityFilter));
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, availabilityFilter, user]);

  const handleConnectUser = (userId: string) => {
    if (!user?.isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    onConnectUser(userId);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, monospace' }}>
            DISCOVER TALENT
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            Connect with skilled professionals and exchange knowledge
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Users className="mr-2" size={16} />
              <span>{filteredUsers.length} Active Users</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>Real-time Matching</span>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          {/* Search and Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills, users..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-300 backdrop-blur-sm"
                style={{ boxShadow: '0 0 20px rgba(0, 229, 255, 0.1)' }}
              />
            </div>

            {/* Availability Filter */}
            <div className="relative md:w-64">
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <Filter size={16} />
                  <span className="text-sm">{availabilityOptions.find(opt => opt.value === availabilityFilter)?.label}</span>
                </div>
                <ChevronDown className={`transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} size={16} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-600 rounded-lg overflow-hidden z-10 backdrop-blur-sm"
                  >
                    {availabilityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAvailabilityFilter(option.value);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-purple-500/20 transition-colors duration-200 text-sm"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="px-4 py-3 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 text-sm whitespace-nowrap">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
            </div>
          </div>
        </motion.div>

        {/* User Cards Grid */}
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4, duration: 0.6 }}
  className="flex flex-col gap-10 mb-8"
>

       <AnimatePresence mode="wait">
    {currentUsers.map((user, index) => (
      <motion.div
        key={`${user.id}-${currentPage}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.1 * index, duration: 0.6 }}
      >
        <UserCard
          user={user}
          onConnect={handleConnectUser}
          canConnect={true}
        />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>


        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center space-x-2"
          >
            <motion.button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-900/50 text-white hover:bg-teal-500/20 border border-gray-600 hover:border-teal-500/30'
              }`}
            >
              <ChevronLeft size={20} />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <motion.button
                key={number}
                onClick={() => paginate(number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === number
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-black font-bold'
                    : 'bg-gray-900/50 text-white hover:bg-teal-500/20 border border-gray-600 hover:border-teal-500/30'
                }`}
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {number}
              </motion.button>
            ))}

            <motion.button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-900/50 text-white hover:bg-teal-500/20 border border-gray-600 hover:border-teal-500/30'
              }`}
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-lg mb-4">No users found matching your criteria</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
          </motion.div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default HomePage;