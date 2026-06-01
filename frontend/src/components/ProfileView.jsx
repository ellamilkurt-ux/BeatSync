import React, { useState } from 'react';

export default function ProfileView({ userTracks, addUserTrack, purchaseHistory, addNotification }) {
  // Account settings states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Creator upload states
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackPrice, setTrackPrice] = useState('');
  const [trackGenre, setTrackGenre] = useState('Hip-Hop');

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addNotification('All password fields are required.', 'error');
      return;
    }
    
    console.log('[Profile] Password updated.');
    addNotification('Password updated successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleTrackUpload = (e) => {
    e.preventDefault();
    if (!trackTitle || !trackArtist || !trackPrice) {
      addNotification('Please fill in all track fields.', 'error');
      return;
    }

    const priceFormatted = trackPrice.startsWith('$') ? trackPrice : `$${trackPrice}`;

    const newTrack = {
      id: Date.now(),
      title: trackTitle,
      artist: trackArtist,
      price: priceFormatted,
      genre: trackGenre,
      duration: '3:15'
    };

    addUserTrack(newTrack);
    addNotification(`Track "${trackTitle}" successfully uploaded`, 'success');
    
    // Clear fields
    setTrackTitle('');
    setTrackArtist('');
    setTrackPrice('');
    setTrackGenre('Hip-Hop');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 flex flex-col gap-8 animate-fade-in bg-[#06060A] text-[#FFFFFF]">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#FFFFFF]">Studio Profile</h1>
        <p className="text-xs text-[#8F9CAE] mt-1">Manage credentials and creator portfolio</p>
      </div>

      {/* Top Section: Settings & Creator Upload Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Account Settings Panel */}
        <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl">
          <div>
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">Account Settings</h2>
            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
                <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
                className="mt-2 bg-[#6366F1] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer self-start"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Track Creator Upload Panel */}
        <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl">
          <div>
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">Upload New Track</h2>
            <form onSubmit={handleTrackUpload} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
                  <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={trackArtist}
                    onChange={(e) => setTrackArtist(e.target.value)}
                    placeholder="producer_one"
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
                  <label className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                    Genre
                  </label>
                  <select
                    value={trackGenre}
                    onChange={(e) => setTrackGenre(e.target.value)}
                    className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="R&B">R&B</option>
                    <option value="House">House</option>
                    <option value="Pop">Pop</option>
                    <option value="EDM">EDM</option>
                    <option value="Ambient">Ambient</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#6366F1] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer self-start"
              >
                Upload Track
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Bottom Section: My Uploaded Tracks & Purchase History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* My Uploaded Tracks Display */}
        <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col shadow-2xl">
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">My Uploads</h2>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {userTracks.length > 0 ? (
              userTracks.map((track) => (
                <div key={track.id} className="bg-[#191924] p-3.5 rounded-xl border border-zinc-800/20 flex justify-between items-center">
                  <div className="flex flex-col min-w-0 font-sans">
                    <span className="text-xs font-bold text-[#FFFFFF] truncate">{track.title}</span>
                    <span className="text-[10px] text-[#8F9CAE] truncate mt-0.5">{track.artist}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase font-bold text-[#8F9CAE] bg-[#06060A] px-2.5 py-0.5 rounded-md border border-zinc-800/40">
                      {track.genre}
                    </span>
                    <span className="text-xs font-extrabold text-[#6366F1]">{track.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#8F9CAE] italic">
                No tracks uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Purchase History Panel */}
        <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col shadow-2xl">
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">Purchase History</h2>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {purchaseHistory.length > 0 ? (
              purchaseHistory.map((item) => (
                <div key={item.id} className="bg-[#191924] p-3.5 rounded-xl border border-zinc-800/20 flex justify-between items-center">
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
              <div className="py-12 text-center text-xs text-[#8F9CAE] italic">
                No purchase history records found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
