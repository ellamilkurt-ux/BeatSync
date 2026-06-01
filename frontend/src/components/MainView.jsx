import React, { useState, useEffect, useRef } from 'react';
import fallbackSong from '../assets/matadonar.mp3';

const genres = ['All Tracks', 'Hip-Hop', 'R&B', 'House', 'Pop', 'EDM'];

// A modular Track Card component to isolate reviews / star selection state
function TrackCard({ 
  track, 
  isPlaying, 
  onPlayToggle, 
  onAddToCart, 
  reviews, 
  onAddReview,
  showReviews,
  onToggleReviews
}) {
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    onAddReview(track.id, userRating, userComment);
    setUserComment('');
    setUserRating(5);
  };

  // Helper to render stars
  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const active = starIndex <= rating;
          return (
            <button
              type={interactive ? "button" : "submit"}
              key={starIndex}
              onClick={interactive ? () => setUserRating(starIndex) : undefined}
              disabled={!interactive}
              className={`p-0 bg-transparent transition-all duration-150 ${interactive ? 'cursor-pointer hover:scale-110' : 'pointer-events-none'}`}
            >
              <svg 
                viewBox="0 0 24 24" 
                width={interactive ? "16" : "10"} 
                height={interactive ? "16" : "10"} 
                className={`fill-current ${active ? 'text-[#6366F1]' : 'text-[#191924]'}`}
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          );
        })}
      </div>
    );
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/40 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 ease-out flex flex-col justify-between h-full group">
      
      {/* Top Container: Cover Art or Placeholder */}
      <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden select-none">
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

      {/* Reviews Collapsible Button */}
      <div className="mt-4 pt-3 border-t border-zinc-800/30 w-full">
        <button
          onClick={onToggleReviews}
          className="flex items-center justify-between w-full text-[10px] font-extrabold uppercase tracking-widest text-[#8F9CAE] hover:text-[#6366F1] transition-colors cursor-pointer"
        >
          <span>Reviews ({reviews.length})</span>
          <svg 
            viewBox="0 0 24 24" 
            width="12" 
            height="12" 
            className={`fill-current transform transition-transform duration-200 ${showReviews ? 'rotate-180' : ''}`}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
      </div>

      {/* Community Engagement Section */}
      {showReviews && (
        <div className="mt-4 pt-4 border-t border-zinc-800/40 w-full animate-fade-in">
          {/* Review input form */}
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-2.5 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8F9CAE]">Your Rating:</span>
              {renderStars(userRating, true)}
            </div>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Leave a review..."
              rows="2"
              required
              className="bg-[#06060A] text-xs text-[#FFFFFF] placeholder-[#8F9CAE]/40 p-2 rounded-lg border border-zinc-800/40 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none resize-none transition-all"
            />
            <button
              type="submit"
              className="bg-[#6366F1] text-[#FFFFFF] text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-lg hover:opacity-90 transition-opacity self-end cursor-pointer"
            >
              Submit
            </button>
          </form>

          {/* Comment Feed / Vertical Timeline */}
          <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="flex gap-2 text-[10px] bg-[#06060A]/50 p-2.5 rounded-lg border border-zinc-800/30">
                  {/* User initials bubble */}
                  <div className="w-6 h-6 rounded-full bg-[#191924] flex items-center justify-center font-extrabold text-[#6366F1] text-[8px] flex-shrink-0">
                    {getInitials(rev.username)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FFFFFF] truncate">{rev.username}</span>
                      <span className="text-[8px] text-[#8F9CAE]">{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div className="mt-0.5">{renderStars(rev.rating)}</div>
                    {/* comment text */}
                    <p className="mt-1 text-[#8F9CAE] leading-relaxed break-words">{rev.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-[#8F9CAE]/60 italic py-2 block text-center">No reviews yet. Be the first!</span>
            )}
          </div>
        </div>
      )}

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
  reviewsByTrackId,
  onAddReview
}) {
  const [selectedGenre, setSelectedGenre] = useState('All Tracks');
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [expandedReviewsTrackId, setExpandedReviewsTrackId] = useState(null);

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

  // Filter tracks matching selectedGenre
  const filteredTracks = tracks.filter(
    (track) => selectedGenre === 'All Tracks' || track.genre === selectedGenre
  );

  // Subtotal calculation
  const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return parseFloat(priceStr.replace('$', '')) || 0;
  };
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);

  return (
    <div className="h-full w-full flex bg-[#06060A] text-[#FFFFFF] overflow-hidden relative select-none">
      
      {/* 1. Left Sidebar - Locked vertically, functioning as Genre and Now Playing stations */}
      <aside className="w-64 bg-[#111118] border-r border-zinc-800/60 p-6 flex flex-col justify-between flex-shrink-0 h-full overflow-hidden select-none">
        
        {/* Genre Selector Deck */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8F9CAE]">Genres</span>
          <nav className="flex flex-col gap-1.5">
            {genres.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#6366F1]/10 text-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.05)] border border-[#6366F1]/20'
                      : 'text-[#8F9CAE] hover:bg-[#191924] hover:text-[#FFFFFF] border border-transparent'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Now Playing visualizer panel */}
        <div className="bg-[#191924] p-4 rounded-xl border border-zinc-800/40 flex flex-col gap-3 mt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F9CAE]">Now Playing</span>
          {activeTrack ? (
            <>
              <div className="flex items-center gap-3">
                {activeTrack.cover ? (
                  <img 
                    src={activeTrack.cover} 
                    alt={activeTrack.title}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800/60"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#06060A] flex items-center justify-center text-[#8F9CAE] border border-zinc-800/60">
                    <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#FFFFFF] truncate">{activeTrack.title}</span>
                  <span className="text-[10px] text-[#8F9CAE] truncate">{activeTrack.artist}</span>
                </div>
              </div>

              {/* Real Audio Progress bar */}
              <div className="flex flex-col gap-1.5 mt-1">
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
            </>
          ) : (
            <span className="text-[10px] text-[#8F9CAE]/60 italic py-4 text-center block">No active track</span>
          )}
        </div>

      </aside>

      {/* 2. Central Workspace - Internally scrollable grid */}
      <main className="flex-grow h-full overflow-y-auto pb-24 px-8 pt-6 select-none bg-[#06060A]">
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-start">
            {filteredTracks.map((track) => (
              <TrackCard 
                key={track.id}
                track={track}
                isPlaying={activeTrackId === track.id}
                onPlayToggle={handlePlayToggle}
                onAddToCart={onAddToCart}
                reviews={reviewsByTrackId[track.id] || []}
                onAddReview={onAddReview}
                showReviews={expandedReviewsTrackId === track.id}
                onToggleReviews={() => setExpandedReviewsTrackId(expandedReviewsTrackId === track.id ? null : track.id)}
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
      </main>

      {/* Mobile Cart Backdrop Overlay */}
      {isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-20 bg-black/70 md:hidden animate-fade-in"
        />
      )}

      {/* 3. Right-Side Shopping Cart Sidebar - Locked vertically */}
      {isCartOpen && (
        <aside className="fixed top-16 right-0 z-30 w-80 bg-[#111118] border-l border-zinc-800/60 p-6 flex flex-col justify-between transition-transform duration-300 h-[calc(100vh-4rem)] md:relative md:h-full flex-shrink-0 animate-slide-in-right select-none">
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

    </div>
  );
}
