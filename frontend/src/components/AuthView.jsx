import React, { useState } from 'react';

export default function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      : { username, email, password, role: 'viewer' };

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
    <div className="flex flex-col min-h-[calc(100vh-6rem)] justify-center items-center px-6 py-12 animate-fade-in bg-[#06060A]">
      {/* Form Card (Elevated Panel #111118, 16px rounded-2xl border border-zinc-800/40) */}
      <div className="w-full max-w-md bg-[#111118] p-8 rounded-2xl border border-zinc-800/40 flex flex-col shadow-2xl">
        <h2 className="text-2xl font-black tracking-tight text-[#FFFFFF] mb-6 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username (Registration only) */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider">
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

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#6366F1] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
