import React, { useState, useEffect } from 'react';

export default function ReviewModal({ isOpen, onClose, track, addNotification, isAuthenticated }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && track) {
      fetchReviews();
    }
  }, [isOpen, track]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tracks/${track.id}/reviews`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        console.error('Failed to fetch reviews:', data.message);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addNotification('Please sign in to leave a review.', 'error');
      return;
    }
    if (!userComment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('beatsync_token');
      const response = await fetch(`http://localhost:5000/api/tracks/${track.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ rating: userRating, comment: userComment })
      });

      const data = await response.json();
      if (response.ok) {
        addNotification('Review submitted successfully', 'success');
        setReviews((prev) => [data.review, ...prev]);
        setUserComment('');
        setUserRating(5);
      } else {
        addNotification(data.message || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      addNotification('Connection error while submitting review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !track) return null;

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
                width={interactive ? "18" : "12"} 
                height={interactive ? "18" : "12"} 
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 animate-fade-in select-none">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-[#111118] p-6 rounded-2xl border border-zinc-800/60 max-w-2xl w-full flex flex-col shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-scale-in z-10 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-4 mb-5">
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF]">Reviews & Ratings</h2>
            <span className="text-xs text-[#8F9CAE] truncate mt-1">{track.title} — {track.artist}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8F9CAE] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Scrollable Layout (Form + Feed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1">
          
          {/* Submit form */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Write a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-[#191924] p-3 rounded-lg border border-zinc-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8F9CAE]">Rating</span>
                  {renderStars(userRating, true)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">Your comment</label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Describe your review (e.g. mix quality, instrument slicing...)"
                    rows="4"
                    required
                    disabled={submitting}
                    className="bg-[#191924] text-xs text-[#FFFFFF] placeholder-[#8F9CAE]/30 p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none resize-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#6366F1] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer disabled:opacity-50 text-center"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-[#191924]/60 border border-zinc-800/40 p-5 rounded-xl text-center flex flex-col items-center justify-center h-48 gap-3">
                <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current text-[#8F9CAE]/60">
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z" />
                </svg>
                <span className="text-xs font-bold text-[#8F9CAE]">Authentication Required</span>
                <p className="text-[10px] text-[#8F9CAE]/60 leading-relaxed max-w-[160px]">Please sign in to rate this track and submit feedback.</p>
              </div>
            )}
          </div>

          {/* Reviews list */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Community Feedback</h3>
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-[#8F9CAE]/60 italic">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="flex gap-2 text-[10px] bg-[#191924]/40 p-3 rounded-lg border border-zinc-800/30 animate-fade-in">
                    <div className="w-6 h-6 rounded-full bg-[#191924] flex items-center justify-center font-extrabold text-[#6366F1] text-[8px] flex-shrink-0">
                      {getInitials(rev.username)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#FFFFFF] truncate">{rev.username}</span>
                        <span className="text-[8px] text-[#8F9CAE]">{new Date(rev.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="mt-0.5">{renderStars(rev.rating)}</div>
                      <p className="mt-1 text-[#8F9CAE] leading-relaxed break-words">{rev.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-[#8F9CAE]/60 italic py-8 block text-center">No reviews yet. Be the first to review!</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
