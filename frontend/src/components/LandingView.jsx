import React from 'react';

export default function LandingView({ setView }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] bg-[#06060A] text-[#FFFFFF] px-6 md:px-8 max-w-[1200px] mx-auto animate-fade-in justify-between">
      
      {/* Hero Layout */}
      <main className="flex-grow flex items-center py-16">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.05] mb-6">
            The Producer's<br />Trading Floor.
          </h1>
          
          <p className="text-lg md:text-xl font-normal text-[#8F9CAE] leading-relaxed mb-10">
            A minimalist audio catalog for independent creators and sound designers. Upload tracks, showcase works, and buy licenses in a borderless workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setView('auth')}
              className="inline-flex items-center justify-center bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-200 ease-out hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] cursor-pointer"
            >
              Enter Dashboard
            </button>
            <a
              href="#features"
              className="inline-flex items-center justify-center bg-[#111118] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-lg border border-zinc-800/60 transition-all duration-200 ease-out hover:bg-[#FFFFFF]/5 hover:-translate-y-[1px]"
            >
              Explore Features
            </a>
          </div>
        </div>
      </main>

      {/* Platform Stats Grid */}
      <section className="py-10 border-t border-[#111118] mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">4.8M+</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] mt-1">Tracks Traded</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">120k+</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] mt-1">Active Sound Designers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">$0.00</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE] mt-1">Gas & License Fees</div>
          </div>
        </div>
      </section>

      {/* Features Grid Panel */}
      <section id="features" className="py-16 border-t border-[#111118] scroll-mt-6">
        <h2 className="text-[10px] uppercase tracking-widest text-[#8F9CAE] font-bold mb-10">Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-[#6366F1] mb-4">
                {/* Folder/Catalog SVG Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">Monochrome Workspace</h3>
              <p className="text-xs text-[#8F9CAE] leading-relaxed">
                A distraction-free, borderless canvas designed specifically for high-efficiency sound curation and listing management.
              </p>
            </div>
          </div>
          <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-[#6366F1] mb-4">
                {/* Play SVG Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">Instant Playback</h3>
              <p className="text-xs text-[#8F9CAE] leading-relaxed">
                Preview full-fidelity MP3 tracks instantly using our native, zero-latency HTML5 audio preview engine.
              </p>
            </div>
          </div>
          <div className="bg-[#111118] p-6 rounded-2xl border border-zinc-800/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-[#6366F1] mb-4">
                {/* Shield/Lock SVG Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF] mb-2">Secure Transactions</h3>
              <p className="text-xs text-[#8F9CAE] leading-relaxed">
                End-to-end sandbox billing and immediate updates to your purchase history ledger and active track files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-12 border-t border-[#111118] text-[11px] text-[#8F9CAE] flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
        <span>&copy; 2026 BeatSync. All rights reserved.</span>
        <span>Studio Monochrome Edition</span>
      </footer>
    </div>
  );
}
