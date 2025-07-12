import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Header from './components/Header';
import SwapRequestPage from './components/SwapRequestPage';
import UserProfilePage from './components/UserProfilePage';
import RequestsPage from './components/RequestsPage';
import ParticleBackground from './components/ParticleBackground';
import './index.css';

type AppPage = 'home' | 'requests' | 'dashboard' | 'swap-request' | 'profile';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [swapTargetUserId, setSwapTargetUserId] = useState<string | undefined>();

  const handleConnectUser = (userId: string) => {
    setSwapTargetUserId(userId);
    setCurrentPage('swap-request');
  };

  const handleSwapRequestSent = () => {
    setCurrentPage('home');
    setSwapTargetUserId(undefined);
    // Reset scroll position when returning to home
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const handleTabChange = (tab: 'home' | 'requests' | 'dashboard') => {
    if (tab === 'dashboard') {
      setCurrentPage('profile');
    } else {
      setCurrentPage(tab);
    }
    // Reset scroll position when changing tabs
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  if (!user?.isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <ParticleBackground />
      <div className="relative z-10">
        <Header 
          activeTab={currentPage === 'profile' ? 'dashboard' : currentPage}
          onTabChange={handleTabChange}
        />
        
        {currentPage === 'home' && (
          <HomePage onConnectUser={handleConnectUser} />
        )}
        
        {currentPage === 'requests' && (
          <RequestsPage />
        )}
        
        {currentPage === 'profile' && (
          <UserProfilePage />
        )}
        
        {currentPage === 'swap-request' && (
          <SwapRequestPage 
            targetUserId={swapTargetUserId} 
            onRequestSent={handleSwapRequestSent}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Crafted with <span className="text-teal-400">Team0162</span> • Powered by the future of skill exchange
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;