import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import MainView from './components/MainView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import PaymentModal from './components/PaymentModal';
import ToastContainer from './components/ToastContainer';

// Import actual MP3 song assets
import song1 from './assets/BeautyandaBeat.mp3';
import song2 from './assets/Clarity.mp3';
import song3 from './assets/NotLikeUs.mp3';
import song4 from './assets/matadonar.mp3';

// Import actual cover art image assets
import cover1 from './assets/track_cover_1.png';
import cover2 from './assets/track_cover_2.png';
import cover3 from './assets/track_cover_3.png';
import cover4 from './assets/track_cover_4.png';

export default function App() {
  // 1. Global Auth & Role States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('beatsync_auth') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('beatsync_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.role || 'viewer';
      } catch (e) {
        return 'viewer';
      }
    }
    return 'viewer';
  });
  const [currentView, setCurrentView] = useState('landing');

  // 2. Overlay UI States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 3. Global Data States
  const [notifications, setNotifications] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Master tracks state array
  const [tracks, setTracks] = useState([
    { id: 1, title: 'Beauty and a Beat', artist: 'ZeD', genre: 'Pop', price: '$4.99', duration: '3:48', file: song1, cover: cover1 },
    { id: 2, title: 'Clarity', artist: 'Pulse', genre: 'EDM', price: '$9.99', duration: '4:31', file: song2, cover: cover2 },
    { id: 3, title: 'Not Like Us', artist: 'Kendrick', genre: 'Hip-Hop', price: '$4.99', duration: '4:30', file: song3, cover: cover3 },
    { id: 4, title: 'Matadonar', artist: 'Pulse', genre: 'House', price: '$14.99', duration: '0:24', file: song4, cover: cover4 }
  ]);

  // Master reviews state indexed by track ID
  const [reviewsByTrackId, setReviewsByTrackId] = useState({
    1: [
      { id: 'r1', username: 'sound_wave', rating: 5, comment: 'Incredible master mix. Perfect for pop crossovers.', date: 'May 28, 2026' },
      { id: 'r2', username: 'beat_maker', rating: 4, comment: 'Nice vocal chop slicing. Solid low-end.', date: 'May 30, 2026' }
    ],
    2: [
      { id: 'r3', username: 'club_junkie', rating: 5, comment: 'EDM anthem of the summer! Banger chord progress.', date: 'May 29, 2026' }
    ],
    3: [
      { id: 'r4', username: 'lyricist_flow', rating: 5, comment: 'The sample flip is genius.', date: 'Jun 01, 2026' }
    ]
  });

  // Toast Notification triggers
  const addNotification = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Bidirectional Authentication & Authorization Redirect Logic:
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'landing' || currentView === 'auth') {
        setCurrentView('main');
        console.log('[Auth Redirect] User is authenticated. Redirecting to main catalog view.');
      } else if (currentView === 'admin' && userRole !== 'admin') {
        setCurrentView('main');
        console.log('[Role Redirect] Non-admin tried to access admin page. Redirecting to main.');
      }
    } else {
      if (currentView === 'main' || currentView === 'profile' || currentView === 'admin') {
        setCurrentView('landing');
        console.log('[Auth Redirect] User is unauthenticated. Redirecting to landing page.');
      }
    }
  }, [isAuthenticated, currentView, userRole]);

  // Auth Success Handler
  const handleAuthSuccess = (user, token) => {
    setIsAuthenticated(true);
    localStorage.setItem('beatsync_auth', 'true');
    if (user) {
      localStorage.setItem('beatsync_user', JSON.stringify(user));
      setUserRole(user.role || 'viewer');
    }
    if (token) {
      localStorage.setItem('beatsync_token', token);
    }
    addNotification('Logged in successfully', 'success');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('beatsync_auth');
    localStorage.removeItem('beatsync_user');
    localStorage.removeItem('beatsync_token');
    setUserRole('viewer');
    setCartItems([]);
    setCurrentView('landing');
    console.log('[Auth] User signed out.');
  };

  // Cart Add/Remove Logic
  const handleAddToCart = (track) => {
    const exists = cartItems.some(item => item.id === track.id);
    if (!exists) {
      setCartItems((prev) => [...prev, track]);
      addNotification(`Added "${track.title}" to cart`, 'success');
      setIsCartOpen(true); // Auto-open cart for immediate feedback
    } else {
      addNotification(`"${track.title}" is already in the cart`, 'error');
    }
  };

  const handleRemoveFromCart = (trackId) => {
    setCartItems((prev) => prev.filter(item => item.id !== trackId));
    addNotification('Item removed from cart', 'success');
  };

  // Payment Confirmation Logic
  const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return parseFloat(priceStr.replace('$', '')) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);

  const handleConfirmCheckout = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    const newPurchases = cartItems.map(item => ({
      id: Date.now() + Math.random(),
      title: item.title,
      price: item.price,
      date: dateStr
    }));

    setPurchaseHistory((prev) => [...prev, ...newPurchases]);
    setCartItems([]);
    setIsPaymentModalOpen(false);
    setIsCartOpen(false); // Close cart on checkout completion
    addNotification('Checkout completed successfully!', 'success');
  };

  // Add review callback
  const handleAddReview = (trackId, rating, comment) => {
    const newReview = {
      id: 'r' + Date.now() + Math.random().toString(36).substring(2, 5),
      username: 'producer_one',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    setReviewsByTrackId((prev) => ({
      ...prev,
      [trackId]: [...(prev[trackId] || []), newReview]
    }));
    addNotification('Review submitted successfully', 'success');
  };

  return (
    <div className="h-screen w-screen bg-[#06060A] font-sans antialiased text-[#FFFFFF] flex flex-col overflow-hidden relative">
      {/* Global immersive navigation bar */}
      <Navbar 
        currentView={currentView}
        setView={setCurrentView}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartCount={cartItems.length}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Conditionally rendered sub-views with fadeIn animations inside fixed viewports */}
      <div className="flex-grow relative h-[calc(100vh-4rem)] mt-16">
        {currentView === 'landing' && (
          <div className="h-full overflow-y-auto pb-12">
            <LandingView setView={setCurrentView} />
          </div>
        )}
        
        {currentView === 'auth' && (
          <div className="h-full overflow-y-auto flex items-center justify-center">
            <AuthView onAuthSuccess={handleAuthSuccess} />
          </div>
        )}
        
        {currentView === 'main' && (
          <MainView 
            setView={setCurrentView}
            onSignOut={handleSignOut}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCheckout={() => setIsPaymentModalOpen(true)}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            tracks={tracks}
            reviewsByTrackId={reviewsByTrackId}
            onAddReview={handleAddReview}
          />
        )}

        {currentView === 'profile' && (
          <div className="h-full overflow-y-auto">
            <ProfileView 
              userTracks={tracks.filter(t => t.artist === 'producer_one')}
              addUserTrack={(newTrack) => {
                setTracks((prev) => [...prev, newTrack]);
              }}
              purchaseHistory={purchaseHistory}
              addNotification={addNotification}
            />
          </div>
        )}

        {currentView === 'admin' && userRole === 'admin' && (
          <AdminView 
            tracks={tracks}
            onAddTrack={(newTrack) => {
              setTracks((prev) => [...prev, newTrack]);
              addNotification(`Track "${newTrack.title}" successfully created`, 'success');
            }}
            onUpdateTrack={(updatedTrack) => {
              setTracks((prev) => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
              addNotification('Track updated successfully', 'success');
            }}
            onDeleteTrack={(trackId) => {
              setTracks((prev) => prev.filter(t => t.id !== trackId));
              // Also remove deleted track from cart if present
              setCartItems((prev) => prev.filter(item => item.id !== trackId));
              addNotification('Track deleted successfully', 'destructive');
            }}
          />
        )}
      </div>

      {/* Global Checkout Overlay Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        subtotal={subtotal}
        onConfirm={handleConfirmCheckout}
      />

      {/* Global Viewport-Side Toast Notifications */}
      <ToastContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  );
}
