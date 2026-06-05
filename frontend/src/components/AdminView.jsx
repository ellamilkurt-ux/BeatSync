import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminView({ 
  tracks, 
  fetchTracks, 
  addNotification, 
  onDeleteLocalCart,
  genres = ['Hip-Hop', 'R&B', 'House', 'Pop', 'EDM', 'Ambient', 'Phonk'],
  onAddGenre
}) {
  // Editing state for updating a track
  const [editingTrack, setEditingTrack] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editGenre, setEditGenre] = useState('Hip-Hop');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCoverFile, setEditCoverFile] = useState(null);

  // Genre management state
  const [newGenreName, setNewGenreName] = useState('');

  const handleAddGenreSubmit = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    await onAddGenre(newGenreName.trim());
    setNewGenreName('');
  };

  const startEdit = (track) => {
    setEditingTrack(track);
    setEditTitle(track.title);
    setEditArtist(track.artist);
    setEditGenre(track.genre);
    setEditPrice(track.price ? String(track.price).replace('$', '') : '');
    setEditDuration(track.duration);
    setEditCoverFile(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingTrack || !editTitle.trim() || !editPrice.trim()) return;

    const priceVal = parseFloat(String(editPrice).replace('$', ''));
    if (isNaN(priceVal) || priceVal < 0) {
      addNotification('Please enter a valid price.', 'error');
      return;
    }

    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to update tracks.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('genre', editGenre);
      formData.append('price', priceVal);
      formData.append('artist', editArtist);
      if (editCoverFile) {
        formData.append('cover_file', editCoverFile);
      }

      const response = await fetch(`${API_URL}/api/tracks/${editingTrack.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update track');
      }

      await fetchTracks();
      addNotification('Track updated successfully', 'success');
      setEditingTrack(null);
      setEditCoverFile(null);
    } catch (err) {
      console.error('Update track error:', err);
      addNotification(err.message || 'Error updating track', 'error');
    }
  };

  const handleDeleteTrack = async (trackId) => {
    const token = localStorage.getItem('beatsync_token');
    if (!token) {
      addNotification('Please sign in to delete tracks.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete track');
      }

      await fetchTracks();
      onDeleteLocalCart(trackId);
      addNotification('Track deleted successfully', 'destructive');
    } catch (err) {
      console.error('Delete track error:', err);
      addNotification(err.message || 'Error deleting track', 'error');
    }
  };

  // Calculate statistics dynamically from tracks prop
  const totalSongsOverall = tracks.length;
  const genreCounts = tracks.reduce((acc, track) => {
    const g = track.genre || 'Unknown';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="h-full w-full flex bg-[#06060A] text-[#FFFFFF] overflow-hidden select-none">
      
      {/* Dense High-End Main Workspace */}
      <main className="flex-grow p-8 h-full overflow-y-auto pb-24 bg-[#06060A]">
        
        {/* Genre Stats Dashboard */}
        <div className="mb-8">
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-4">
            Catalog Insights & Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Total Songs Card */}
            <div className="bg-[#111118] p-5 rounded-xl border border-zinc-800/40 flex items-center justify-between relative overflow-hidden group shadow-lg">
              <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-[#6366F1]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#6366F1]/10 transition-all duration-500"></div>
              <div className="z-10">
                <span className="text-[10px] font-extrabold text-[#8F9CAE] uppercase tracking-widest">Total Tracks</span>
                <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">{totalSongsOverall}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] z-10">
                <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>
            {/* Genre Counts */}
            {Object.entries(genreCounts).map(([genreName, count]) => (
              <div key={genreName} className="bg-[#111118] p-5 rounded-xl border border-zinc-800/40 flex flex-col justify-between hover:border-zinc-700/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-lg">
                <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-500"></div>
                <div className="z-10">
                  <span className="text-[10px] font-extrabold text-[#8F9CAE] uppercase tracking-widest truncate block max-w-full">
                    {genreName}
                  </span>
                  <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">
                    {count} <span className="text-xs font-semibold text-[#8F9CAE]">{count === 1 ? 'track' : 'tracks'}</span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Genre Management Section */}
        <div className="mb-8 bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#6366F1]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-4">
            Genre Management
          </h2>
          
          <form onSubmit={handleAddGenreSubmit} className="flex flex-col sm:flex-row items-end gap-4 max-w-xl">
            <div className="flex flex-col gap-1.5 flex-grow w-full">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">New Genre Name</label>
              <input
                type="text"
                required
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                placeholder="e.g. Synthwave, Lofi, Trap..."
                className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder-[#8F9CAE]/20"
              />
            </div>
            <button
              type="submit"
              className="bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto text-center"
            >
              Add Genre
            </button>
          </form>
          
          {/* Displaying active genres */}
          <div className="mt-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] block mb-3">Currently Active Genres</span>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span 
                  key={genre} 
                  className="text-[10px] uppercase font-bold text-[#8F9CAE] bg-[#191924] px-3 py-1 rounded-full border border-zinc-800/40 shadow-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">
          Master Track Inventory
        </h2>

        <div className="bg-[#111118] rounded-2xl border border-zinc-800/40 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[#8F9CAE] uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Cover</th>
                <th className="p-4">Title / Artist</th>
                <th className="p-4">Genre</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} className="border-b border-zinc-800/20 hover:bg-[#191924]/40 transition-colors">
                  <td className="p-4 pl-6">
                    {track.cover ? (
                      <img src={track.cover} alt="" className="w-10 h-10 rounded-lg object-cover border border-zinc-800/40" />
                    ) : (
                      <div className="w-10 h-10 bg-[#06060A] rounded-lg border border-zinc-800/40 flex items-center justify-center text-[#8F9CAE]">
                        <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#FFFFFF]">{track.title}</div>
                    <div className="text-[10px] text-[#8F9CAE] mt-0.5">{track.artist}</div>
                  </td>
                  <td className="p-4 text-[#8F9CAE] font-bold">{track.genre}</td>
                  <td className="p-4 text-[#8F9CAE]">{track.duration}</td>
                  <td className="p-4 text-[#6366F1] font-bold">{track.price}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Update Action */}
                      <button
                        onClick={() => startEdit(track)}
                        className="p-2 rounded-lg bg-[#191924] border border-zinc-800/60 text-[#8F9CAE] hover:text-[#6366F1] hover:border-[#6366F1]/30 transition-all cursor-pointer"
                        title="Update Track"
                      >
                        {/* Edit Pencil SVG */}
                        <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="p-2 rounded-lg bg-[#191924] border border-zinc-800/60 text-[#8F9CAE] hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all cursor-pointer"
                        title="Delete Track"
                      >
                        {/* Trash SVG */}
                        <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Editing Track Modal Dialog */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 animate-fade-in">
          <div className="bg-[#111118] p-8 rounded-2xl border border-zinc-800/60 max-w-md w-full flex flex-col shadow-[0_0_30px_rgba(99,102,241,0.15)] animate-scale-in">
            <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">
              Update Track Info
            </h2>

            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Track Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Artist / Producer</label>
                <input
                  type="text"
                  required
                  value={editArtist}
                  onChange={(e) => setEditArtist(e.target.value)}
                  className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Genre</label>
                  <select
                    value={editGenre}
                    onChange={(e) => setEditGenre(e.target.value)}
                    className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Price (USD)</label>
                  <input
                    type="text"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Duration</label>
                <input
                  type="text"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Cover Image Input (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Cover Image (Optional)</label>
                <div className="relative flex items-center justify-between bg-[#191924] rounded-lg border border-zinc-800/60 p-3 hover:border-zinc-700 transition-all overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCoverFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current text-[#8F9CAE]">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.07 2.66-1.48-1.78L7 16h10l-3.44-5.19z" />
                    </svg>
                    <span className="text-xs text-[#8F9CAE] truncate max-w-[200px]">
                      {editCoverFile ? editCoverFile.name : 'Choose new cover image...'}
                    </span>
                  </div>
                  {editCoverFile && (
                    <span className="text-[9px] uppercase font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/20 z-20">
                      New File
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="flex-1 bg-[#191924] text-[#8F9CAE] text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg border border-zinc-800/60 hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
