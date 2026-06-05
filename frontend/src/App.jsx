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

const API_URL = import.meta.env.VITE_API_URL;

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
        return user.role || 'customer';
      } catch (e) {
        return 'customer';
      }
    }
    return 'customer';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('beatsync_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [currentView, setCurrentView] = useState('landing');

  // 2. Overlay UI States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 3. Global Data States
  const [notifications, setNotifications] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Master tracks state array
  const [tracks, setTracks] = useState([]);

  // Dynamic genres state array
  const [genres, setGenres] = useState(['Hip-Hop', 'R&B', 'House', 'Pop', 'EDM', 'Ambient', 'Phonk']);

  // Fetch genres from the database
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tracks/genres`);
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }
      const data = await response.json();
      if (data && data.genres) {
        setGenres(data.genres.map(g => g.name));
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  // Fetch tracks from the database
  const fetchTracks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tracks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      const data = await response.json();
      const mappedTracks = data.tracks.map((track, index) => {
        let formattedPrice = track.price;
        if (formattedPrice !== undefined && formattedPrice !== null) {
          const priceVal = parseFloat(formattedPrice);
          formattedPrice = isNaN(priceVal) ? '$0.00' : `$${priceVal.toFixed(2)}`;
        } else {
          formattedPrice = '$0.00';
        }

        let fileUrl = track.file_url;
        // Map database seeded files or paths to the frontend imported local MP3s
        if (fileUrl) {
          if (fileUrl.includes('BeautyandaBeat') || track.title === 'Beauty and a Beat') {
            fileUrl = song1;
          } else if (fileUrl.includes('Clarity') || track.title === 'Clarity') {
            fileUrl = song2;
          } else if (fileUrl.includes('NotLikeUs') || track.title === 'Not Like Us') {
            fileUrl = song3;
          } else if (fileUrl.includes('matadonar') || track.title === 'Matadonar') {
            fileUrl = song4;
          } else if (fileUrl.startsWith('blob:')) {
            // Guard: If it's a blob URL, make sure it was generated in the current browser tab session
            if (!window.activeBlobUrls || !window.activeBlobUrls.has(fileUrl)) {
              fileUrl = song4; // fallback to working track
            }
          } else if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
            fileUrl = song4; // fallback to working track
          }
        } else {
          fileUrl = song4;
        }

        return {
          id: track.id,
          title: track.title,
          artist: track.artist,
          artist_id: track.artist_id,
          genre: track.genre,
          price: formattedPrice,
          file: fileUrl,
          cover: track.cover_url || [cover1, cover2, cover3, cover4][track.id % 4],
          duration: '3:00',
          rating: parseFloat(track.average_rating) || 0,
          reviewsCount: parseInt(track.review_count) || 0
        };
      });
      setTracks(mappedTracks);
    } catch (err) {
      console.error('Error fetching tracks:', err);
    }
  };

  // Fetch cart items from the database
  const fetchCart = async () => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/marketplace/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedCart = data.cart.map(item => {
          let formattedPrice = item.price;
          if (formattedPrice !== undefined && formattedPrice !== null) {
            const priceVal = parseFloat(formattedPrice);
            formattedPrice = isNaN(priceVal) ? '$0.00' : `$${priceVal.toFixed(2)}`;
          } else {
            formattedPrice = '$0.00';
          }
          return {
            id: item.id,
            title: item.title,
            artist: item.artist,
            artist_id: item.artist_id,
            genre: item.genre,
            price: formattedPrice,
            file: item.file_url,
            cover: item.cover_url || [cover1, cover2, cover3, cover4][item.id % 4]
          };
        });
        setCartItems(mappedCart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Fetch wishlist items from the database
  const fetchWishlist = async () => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/marketplace/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedWishlist = data.wishlist.map(item => {
          let formattedPrice = item.price;
          if (formattedPrice !== undefined && formattedPrice !== null) {
            const priceVal = parseFloat(formattedPrice);
            formattedPrice = isNaN(priceVal) ? '$0.00' : `$${priceVal.toFixed(2)}`;
          } else {
            formattedPrice = '$0.00';
          }
          return {
            id: item.id,
            title: item.title,
            artist: item.artist,
            artist_id: item.artist_id,
            genre: item.genre,
            price: formattedPrice,
            file: item.file_url,
            cover: item.cover_url || [cover1, cover2, cover3, cover4][item.id % 4]
          };
        });
        setWishlistItems(mappedWishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  // Fetch user's purchase history from the database
  const fetchPurchaseHistory = async () => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      setPurchaseHistory([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/tracks/purchased`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }
      const data = await response.json();
      const mappedPurchases = data.purchases.map(p => {
        let formattedPrice = p.amount;
        if (formattedPrice !== undefined && formattedPrice !== null) {
          const priceVal = parseFloat(formattedPrice);
          formattedPrice = isNaN(priceVal) ? '$0.00' : `$${priceVal.toFixed(2)}`;
        } else {
          formattedPrice = '$0.00';
        }
        return {
          id: p.order_id,
          title: p.title,
          price: formattedPrice,
          date: new Date(p.purchased_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        };
      });
      setPurchaseHistory(mappedPurchases);
    } catch (err) {
      console.error('Error fetching purchase history:', err);
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchGenres();
  }, []);

  useEffect(() => {
    const healSession = async () => {
      const token = localStorage.getItem('beatsync_token');
      if (!token) {
        console.warn('[Session Healing] Authenticated but token is missing. Force signing out.');
        handleSignOut();
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const profileData = await response.json();
          if (profileData && profileData.role) {
            console.log('[Session Healing] Loaded profile:', profileData);
            setUserRole(profileData.role);
            
            // Sync beatsync_user in localStorage
            const savedUserStr = localStorage.getItem('beatsync_user');
            let updatedUser = { ...profileData };
            if (savedUserStr) {
              try {
                updatedUser = { ...JSON.parse(savedUserStr), ...profileData };
              } catch (e) {}
            }
            localStorage.setItem('beatsync_user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
          }
        } else if (response.status === 401) {
          console.warn('[Session Healing] Token invalid/expired. Signing out.');
          handleSignOut();
        }
      } catch (err) {
        console.error('[Session Healing] Error fetching profile:', err);
      }
    };

    if (isAuthenticated) {
      healSession();
      fetchPurchaseHistory();
      fetchCart();
      fetchWishlist();
    } else {
      setPurchaseHistory([]);
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

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
      } else if (currentView === 'admin' && userRole?.toLowerCase() !== 'admin') {
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
      setUserRole(user.role || 'customer');
      setCurrentUser(user);
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
    setUserRole('customer');
    setCurrentUser(null);
    setCartItems([]);
    setCurrentView('landing');
    console.log('[Auth] User signed out.');
  };

  // Cart Add/Remove Logic
  const handleAddToCart = async (track) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to add to cart', 'error');
      setCurrentView('auth');
      return;
    }

    const exists = cartItems.some(item => item.id === track.id);
    if (exists) {
      addNotification(`"${track.title}" is already in the cart`, 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/marketplace/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ track_id: track.id })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      await fetchCart();
      addNotification(`Added "${track.title}" to cart`, 'success');
      setIsCartOpen(true); // Auto-open cart for immediate feedback
    } catch (err) {
      console.error('Add to cart error:', err);
      addNotification(err.message || 'Error adding to cart', 'error');
    }
  };

  const handleRemoveFromCart = async (trackId) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/marketplace/cart/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove from cart');
      }

      await fetchCart();
      addNotification('Item removed from cart', 'success');
    } catch (err) {
      console.error('Remove from cart error:', err);
      addNotification('Error removing item from cart', 'error');
    }
  };

  // Wishlist Add/Remove Logic
  const handleAddToWishlist = async (track) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to save items to your wishlist', 'error');
      setCurrentView('auth');
      return;
    }

    const exists = wishlistItems.some(item => item.id === track.id);
    if (exists) {
      addNotification(`"${track.title}" is already in your wishlist`, 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/marketplace/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ track_id: track.id })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      await fetchWishlist();
      addNotification(`Saved "${track.title}" to wishlist`, 'success');
    } catch (err) {
      console.error('Add to wishlist error:', err);
      addNotification(err.message || 'Error adding to wishlist', 'error');
    }
  };

  const handleRemoveFromWishlist = async (trackId) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/marketplace/wishlist/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove from wishlist');
      }

      await fetchWishlist();
      addNotification('Removed from wishlist', 'success');
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      addNotification('Error removing item from wishlist', 'error');
    }
  };

  // Payment Confirmation Logic
  const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return parseFloat(priceStr.replace('$', '')) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);

  const handleConfirmCheckout = async () => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to complete checkout', 'error');
      setCurrentView('auth');
      setIsPaymentModalOpen(false);
      return;
    }

    try {
      const promises = cartItems.map(item =>
        fetch(`${API_URL}/api/marketplace/checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ track_id: item.id })
        }).then(async res => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || `Failed to purchase "${item.title}"`);
          }
          return { item, data };
        })
      );

      await Promise.all(promises);
      await fetchPurchaseHistory();
      await fetchCart();

      setIsPaymentModalOpen(false);
      setIsCartOpen(false); // Close cart on checkout completion
      addNotification('Checkout completed successfully!', 'success');
    } catch (err) {
      console.error('Checkout error:', err);
      addNotification(err.message || 'Error occurred during checkout', 'error');
    }
  };

  const handleAddGenre = async (genreName) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to add genres.', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/tracks/genres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: genreName })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add genre');
      }
      addNotification(`Genre "${genreName}" added successfully`, 'success');
      await fetchGenres();
    } catch (err) {
      console.error('Error adding genre:', err);
      addNotification(err.message || 'Error adding genre', 'error');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#06060A] font-sans antialiased text-[#FFFFFF] flex flex-col overflow-hidden relative">
      {/* Decorative ambient glowing backdrops to add life */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#6366F1]/5 blur-[120px] pointer-events-none animate-pulse-glow z-0"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none animate-pulse-glow z-0" style={{ animationDelay: '-4s' }}></div>

      {/* Global immersive navigation bar */}
      <Navbar 
        currentView={currentView}
        setView={setCurrentView}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        isCartOpen={isCartOpen}
        setIsCartOpen={(val) => {
          setIsCartOpen(val);
          if (val) setIsWishlistOpen(false);
        }}
        cartCount={cartItems.length}
        isWishlistOpen={isWishlistOpen}
        setIsWishlistOpen={(val) => {
          setIsWishlistOpen(val);
          if (val) setIsCartOpen(false);
        }}
        wishlistCount={wishlistItems.length}
        userRole={userRole}
        setUserRole={setUserRole}
        currentUser={currentUser}
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
            onAddToCart={async (track) => {
              await handleAddToCart(track);
              setIsWishlistOpen(false);
            }}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCheckout={() => setIsPaymentModalOpen(true)}
            isCartOpen={isCartOpen}
            setIsCartOpen={(val) => {
              setIsCartOpen(val);
              if (val) setIsWishlistOpen(false);
            }}
            isWishlistOpen={isWishlistOpen}
            setIsWishlistOpen={(val) => {
              setIsWishlistOpen(val);
              if (val) setIsCartOpen(false);
            }}
            tracks={tracks}
            isAuthenticated={isAuthenticated}
            addNotification={addNotification}
            wishlistItems={wishlistItems}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            genres={genres}
          />
        )}

        {currentView === 'profile' && (
          <div className="h-full overflow-y-auto">
            <ProfileView 
              userTracks={tracks.filter(t => t.artist_id === (currentUser ? currentUser.id : ''))}
              fetchTracks={fetchTracks}
              purchaseHistory={purchaseHistory}
              addNotification={addNotification}
              currentUser={currentUser}
              wishlistItems={wishlistItems}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
              genres={genres}
            />
          </div>
        )}

        {currentView === 'admin' && userRole?.toLowerCase() === 'admin' && (
          <AdminView 
            tracks={tracks}
            fetchTracks={fetchTracks}
            addNotification={addNotification}
            onDeleteLocalCart={(trackId) => {
              setCartItems((prev) => prev.filter(item => item.id !== trackId));
            }}
            genres={genres}
            onAddGenre={handleAddGenre}
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
