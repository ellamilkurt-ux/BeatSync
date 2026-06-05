import React, { useState } from 'react';

export default function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    console.log(`[Auth] Submitting ${isLogin ? 'Login' : 'Registration'} for:`, { email, username });
    
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
      ? { email, password }
      : { username, email, password, role };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      console.log('[Auth] Success:', data);
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      console.error('[Auth] Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 py-8 animate-fade-in relative select-none z-10">
      
      {/* Decorative ambient glowing spot (solid color, no gradients) */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-[#6366F1]/5 blur-[120px] pointer-events-none z-0"></div>

      {/* Dual Column Layout Card */}
      <div className="w-full max-w-4xl bg-[#111118] rounded-3xl border border-zinc-800/80 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12 z-10 relative">
        
        {/* Left Column: Premium Feature Showcase Panel (Only visible on large screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#161622]/50 p-8 border-r border-zinc-800/60 flex-col justify-between relative">
          
          {/* Subtle line mesh pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1c2b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
          
          <div className="flex flex-col gap-6 relative z-10 text-left">
            <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-[9px] font-black uppercase tracking-widest">
              BeatSync Studio Vault
            </div>
            
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
              Enter The <br />
              <span className="text-[#6366F1]">Sound Grid</span>
            </h3>
            
            <p className="text-xs text-[#8F9CAE] leading-relaxed">
              Log in to license custom stems, publish project catalogs, or interact with independent sound designers.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white">Instant Previewing</span>
                  <span className="text-[9px] text-[#8F9CAE] mt-0.5">Preview full MP3 stems at zero latency.</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white">Catalog Tracking</span>
                  <span className="text-[9px] text-[#8F9CAE] mt-0.5">Filter tracks by genre dynamically.</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white">Safe Sandbox Checkout</span>
                  <span className="text-[9px] text-[#8F9CAE] mt-0.5">Acquire persistent licenses securely.</span>
                </div>
              </div>

            </div>
          </div>

          <div className="text-[9px] uppercase tracking-wider text-[#8F9CAE]/40 font-bold z-10 text-left">
            BeatSync License V1.2
          </div>
        </div>

        {/* Right Column: Authentication Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <h2 className="text-2xl font-black tracking-tight text-[#FFFFFF] mb-2 text-center lg:text-left">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#8F9CAE] mb-6 text-center lg:text-left">
            {isLogin ? 'Access your personal catalog and collected beats.' : 'Register as a customer to start trading.'}
          </p>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Username (Registration only) */}
            {!isLogin && (
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="username" className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="producer_one"
                  className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20 disabled:opacity-50"
                />
              </div>
            )}



            {/* Email */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="email" className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="password" className="text-[9px] font-bold text-[#8F9CAE] uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#191924] text-[#FFFFFF] text-xs px-4 py-3 rounded-lg border border-zinc-800/60 outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder-[#8F9CAE]/20 disabled:opacity-50"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center text-[10px] text-[#8F9CAE] uppercase tracking-wider font-semibold">
            <span>
              {isLogin ? "New to the platform?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#FFFFFF] hover:text-[#6366F1] font-extrabold hover:underline cursor-pointer"
            >
              {isLogin ? 'Register here' : 'Sign In instead'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
