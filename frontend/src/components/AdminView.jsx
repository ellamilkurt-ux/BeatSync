import React, { useState } from 'react';

export default function AdminView({ tracks, onAddTrack, onUpdateTrack, onDeleteTrack }) {
  // Creator form inputs
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Hip-Hop');
  const [price, setPrice] = useState('9.99');
  const [duration, setDuration] = useState('3:15');

  // Editing state for updating a track
  const [editingTrack, setEditingTrack] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editGenre, setEditGenre] = useState('Hip-Hop');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !price.trim()) return;

    const formattedPrice = price.startsWith('$') ? price : `$${price}`;

    const newTrack = {
      id: Date.now(),
      title,
      artist,
      genre,
      price: formattedPrice,
      duration: duration || '3:00'
    };

    onAddTrack(newTrack);

    // reset fields
    setTitle('');
    setArtist('');
    setGenre('Hip-Hop');
    setPrice('9.99');
    setDuration('3:15');
  };

  const startEdit = (track) => {
    setEditingTrack(track);
    setEditTitle(track.title);
    setEditArtist(track.artist);
    setEditGenre(track.genre);
    setEditPrice(track.price.replace('$', ''));
    setEditDuration(track.duration);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingTrack || !editTitle.trim() || !editArtist.trim() || !editPrice.trim()) return;

    const formattedPrice = editPrice.startsWith('$') ? editPrice : `$${editPrice}`;

    const updatedTrack = {
      ...editingTrack,
      title: editTitle,
      artist: editArtist,
      genre: editGenre,
      price: formattedPrice,
      duration: editDuration || '3:00'
    };

    onUpdateTrack(updatedTrack);
    setEditingTrack(null);
  };

  return (
    <div className="h-full w-full flex bg-[#06060A] text-[#FFFFFF] overflow-hidden select-none">
      
      {/* 1. Left Control Console - Form to Create Tracks */}
      <aside className="w-96 bg-[#111118] border-r border-zinc-800/60 p-6 flex flex-col justify-between flex-shrink-0 h-full overflow-y-auto">
        <div>
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-[#FFFFFF] mb-6">
            Track Creation Deck
          </h2>

          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Track Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Midnight Groove"
                className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder-[#8F9CAE]/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Artist / Producer</label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="producer_one"
                className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder-[#8F9CAE]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="R&B">R&B</option>
                  <option value="House">House</option>
                  <option value="Pop">Pop</option>
                  <option value="EDM">EDM</option>
                  <option value="Ambient">Ambient</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Price (USD)</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder-[#8F9CAE]/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">Duration</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3:15"
                className="bg-[#191924] text-xs text-[#FFFFFF] p-3 rounded-lg border border-zinc-800/60 focus:ring-1 focus:ring-[#6366F1] focus:border-transparent outline-none transition-all placeholder-[#8F9CAE]/30"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
            >
              Add Track to Master Catalog
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Right Workspace - Dense High-End Table */}
      <main className="flex-grow p-8 h-full overflow-y-auto pb-24 bg-[#06060A]">
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
                        onClick={() => onDeleteTrack(track.id)}
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
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="R&B">R&B</option>
                    <option value="House">House</option>
                    <option value="Pop">Pop</option>
                    <option value="EDM">EDM</option>
                    <option value="Ambient">Ambient</option>
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
