import React, { useState, useEffect, useRef, useMemo } from 'react';
import fallbackSong from '../assets/matadonar.mp3';
import ReviewModal from './ReviewModal';

// removed static genres array

function TrackCard({ 
  track, 
  isPlaying, 
  onPlayToggle, 
  onAddToCart, 
  onOpenReviews,
  isWishlisted,
  onWishlistToggle
}) {
  return (
    <div className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/40 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 ease-out flex flex-col justify-between h-full group animate-fade-in-up">
      
      {/* Top Container: Cover Art or Placeholder */}
      <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden select-none">
        {/* Absolute-positioned Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-90 cursor-pointer shadow-md group/heart ${
            isWishlisted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20 animate-heart-pop'
              : 'bg-[#111118]/60 border-zinc-800/40 text-[#8F9CAE] hover:text-[#FFFFFF] hover:bg-[#111118]/80'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            className={`transition-transform duration-300 group-hover/heart:scale-110 ${
              isWishlisted ? 'fill-current text-rose-500' : 'fill-none stroke-current stroke-2'
            }`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {track.cover ? (
          <img 
            src={track.cover} 
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#06060A] text-[#8F9CAE] relative">
            <svg viewBox="0 0 24 24" width="28" height="28" className="fill-current">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="text-[9px] uppercase tracking-wider mt-2 opacity-50 font-bold">Creator Asset</span>
          </div>
        )}

        {/* Bouncing spectrum visualizer bars */}
        {isPlaying && (
          <div className="absolute bottom-3 right-3 flex items-end gap-1 h-3 bg-black/60 px-2 py-1 rounded-full select-none">
            <div className="w-0.5 h-full bg-[#6366F1] animate-bar-1" />
            <div className="w-0.5 h-full bg-[#6366F1] animate-bar-2" />
            <div className="w-0.5 h-full bg-[#6366F1] animate-bar-3" />
            <div className="w-0.5 h-full bg-[#6366F1] animate-bar-4" />
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 ease-out">
          <button
            onClick={() => onPlayToggle(track)}
            className="w-12 h-12 rounded-full bg-[#6366F1] text-[#FFFFFF] flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer shadow-[0_0_15px_#6366F1]"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Metadata & Title */}
      <div className="flex flex-col mb-4">
        <span className={`text-base font-bold tracking-tight truncate transition-colors duration-200 ${isPlaying ? 'text-[#6366F1]' : 'text-[#FFFFFF]'}`}>
          {track.title}
        </span>
        <span className="text-xs text-[#8F9CAE] truncate">{track.artist}</span>

        {/* Rating summary */}
        <div className="flex items-center gap-1.5 mt-1.5 select-none">
          <span className="text-[10px] text-yellow-500 flex items-center gap-0.5 font-bold">
            ★ {track.rating > 0 ? track.rating.toFixed(1) : '0.0'}
          </span>
          <span className="text-[10px] text-[#8F9CAE] opacity-80 font-medium">
            ({track.reviewsCount} {track.reviewsCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs font-bold text-[#8F9CAE] uppercase tracking-wider bg-[#191924] px-3 py-1 rounded-full border border-zinc-800/40">
          {track.price}
        </span>
        <button
          onClick={() => onAddToCart(track)}
          className="bg-[#191924] text-[#FFFFFF] text-[10px] font-bold py-1.5 px-3 rounded-lg border border-zinc-800/60 hover:bg-[#6366F1] hover:border-transparent transition-all cursor-pointer"
        >
          Add to Cart
        </button>
      </div>

      {/* Reviews Trigger Button */}
      <div className="mt-4 pt-3 border-t border-zinc-800/30 w-full">
        <button
          onClick={() => onOpenReviews(track)}
          className="flex items-center justify-between w-full text-[10px] font-extrabold uppercase tracking-widest text-[#8F9CAE] hover:text-[#6366F1] transition-colors cursor-pointer"
        >
          <span>Reviews & Rating</span>
          <svg viewBox="0 0 24 24" width="12" height="12" className="fill-current text-[#8F9CAE] hover:text-[#6366F1] transition-all">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </button>
      </div>

    </div>
  );
}

export default function MainView({ 
  setView, 
  onSignOut, 
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  onOpenCheckout,
  userTracks,
  isCartOpen,
  setIsCartOpen,
  tracks,
  isAuthenticated,
  addNotification,
  wishlistItems = [],
  onAddToWishlist,
  onRemoveFromWishlist,
  isWishlistOpen,
  setIsWishlistOpen,
  genres = ['Hip-Hop', 'R&B', 'House', 'Pop', 'EDM', 'Ambient', 'Phonk']
}) {
  const genreTabs = ['All Tracks', ...genres];
  const [selectedGenre, setSelectedGenre] = useState('All Tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [reviewModalTrack, setReviewModalTrack] = useState(null);

  // Audio HTML5 controller
  const audioRef = useRef(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationTimeStr, setDurationTimeStr] = useState('0:00');

  const activeTrack = tracks.find(t => t.id === activeTrackId);

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const playAudio = (track) => {
    stopAudio();
    const audioFile = track.file || fallbackSong;
    const audio = new Audio(audioFile);
    audio.volume = 0.35;
    audioRef.current = audio;

    // Track state details
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setCurrentProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTimeStr(formatTime(audio.currentTime));
        setDurationTimeStr(formatTime(audio.duration));
      }
    });

    audio.addEventListener('ended', () => {
      setActiveTrackId(null);
      setCurrentProgress(0);
    });

    audio.play()
      .then(() => {
        console.log(`[Playback] Playing track: ${track.title}`);
      })
      .catch((err) => {
        console.error('Audio playback failed:', err);
      });
  };

  const handlePlayToggle = (track) => {
    if (activeTrackId === track.id) {
      stopAudio();
      setActiveTrackId(null);
      setCurrentProgress(0);
    } else {
      setActiveTrackId(track.id);
      playAudio(track);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Filter tracks matching selectedGenre AND searchQuery
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesGenre = selectedGenre === 'All Tracks' || track.genre === selectedGenre;
      const matchesSearch = 
        (track.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (track.artist || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [tracks, selectedGenre, searchQuery]);

  // Subtotal calculation
  const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return parseFloat(priceStr.replace('$', '')) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);

  return (
    <div className="h-full w-full flex bg-[#06060A] text-[#FFFFFF] overflow-hidden relative select-none">
      
      {/* 2. Central Workspace - Internally scrollable grid (now occupies full width) */}
      <main className="flex-grow h-full overflow-y-auto pb-24 px-6 md:px-8 pt-6 select-none bg-[#06060A]">
        <div className="max-w-[1200px] mx-auto">
          {/* Search Bar Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current text-[#8F9CAE]">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by track title or artist..."
              className="w-full bg-[#111118] text-[#FFFFFF] text-xs pl-11 pr-10 py-3.5 rounded-xl border border-zinc-800/40 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all duration-300 placeholder-[#8F9CAE]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8F9CAE] hover:text-[#FFFFFF] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>

          {/* Horizontal Genre Tab selector */}
          <div className="flex flex-wrap gap-2.5 mb-8 border-b border-zinc-800/20 pb-5">
            {genreTabs.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`text-[10px] uppercase tracking-widest font-extrabold px-5 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#6366F1] text-[#FFFFFF] border-transparent shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-95'
                      : 'bg-[#111118] text-[#8F9CAE] border-zinc-800/60 hover:bg-[#191924] hover:text-[#FFFFFF]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full items-start animate-fade-in">
              {filteredTracks.map((track) => (
                <TrackCard 
                  key={track.id}
                  track={track}
                  isPlaying={activeTrackId === track.id}
                  onPlayToggle={handlePlayToggle}
                  onAddToCart={onAddToCart}
                  onOpenReviews={setReviewModalTrack}
                  isWishlisted={wishlistItems.some(item => item.id === track.id)}
                  onWishlistToggle={() => {
                    if (wishlistItems.some(item => item.id === track.id)) {
                      onRemoveFromWishlist(track.id);
                    } else {
                      onAddToWishlist(track);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-xs font-bold text-[#8F9CAE]">
                No tracks found in this category
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Mobile/Desktop Cart & Wishlist Backdrop Overlay */}
      {(isCartOpen || isWishlistOpen) && (
        <div 
          onClick={() => {
            setIsCartOpen(false);
            setIsWishlistOpen(false);
          }}
          className="fixed inset-0 z-20 bg-black/70 animate-fade-in"
        />
      )}

      {/* Wishlist Drawer - Slide-over overlay */}
      {isWishlistOpen && (
        <aside className="fixed top-16 right-0 z-30 w-80 bg-[#111118]/95 backdrop-blur-md border-l border-zinc-800/60 p-6 flex flex-col justify-between transition-transform duration-300 h-[calc(100vh-4rem)] shadow-[0_0_30px_rgba(0,0,0,0.6)] animate-slide-in-right select-none">
          <div className="flex flex-col h-full justify-between overflow-hidden">
            <div className="flex flex-col overflow-hidden h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF]">
                  Saved Wishlist
                </h2>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-[#8F9CAE] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  aria-label="Close wishlist"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {/* Wishlist Items List - scrollable */}
              <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#191924] p-3.5 rounded-xl border border-zinc-800/40 flex items-center justify-between animate-fade-in-up"
                    >
                      <div className="flex flex-col min-w-0 flex-1 pr-2">
                        <span className="text-xs font-bold text-[#FFFFFF] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">
                          {item.artist}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onAddToCart(item)}
                          className="bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1] hover:text-[#FFFFFF] text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded border border-[#6366F1]/20 transition-all duration-200 cursor-pointer"
                        >
                          + Cart
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(item.id)}
                          className="text-[10px] text-[#8F9CAE] hover:text-[#EF4444] font-bold underline cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center flex items-center justify-center h-full">
                    <span className="text-xs text-[#8F9CAE] font-medium">Wishlist is empty</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 3. Right-Side Shopping Cart Drawer - Slide-over overlay */}
      {isCartOpen && (
        <aside className="fixed top-16 right-0 z-30 w-80 bg-[#111118]/95 backdrop-blur-md border-l border-zinc-800/60 p-6 flex flex-col justify-between transition-transform duration-300 h-[calc(100vh-4rem)] shadow-[0_0_30px_rgba(0,0,0,0.6)] animate-slide-in-right select-none">
          <div className="flex flex-col h-full justify-between overflow-hidden">
            <div className="flex flex-col overflow-hidden h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF]">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#8F9CAE] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {/* Cart Items List - scrollable */}
              <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#191924] p-3.5 rounded-xl border border-zinc-800/40 flex items-center justify-between"
                    >
                      <div className="flex flex-col min-w-0 flex-1 pr-2">
                        <span className="text-xs font-bold text-[#FFFFFF] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">
                          {item.artist}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-[#FFFFFF]">
                          {item.price}
                        </span>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-[10px] text-[#8F9CAE] hover:text-[#EF4444] font-bold underline cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center flex items-center justify-center h-full">
                    <span className="text-xs text-[#8F9CAE] font-medium">Cart is empty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subtotal and Checkout Summary Block */}
            <div className="mt-8 border-t border-zinc-800/40 pt-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#8F9CAE] uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="text-base font-black text-[#FFFFFF]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onOpenCheckout}
                disabled={cartItems.length === 0}
                className={`w-full text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg transition-all duration-200 select-none ${
                  cartItems.length > 0
                    ? 'bg-[#6366F1] text-[#FFFFFF] hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer'
                    : 'bg-[#191924] text-[#8F9CAE] cursor-not-allowed border border-zinc-800/40'
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Now Playing Player Widget at the bottom-right corner */}
      {activeTrack && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111118]/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-3 w-80 animate-fade-in select-none">
          {/* Header row with minimize/close */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#6366F1]">Now Playing</span>
            <button 
              onClick={() => handlePlayToggle(activeTrack)} 
              className="text-[#8F9CAE] hover:text-[#EF4444] transition-colors cursor-pointer"
              title="Close Player"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" className="fill-current">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Track details row */}
          <div className="flex items-center gap-3">
            {activeTrack.cover ? (
              <img 
                src={activeTrack.cover} 
                alt={activeTrack.title}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800/60"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#06060A] flex items-center justify-center text-[#8F9CAE] border border-zinc-800/60">
                <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[#FFFFFF] truncate">{activeTrack.title}</span>
              <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">{activeTrack.artist}</span>
            </div>
            
            {/* Play/Pause control inside widget */}
            <button
              onClick={() => handlePlayToggle(activeTrack)}
              className="w-8 h-8 rounded-full bg-[#6366F1] text-[#FFFFFF] flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer flex-shrink-0"
              title="Pause Track"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </div>

          {/* Audio Progress bar */}
          <div className="flex flex-col gap-1">
            <div className="w-full h-1 bg-[#06060A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#6366F1] transition-all duration-100 ease-linear shadow-[0_0_10px_#6366F1]"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-[#8F9CAE] font-bold">
              <span>{currentTimeStr}</span>
              <span>{activeTrack.duration || durationTimeStr}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Review Modal */}
      <ReviewModal 
        isOpen={!!reviewModalTrack}
        onClose={() => setReviewModalTrack(null)}
        track={reviewModalTrack}
        addNotification={addNotification}
        isAuthenticated={isAuthenticated}
      />

    </div>
  );
}
