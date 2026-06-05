import React from 'react';

export default function Navbar({ 
  currentView, 
  setView, 
  isAuthenticated, 
  onSignOut, 
  isCartOpen, 
  setIsCartOpen, 
  cartCount,
  isWishlistOpen,
  setIsWishlistOpen,
  wishlistCount,
  userRole,
  setUserRole,
  currentUser
}) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-[#111118]/90 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-6 select-none">
      
      {/* Brand logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setView(isAuthenticated ? 'main' : 'landing')}
          className="flex items-center gap-2 text-lg font-extrabold tracking-tighter text-[#FFFFFF] cursor-pointer group"
        >
          {/* Waveform Logo SVG */}
          <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current text-[#6366F1] transition-transform duration-200 group-hover:scale-110">
            <path d="M6 15h2v-4H6v4zm4 4h2V5h-2v14zm4-8h2V9h-2v2zm4 4h2v-7h-2v7z" />
          </svg>
          <span className="tracking-tight text-base font-black">BeatSync</span>
        </button>
      </div>

      {/* Right Side View Navigation Links & User Profile info */}
      <div className="flex items-center gap-4 sm:gap-6">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setView('main')}
              className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                currentView === 'main' ? 'text-[#6366F1]' : 'text-[#8F9CAE] hover:text-[#FFFFFF]'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => setView('profile')}
              className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                currentView === 'profile' ? 'text-[#6366F1]' : 'text-[#8F9CAE] hover:text-[#FFFFFF]'
              }`}
            >
              Profile
            </button>

            {/* Admin Dashboard view option - only visible to admin users */}
            {(userRole?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'admin') && (
              <button
                onClick={() => setView('admin')}
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  currentView === 'admin' ? 'text-[#6366F1]' : 'text-[#8F9CAE] hover:text-[#FFFFFF]'
                }`}
              >
                Admin
              </button>
            )}

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              className={`relative p-2 rounded-lg hover:bg-[#191924] transition-colors cursor-pointer text-[#8F9CAE] hover:text-[#FFFFFF] flex-shrink-0 ${
                isWishlistOpen ? 'text-rose-500 bg-[#191924]' : ''
              }`}
              aria-label="Toggle wishlist"
            >
              {/* Heart SVG */}
              <svg viewBox="0 0 24 24" width="18" height="18" className={`fill-current ${isWishlistOpen ? 'text-rose-500' : ''}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {/* Badge */}
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-[#FFFFFF] text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#06060A]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Toggle Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className={`relative p-2 rounded-lg hover:bg-[#191924] transition-colors cursor-pointer text-[#8F9CAE] hover:text-[#FFFFFF] flex-shrink-0 ${
                isCartOpen ? 'text-[#6366F1] bg-[#191924]' : ''
              }`}
              aria-label="Toggle cart"
            >
              {/* Minimal Cart SVG */}
              <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#6366F1] text-[#FFFFFF] text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#06060A]">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Premium User Profile Block */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-zinc-800/60">
              <div className="w-8 h-8 rounded-full bg-[#191924] flex items-center justify-center text-[#8F9CAE] flex-shrink-0">
                {/* User avatar SVG */}
                <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col text-left justify-center min-w-0">
                <span className="text-[10px] font-extrabold text-[#FFFFFF] leading-none truncate">
                  {currentUser ? currentUser.username : 'User'}
                </span>
                <button
                  onClick={onSignOut}
                  className="text-[9px] text-[#8F9CAE] hover:text-[#EF4444] transition-colors cursor-pointer text-left font-bold uppercase tracking-wider mt-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setView('auth')}
              className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:text-[#6366F1] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </>
        )}
      </div>

    </header>
  );
}
