import React from 'react';
import heroGraphic from '../assets/landing_hero_graphic.png';

export default function LandingView({ setView }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#040408] text-[#FFFFFF] overflow-x-hidden font-sans select-none">
      
      {/* Decorative ambient glowing spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#6366F1]/10 blur-[150px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-4s' }}></div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12 relative z-10 flex flex-col gap-20">
        
        {/* ================= HERO SECTION ================= */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 md:pt-16">
          
          {/* Left Column: Heading & Text */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-ping"></span>
              Next-Gen Audio Marketplace
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Forge Your <br />
              <span className="text-[#6366F1]">
                Sonic Identity
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#8F9CAE] leading-relaxed mb-10 max-w-xl font-medium">
              Access a premium library of industry-grade beats and sound stems. Built for independent producers, content creators, and game designers looking for high-fidelity audio licensing without boundaries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setView('auth')}
                className="inline-flex items-center justify-center bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-8 py-4.5 rounded-xl transition-all duration-300 ease-out hover:opacity-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-[3px] active:translate-y-0 cursor-pointer"
              >
                Get Started Now
                <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current ml-2">
                  <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('showroom');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-[#111118]/80 backdrop-blur text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-8 py-4.5 rounded-xl border border-zinc-800/80 transition-all duration-300 ease-out hover:bg-white/5 hover:border-zinc-700 hover:-translate-y-[3px] active:translate-y-0 cursor-pointer"
              >
                Explore Catalog
              </button>
            </div>
          </div>

          {/* Right Column: Hero Graphic Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full aspect-square max-w-[480px] lg:max-w-none mx-auto group">
            {/* Glowing reflection card backdrops */}
            <div className="absolute inset-0 bg-[#6366F1]/10 rounded-3xl blur-3xl group-hover:scale-105 transition-transform duration-500"></div>
            
            <div className="relative w-full h-full rounded-3xl border border-zinc-800/80 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111118] transition-all duration-500 group-hover:border-[#6366F1]/40 group-hover:scale-[1.01] flex flex-col justify-between p-4">
              <div className="flex-grow rounded-2xl overflow-hidden border border-zinc-800/40 relative">
                <img 
                  src={heroGraphic} 
                  alt="Sound Visualizer Console" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating active sound card element */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2.5 animate-bounce-slow">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[9px] uppercase tracking-widest font-black text-white">Live Previews Active</span>
                </div>
              </div>

              {/* Console Details Footer bar */}
              <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#6366F1] font-bold">Featured Engine</span>
                  <span className="text-xs font-black text-white mt-0.5">Vocal Chop Visualizer V2</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-[#6366F1] rounded-full animate-bar-1"></div>
                  <div className="w-1 h-5 bg-purple-500 rounded-full animate-bar-2"></div>
                  <div className="w-1 h-4 bg-pink-500 rounded-full animate-bar-3"></div>
                  <div className="w-1 h-2 bg-[#6366F1] rounded-full animate-bar-4"></div>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* ================= PLATFORM STATS SECTION ================= */}
        <section className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#111118]/40 backdrop-blur-sm border border-zinc-800/40 p-6 rounded-2xl hover:border-[#6366F1]/20 transition-all group flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F9CAE]">Total Distributed</span>
              <div className="text-4xl font-black text-white mt-4 group-hover:text-[#6366F1] transition-colors">4.8M+</div>
              <p className="text-[10px] text-[#8F9CAE] mt-2 leading-relaxed">Unique high-fidelity stems and audio assets licensed worldwide.</p>
            </div>
            <div className="bg-[#111118]/40 backdrop-blur-sm border border-zinc-800/40 p-6 rounded-2xl hover:border-purple-500/20 transition-all group flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F9CAE]">Active Producers</span>
              <div className="text-4xl font-black text-white mt-4 group-hover:text-purple-400 transition-colors">120K+</div>
              <p className="text-[10px] text-[#8F9CAE] mt-2 leading-relaxed">Verified creators uploading, showcasing, and licensing beats daily.</p>
            </div>
            <div className="bg-[#111118]/40 backdrop-blur-sm border border-zinc-800/40 p-6 rounded-2xl hover:border-pink-500/20 transition-all group flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F9CAE]">Platform Pricing</span>
              <div className="text-4xl font-black text-white mt-4 group-hover:text-pink-400 transition-colors">$0.00</div>
              <p className="text-[10px] text-[#8F9CAE] mt-2 leading-relaxed">Zero gas fees or middleware cut. Creators retain 100% of licensing fees.</p>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE SHOWROOM PREVIEW ================= */}
        <section id="showroom" className="scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-[#6366F1] font-black mb-3">Live Showroom</h2>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Sample The Sound</h3>
            <p className="text-xs sm:text-sm text-[#8F9CAE] leading-relaxed">
              Check out some of our featured studio licenses. Log in to access full high-fidelity streaming, complete audio reviews, and instant checkouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Showroom Card 1 */}
            <div 
              onClick={() => setView('auth')}
              className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/60 hover:-translate-y-1 hover:border-[#6366F1]/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-[#6366F1]/5 group-hover:scale-105 transition-transform duration-300"></div>
                <svg viewBox="0 0 24 24" width="36" height="36" className="fill-current text-[#8F9CAE]/40 z-10 transition-transform group-hover:scale-110">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] uppercase font-black text-[#6366F1] tracking-wider">
                  Pop / Dance
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-sm font-bold truncate text-[#FFFFFF] group-hover:text-[#6366F1] transition-colors">Beauty and a Beat</span>
                <span className="text-[10px] text-[#8F9CAE] truncate mt-1">ZeD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#FFFFFF] bg-[#191924] px-2.5 py-1 rounded-md border border-zinc-800/40">$4.99</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#6366F1] group-hover:translate-x-1 transition-transform">Unlock Stems &rarr;</span>
              </div>
            </div>

            {/* Showroom Card 2 */}
            <div 
              onClick={() => setView('auth')}
              className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/60 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 group-hover:scale-105 transition-transform duration-300"></div>
                <svg viewBox="0 0 24 24" width="36" height="36" className="fill-current text-[#8F9CAE]/40 z-10 transition-transform group-hover:scale-110">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] uppercase font-black text-purple-400 tracking-wider">
                  EDM
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-sm font-bold truncate text-[#FFFFFF] group-hover:text-purple-400 transition-colors">Clarity</span>
                <span className="text-[10px] text-[#8F9CAE] truncate mt-1">Pulse</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#FFFFFF] bg-[#191924] px-2.5 py-1 rounded-md border border-zinc-800/40">$9.99</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 group-hover:translate-x-1 transition-transform">Unlock Stems &rarr;</span>
              </div>
            </div>

            {/* Showroom Card 3 */}
            <div 
              onClick={() => setView('auth')}
              className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/60 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-pink-500/5 group-hover:scale-105 transition-transform duration-300"></div>
                <svg viewBox="0 0 24 24" width="36" height="36" className="fill-current text-[#8F9CAE]/40 z-10 transition-transform group-hover:scale-110">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] uppercase font-black text-pink-400 tracking-wider">
                  Hip-Hop
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-sm font-bold truncate text-[#FFFFFF] group-hover:text-pink-400 transition-colors">Not Like Us</span>
                <span className="text-[10px] text-[#8F9CAE] truncate mt-1">Kendrick</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#FFFFFF] bg-[#191924] px-2.5 py-1 rounded-md border border-zinc-800/40">$4.99</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-pink-400 group-hover:translate-x-1 transition-transform">Unlock Stems &rarr;</span>
              </div>
            </div>

            {/* Showroom Card 4 */}
            <div 
              onClick={() => setView('auth')}
              className="bg-[#111118] p-5 rounded-2xl border border-zinc-800/60 hover:-translate-y-1 hover:border-[#6366F1]/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative w-full aspect-square bg-[#06060A] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-[#6366F1]/5 group-hover:scale-105 transition-transform duration-300"></div>
                <svg viewBox="0 0 24 24" width="36" height="36" className="fill-current text-[#8F9CAE]/40 z-10 transition-transform group-hover:scale-110">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] uppercase font-black text-[#6366F1] tracking-wider">
                  House / Techno
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-sm font-bold truncate text-[#FFFFFF] group-hover:text-[#6366F1] transition-colors">Matadonar</span>
                <span className="text-[10px] text-[#8F9CAE] truncate mt-1">Pulse</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#FFFFFF] bg-[#191924] px-2.5 py-1 rounded-md border border-zinc-800/40">$14.99</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#6366F1] group-hover:translate-x-1 transition-transform">Unlock Stems &rarr;</span>
              </div>
            </div>

          </div>
        </section>

        {/* ================= CAPABILITIES & FEATURES ================= */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-[#6366F1] font-black">Feature Matrix</h2>
            <h3 className="text-3xl font-black text-white">Full-Scale Sound Distribution</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#111118]/80 p-6 rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col justify-between gap-6 hover:border-zinc-700 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
                  <svg viewBox="0 0 24 24" width="22" height="22" className="fill-current">
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                  </svg>
                </div>
                <h4 className="text-base font-black text-white">Audio Showcase Deck</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed">
                  Streamlined, high-end visual grid designed specifically for sound designers. Sort beats instantly by pop, house, EDM, or hip-hop categories.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111118]/80 p-6 rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col justify-between gap-6 hover:border-zinc-700 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <svg viewBox="0 0 24 24" width="22" height="22" className="fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <h4 className="text-base font-black text-white">HTML5 Playback Engine</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed">
                  Preview any audio track with full-fidelity streaming. Track card visualizers synchronize and display responsive, active waveforms dynamically.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111118]/80 p-6 rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col justify-between gap-6 hover:border-zinc-700 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <svg viewBox="0 0 24 24" width="22" height="22" className="fill-current">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                </div>
                <h4 className="text-base font-black text-white">Persistent Licensing</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed">
                  Simulate checkouts safely. All license checkouts write directly to your PostgreSQL database, instantly unlocking collected beats on your profile tab.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================= STEP BY STEP TIMELINE ================= */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-[#6366F1] font-black">Workflow</h2>
            <h3 className="text-3xl font-black text-white">How It Works</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex gap-4 items-start relative group">
              <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-xs font-black text-[#6366F1] flex-shrink-0 z-10 group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-300">
                01
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-black text-white mt-1.5">Create Studio Account</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed mt-2">
                  Sign up as a Customer to establish your workspace credentials and initialize database entries.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start relative group">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs font-black text-purple-400 flex-shrink-0 z-10 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                02
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-black text-white mt-1.5">Showcase or Add Stems</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed mt-2">
                  Producers can upload MP3 audio streams directly to list new beats. Listeners can explore categories and fill their shopping carts.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start relative group">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-xs font-black text-pink-400 flex-shrink-0 z-10 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                03
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-black text-white mt-1.5">Acquire Studio Licenses</h4>
                <p className="text-xs text-[#8F9CAE] leading-relaxed mt-2">
                  Perform checkout processing simulation to write paid logs to database orders, instantly creating secure download tokens.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================= FINAL CALL TO ACTION ================= */}
        <section className="relative">
          <div className="absolute inset-0 bg-[#6366F1]/10 rounded-3xl blur-3xl pointer-events-none"></div>
          <div className="relative bg-[#111118] p-8 md:p-12 rounded-3xl border border-zinc-800/60 shadow-2xl flex flex-col items-center text-center gap-6 overflow-hidden">
            
            {/* Grid pattern highlight lines overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#191924_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight z-10">
              Ready to Upgrade Your Studio Sound?
            </h2>
            <p className="text-xs sm:text-sm text-[#8F9CAE] leading-relaxed max-w-lg z-10 font-medium">
              Join thousands of creators who license, publish, and review beats on a zero-overhead decentralized environment. Start listing your beats today.
            </p>
            <button
              onClick={() => setView('auth')}
              className="mt-2 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-10 py-4.5 rounded-xl transition-all duration-300 ease-out hover:opacity-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-[3px] cursor-pointer z-10"
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-6 border-t border-zinc-800/40 text-[10px] text-[#8F9CAE] font-bold uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
          <span>&copy; 2026 BeatSync Studio. All rights reserved.</span>
          <span>Powered by PostgreSQL & Node.js</span>
        </footer>

      </div>
    </div>
  );
}
