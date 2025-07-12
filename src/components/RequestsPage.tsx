import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Star, Send, Inbox } from 'lucide-react';
import { mockRequests, mockUsers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const incomingRequests = requests.filter(req => req.toUserId === user?.id);
  const outgoingRequests = requests.filter(req => req.fromUserId === user?.id);

  const handleAccept = (requestId: string) => {
    console.log('Accepting request:', requestId);
    
    // Remove the request from the list permanently
    setRequests(prev => prev.filter(req => req.id !== requestId));
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg z-50 backdrop-blur-sm';
    successDiv.style.fontFamily = 'Orbitron, monospace';
    successDiv.textContent = 'REQUEST ACCEPTED!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  };

  const handleDecline = (requestId: string) => {
    console.log('Declining request:', requestId);
    
    // Remove the request from the list permanently
    setRequests(prev => prev.filter(req => req.id !== requestId));
    
    // Show decline message
    const declineDiv = document.createElement('div');
    declineDiv.className = 'fixed top-4 right-4 bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg z-50 backdrop-blur-sm';
    declineDiv.style.fontFamily = 'Orbitron, monospace';
    declineDiv.textContent = 'REQUEST DECLINED';
    document.body.appendChild(declineDiv);
    
    setTimeout(() => {
      document.body.removeChild(declineDiv);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'declined': return 'text-red-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <Check size={16} />;
      case 'declined': return <X size={16} />;
      case 'completed': return <Star size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const renderRequestCard = (request: any, isIncoming: boolean) => {
    const otherUserId = isIncoming ? request.fromUserId : request.toUserId;
    const otherUser = mockUsers.find(u => u.id === otherUserId);

    return (
      <motion.div
        key={request.id}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-teal-500/30 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-400 p-1">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {otherUser?.profileImage ? (
                  <img
                    src={otherUser.profileImage}
                    alt={otherUser.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-600 to-gray-700" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isIncoming ? 'From' : 'To'}: @{otherUser?.username}
              </h3>
              <div className={`flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="text-sm font-medium capitalize">
                  {request.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-sm">
              {request.createdAt.toLocaleDateString()}
            </span>
            {otherUser && (
              <div className="flex items-center space-x-1 mt-1">
                <Star className="text-yellow-400 fill-current" size={14} />
                <span className="text-gray-300 text-sm">{otherUser.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="text-purple-400 text-sm font-medium mb-1">
              {isIncoming ? 'They Offer' : 'You Offer'}
            </div>
            <div className="text-white font-medium">{request.skillOffered}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="text-green-400 text-sm font-medium mb-1">
              {isIncoming ? 'You Provide' : 'They Provide'}
            </div>
            <div className="text-white font-medium">{request.skillRequested}</div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
          <div className="text-gray-400 text-sm mb-2">Message:</div>
          <div className="text-gray-300">{request.message}</div>
        </div>

        {/* Actions */}
        {isIncoming && request.status === 'pending' && (
          <div className="flex space-x-3">
            <motion.button
              onClick={() => handleAccept(request.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-bold rounded-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 flex items-center justify-center"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <Check className="mr-2" size={18} />
              ACCEPT
            </motion.button>
            <motion.button
              onClick={() => handleDecline(request.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <X className="mr-2" size={18} />
              DECLINE
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            SWAP TIMELINE
          </h1>
          <p className="text-gray-400">Track your skill exchange journey</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === 'incoming'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <Inbox className="mr-2" size={18} />
              INCOMING ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === 'outgoing'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <Send className="mr-2" size={18} />
              OUTGOING ({outgoingRequests.length})
            </button>
          </div>
        </motion.div>

        {/* Request Lists */}
        <div className="space-y-6">
          {activeTab === 'incoming' && (
            <>
              {incomingRequests.length > 0 ? (
                incomingRequests.map((request) => renderRequestCard(request, true))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Inbox className="mx-auto mb-4 text-gray-400" size={48} />
                  <div className="text-gray-400 text-lg mb-2">No incoming requests</div>
                  <div className="text-gray-500 text-sm">When others send you swap requests, they'll appear here</div>
                </motion.div>
              )}
            </>
          )}

          {activeTab === 'outgoing' && (
            <>
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map((request) => renderRequestCard(request, false))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Send className="mx-auto mb-4 text-gray-400" size={48} />
                  <div className="text-gray-400 text-lg mb-2">No outgoing requests</div>
                  <div className="text-gray-500 text-sm">Start connecting with other users to send swap requests</div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;