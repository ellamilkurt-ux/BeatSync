import React, { useState, useEffect } from 'react';

export default function ProfileView({ 
  userTracks, 
  fetchTracks, 
  purchaseHistory, 
  addNotification, 
  currentUser, 
  wishlistItems = [], 
  onRemoveFromWishlist, 
  onAddToCart,
  genres = ['Hip-Hop', 'R&B', 'House', 'Pop', 'EDM', 'Ambient', 'Phonk']
}) {
  // Account settings states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Sales analytics states
  const [salesData, setSalesData] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  const fetchSalesData = async () => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) return;
    setLoadingSales(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tracks/sales`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSalesData(data.sales || []);
      } else {
        console.error('Failed to fetch sales data');
      }
    } catch (err) {
      console.error('Error fetching sales data:', err);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    const role = currentUser?.role?.toLowerCase();
    if (role === 'customer' || role === 'admin') {
      fetchSalesData();
    }
    if (currentUser && !trackArtist) {
      setTrackArtist(currentUser.username);
    }
  }, [currentUser]);

  // Creator upload states
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState(currentUser ? currentUser.username : '');
  const [trackPrice, setTrackPrice] = useState('');
  const [trackGenre, setTrackGenre] = useState('Hip-Hop');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [trackDuration, setTrackDuration] = useState('3:15');
  const [portfolioTab, setPortfolioTab] = useState('uploads');

  useEffect(() => {
    if (genres.length > 0 && !genres.includes(trackGenre)) {
      setTrackGenre(genres[0]);
    }
  }, [genres]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addNotification('Please upload a valid image file (.png, .jpg)', 'error');
      return;
    }
    setSelectedCoverFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      addNotification('Please upload a valid audio file (.mp3)', 'error');
      return;
    }

    setSelectedFile(file);

    // Calculate audio duration dynamically
    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setTrackDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addNotification('All password fields are required.', 'error');
      return;
    }
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to update your password.', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      addNotification('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      addNotification(err.message || 'Error updating password', 'error');
    }
  };

  const handleTrackUpload = async (e) => {
    e.preventDefault();
    if (!trackTitle || !trackPrice || !selectedFile) {
      addNotification('Please fill in all track fields and upload an MP3 file.', 'error');
      return;
    }

    const priceVal = parseFloat(trackPrice.replace('$', ''));
    if (isNaN(priceVal) || priceVal < 0) {
      addNotification('Please enter a valid price.', 'error');
      return;
    }

    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to upload tracks.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', trackTitle);
      formData.append('artist', trackArtist);
      formData.append('genre', trackGenre);
      formData.append('price', priceVal);
      formData.append('track_file', selectedFile);
      if (selectedCoverFile) {
        formData.append('cover_file', selectedCoverFile);
      }

      const response = await fetch(`http://localhost:5000/api/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload track');
      }

      await fetchTracks();
      addNotification(`Track "${trackTitle}" successfully uploaded`, 'success');
      
      // Clear fields
      setTrackTitle('');
      setTrackArtist(currentUser ? currentUser.username : '');
      setTrackPrice('');
      setTrackGenre('Hip-Hop');
      setSelectedFile(null);
      setSelectedCoverFile(null);
      setTrackDuration('3:15');
    } catch (err) {
      console.error('Track upload error:', err);
      addNotification(err.message || 'Error uploading track', 'error');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 md:px-8 py-8 flex flex-col gap-6 animate-fade-in bg-[#06060A] text-[#FFFFFF] relative z-10 select-none">
      
      {/* Profile Header Banner */}
      <div className="relative bg-gradient-to-r from-[#111118] via-[#191924]/60 to-[#111118] p-6 rounded-2xl border border-zinc-800/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
        {/* Glow backdrop behind header */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#6366F1]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366F1] to-purple-500 flex items-center justify-center text-xl font-black text-[#FFFFFF] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            {(currentUser?.username || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl font-black tracking-tight text-[#FFFFFF] truncate">
              {currentUser?.username || 'Studio Creator'}
            </h1>
            <p className="text-xs text-[#8F9CAE] mt-0.5 truncate">{currentUser?.email || 'creator@beatsync.com'}</p>
            <span className="inline-flex self-start mt-2 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold text-[#6366F1] bg-[#6366F1]/10 rounded-full border border-[#6366F1]/20">
              {currentUser?.role || 'Customer'}
            </span>
          </div>
        </div>

        {/* Quick Stats count block */}
        <div className="flex items-center gap-6 z-10 bg-[#06060A]/40 border border-zinc-800/20 px-5 py-3.5 rounded-xl">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-[#FFFFFF]">{userTracks.length}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#8F9CAE]">Uploads</span>
          </div>
          <div className="w-px h-8 bg-zinc-800/40"></div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-[#FFFFFF]">{purchaseHistory.length}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#8F9CAE]">Purchases</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Account Settings Card */}
        <div className="lg:col-span-1 bg-[#111118] p-5 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl h-fit">
          <div>
            <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-5">Account Settings</h2>
            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full bg-[#6366F1] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 px-5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer text-center"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Uploader & Tabbed Portfolio List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Release Beats Form */}
          <div className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/40 flex flex-col shadow-2xl">
            <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-5">Release New Beat</h2>
            <form onSubmit={handleTrackUpload} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Track Title
                  </label>
                  <input
                    type="text"
                    required
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="Midnight Rain"
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={trackArtist}
                    onChange={(e) => setTrackArtist(e.target.value)}
                    placeholder={currentUser ? currentUser.username : 'producer_one'}
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Price (USD)
                  </label>
                  <input
                    type="text"
                    required
                    value={trackPrice}
                    onChange={(e) => setTrackPrice(e.target.value)}
                    placeholder="9.99"
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Genre
                  </label>
                  <select
                    value={trackGenre}
                    onChange={(e) => setTrackGenre(e.target.value)}
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all cursor-pointer"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audio File Input (MP3 Required) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                  Audio File (MP3 Required)
                </label>
                <div className="relative flex items-center justify-between bg-[#191924] rounded-lg border border-zinc-800/60 p-3 hover:border-zinc-700 transition-all overflow-hidden group">
                  <input
                    type="file"
                    required
                    accept="audio/mp3,audio/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current text-[#6366F1] transition-transform duration-300 group-hover:scale-110">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    <span className="text-xs text-[#8F9CAE] truncate max-w-[220px]">
                      {selectedFile ? selectedFile.name : 'Select MP3 audio file...'}
                    </span>
                  </div>
                  {selectedFile && (
                    <span className="text-[9px] uppercase font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/20 z-20">
                      Loaded ({trackDuration})
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Image File Input (PNG/JPG Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                  Cover Image (Optional)
                </label>
                <div className="relative flex items-center justify-between bg-[#191924] rounded-lg border border-zinc-800/60 p-3 hover:border-zinc-700 transition-all overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current text-[#6366F1] transition-transform duration-300 group-hover:scale-110">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.07 2.66-1.48-1.78L7 16h10l-3.44-5.19z" />
                    </svg>
                    <span className="text-xs text-[#8F9CAE] truncate max-w-[220px]">
                      {selectedCoverFile ? selectedCoverFile.name : 'Select cover image file...'}
                    </span>
                  </div>
                  {selectedCoverFile && (
                    <span className="text-[9px] uppercase font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/20 z-20">
                      Loaded
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#6366F1] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 px-5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer self-start"
              >
                Release Track
              </button>
            </form>
          </div>

          {/* Dynamic Tracks Portfolio Card */}
          <div className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/40 flex flex-col shadow-2xl">
            {/* Tab Headers */}
            <div className="flex items-center gap-6 mb-5 border-b border-zinc-800/20 pb-3 flex-shrink-0">
              <button 
                onClick={() => setPortfolioTab('uploads')}
                className={`text-[10px] font-extrabold uppercase tracking-widest pb-1 transition-all cursor-pointer border-b-2 ${
                  portfolioTab === 'uploads' 
                    ? 'text-[#FFFFFF] border-[#6366F1]' 
                    : 'text-[#8F9CAE] border-transparent hover:text-[#FFFFFF]'
                }`}
              >
                Creator Portfolio ({userTracks.length})
              </button>
              <button 
                onClick={() => setPortfolioTab('purchases')}
                className={`text-[10px] font-extrabold uppercase tracking-widest pb-1 transition-all cursor-pointer border-b-2 ${
                  portfolioTab === 'purchases' 
                    ? 'text-[#FFFFFF] border-[#6366F1]' 
                    : 'text-[#8F9CAE] border-transparent hover:text-[#FFFFFF]'
                }`}
              >
                Collected Beats ({purchaseHistory.length})
              </button>
              <button 
                onClick={() => setPortfolioTab('wishlist')}
                className={`text-[10px] font-extrabold uppercase tracking-widest pb-1 transition-all cursor-pointer border-b-2 ${
                  portfolioTab === 'wishlist' 
                    ? 'text-[#FFFFFF] border-[#6366F1]' 
                    : 'text-[#8F9CAE] border-transparent hover:text-[#FFFFFF]'
                }`}
              >
                Saved Wishlist ({wishlistItems.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
              {portfolioTab === 'uploads' ? (
                userTracks.length > 0 ? (
                  userTracks.map((track) => (
                    <div key={track.id} className="bg-[#191924]/60 p-3 rounded-xl border border-zinc-800/20 flex justify-between items-center">
                      <div className="flex flex-col min-w-0 font-sans">
                        <span className="text-xs font-bold text-[#FFFFFF] truncate">{track.title}</span>
                        <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">{track.artist}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] uppercase font-bold text-[#8F9CAE] bg-[#06060A]/60 px-2.5 py-0.5 rounded-md border border-zinc-800/40">
                          {track.genre}
                        </span>
                        <span className="text-xs font-extrabold text-[#6366F1]">{track.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-[#8F9CAE]/60 italic">
                    No tracks uploaded yet.
                  </div>
                )
              ) : portfolioTab === 'purchases' ? (
                purchaseHistory.length > 0 ? (
                  purchaseHistory.map((item) => (
                    <div key={item.id} className="bg-[#191924]/60 p-3 rounded-xl border border-zinc-800/20 flex justify-between items-center">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#FFFFFF] truncate">{item.title}</span>
                        <span className="text-[9px] text-[#8F9CAE] truncate mt-0.5">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#8F9CAE]">{item.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-[#8F9CAE]/60 italic">
                    No purchase history records found.
                  </div>
                )
              ) : (
                wishlistItems.length > 0 ? (
                  wishlistItems.map((track) => (
                    <div key={track.id} className="bg-[#191924]/60 p-3 rounded-xl border border-zinc-800/20 flex justify-between items-center animate-fade-in-up">
                      <div className="flex items-center gap-3 min-w-0 font-sans">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#06060A] flex-shrink-0 border border-zinc-800/40">
                          {track.cover ? (
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[#8F9CAE]">
                              ★
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#FFFFFF] truncate">{track.title}</span>
                          <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">{track.artist}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-[#6366F1]">{track.price}</span>
                        <button
                          onClick={() => onAddToCart(track)}
                          className="bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1] hover:text-[#FFFFFF] text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded border border-[#6366F1]/20 transition-all duration-200 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(track.id)}
                          className="text-[#EF4444] hover:text-[#EF4444]/80 text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 transition-colors duration-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-[#8F9CAE]/60 italic">
                    Your wishlist is empty.
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Sales & Revenue Dashboard (only visible for Artists & Admins) */}
      {(currentUser?.role?.toLowerCase() === 'customer' || currentUser?.role?.toLowerCase() === 'admin') && (
        <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 shadow-2xl flex flex-col gap-6 w-full animate-fade-in-up mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#FFFFFF]">Sales & Revenue Dashboard</h2>
              <p className="text-[10px] text-[#8F9CAE] mt-1">Real-time performance analytics for your released tracks.</p>
            </div>
            <button
              onClick={fetchSalesData}
              disabled={loadingSales}
              className="text-[10px] uppercase tracking-widest font-extrabold px-4 py-2.5 rounded-lg bg-[#191924] border border-zinc-800/60 hover:bg-[#6366F1] hover:border-transparent transition-all duration-300 cursor-pointer self-start"
            >
              {loadingSales ? 'Refreshing...' : 'Refresh Metrics'}
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#191924] p-5 rounded-xl border border-zinc-800/40 flex flex-col gap-1.5 transition-all duration-300 hover:border-indigo-500/30">
              <span className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">Total Revenue</span>
              <span className="text-2xl font-black text-[#FFFFFF]">
                ${salesData.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-[#191924] p-5 rounded-xl border border-zinc-800/40 flex flex-col gap-1.5 transition-all duration-300 hover:border-indigo-500/30">
              <span className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">Beats Sold</span>
              <span className="text-2xl font-black text-[#FFFFFF]">{salesData.length} units</span>
            </div>
          </div>

          {/* Buyers Ledger Table */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-widest">Transaction Ledger</span>
            
            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800/40">
              <table className="w-full border-collapse text-left text-xs text-[#FFFFFF]">
                <thead>
                  <tr className="bg-[#191924] border-b border-zinc-800/60 text-[#8F9CAE] font-bold text-[9px] uppercase tracking-wider select-none">
                    <th className="px-4 py-3">Beat Title</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {salesData.length > 0 ? (
                    salesData.map((sale) => (
                      <tr key={sale.order_id} className="hover:bg-[#191924]/30 transition-colors duration-200">
                        <td className="px-4 py-3 font-semibold text-[#FFFFFF]">{sale.title}</td>
                        <td className="px-4 py-3 text-[#8F9CAE]">{sale.buyer}</td>
                        <td className="px-4 py-3 text-[#6366F1] font-bold">${parseFloat(sale.amount).toFixed(2)}</td>
                        <td className="px-4 py-3 text-[10px] font-mono text-[#8F9CAE]/70">{sale.transaction_id}</td>
                        <td className="px-4 py-3 text-[#8F9CAE]">
                          {new Date(sale.sold_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-[#8F9CAE] italic">
                        No sales transactions recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
