import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onConnect: (userId: string) => void;
  canConnect: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConnect, canConnect }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-teal-500/30 transition-all duration-300" 
    >
      {/* Left: Profile Image */}
      <div className="flex-shrink-0">
        <img
          src={user.profileImage || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400`}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
        />
      </div>

      {/* Center: User Details */}
      <div className="flex-1 px-4">
        <h3 className="text-base font-semibold text-white">{user.username}</h3>
        <p className="text-sm text-gray-400 mt-1">
          <span className="text-sm font-semibold text-green-400">
    Skills Offered:
  </span>   {user.skillsOffered.slice(0, 3).join(', ')}
        </p>
        <p className="text-sm text-gray-400">
          <span className="text-sm font-semibold text-blue-400">Skills Wanted: </span>
          {user.skillsWanted.slice(0, 3).join(', ')}
        </p>
      </div>

      {/* Right: Buttons and Rating */}
      <div className="flex flex-col items-end gap-2">
       
        <button
          onClick={() => onConnect(user.id)}
          className={`text-sm font-medium px-3 py-1 rounded-md ${
            canConnect
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          Request
        </button>
        <div className="flex items-center text-sm text-gray-400 mt-1">
          <div className="flex">{renderStars(user.rating)}</div>
          <span className="ml-1">{user.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
