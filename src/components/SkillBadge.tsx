import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  type: 'offered' | 'wanted';
  removable?: boolean;
  onRemove?: (skill: string) => void;
  size?: 'sm' | 'md';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  skill, 
  type, 
  removable = false, 
  onRemove,
  size = 'md'
}) => {
  const typeColors = {
    offered: 'bg-green-500/20 border-green-500/30 text-green-400',
    wanted: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm'
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center border rounded-lg font-medium transition-all duration-200 ${typeColors[type]} ${sizeClasses[size]}`}
    >
      {skill}
      {removable && onRemove && (
        <motion.button
          onClick={() => onRemove(skill)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="ml-2 hover:text-red-400 transition-colors duration-200"
        >
          <X size={size === 'sm' ? 12 : 14} />
        </motion.button>
      )}
    </motion.span>
  );
};

export default SkillBadge;