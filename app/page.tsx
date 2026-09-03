'use client';

import React, { useState, useEffect } from 'react';

export default function WidgetTester() {
  const [scriptInput, setScriptInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if there's a saved script on mount
    const saved = localStorage.getItem('frosty_test_script');
    if (saved) {
      setScriptInput(saved);
      setIsActive(true);
      injectScript(saved);
    }
  }, []);

  const injectScript = (htmlStr: string) => {
    try {
      const matchSrc = htmlStr.match(/src=["'](.*?)["']/);
      const dataRegex = /data-([a-zA-Z0-9-]+)=["'](.*?)["']/g;

      const dataset: Record<string, string> = {};
      let match;
      while ((match = dataRegex.exec(htmlStr)) !== null) {
        dataset[match[1]] = match[2];
      }

      if (!matchSrc) {
        setError('Could not find a valid src attribute in your script.');
        return;
      }

      const script = document.createElement('script');
      script.src = matchSrc[1];
      script.async = true;

      Object.keys(dataset).forEach((key) => {
        // Convert kebab-case (data-frosty-key) to camelCase (frostyKey) for the dataset API
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        script.dataset[camelKey] = dataset[key];
      });

      document.body.appendChild(script);
      setError('');
    } catch (e) {
      console.error('Failed to parse script', e);
      setError('Invalid script format. Please check your syntax.');
    }
  };

  const handleLoad = () => {
    if (!scriptInput.trim()) return;
    localStorage.setItem('frosty_test_script', scriptInput);
    // Reload to ensure a clean slate and perfectly clean DOM injection
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.removeItem('frosty_test_script');
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-fuchsia-500 selection:text-white">

      {/* LEFT PANEL: Controls (Glassmorphism) */}
      <div className="w-full md:w-1/3 lg:w-[400px] p-8 border-r border-white/10 bg-white/5 backdrop-blur-2xl z-10 flex flex-col shadow-2xl relative">

        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-fuchsia-500/20 blur-[100px] -z-10 pointer-events-none" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            Frosty Tester
          </h1>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Paste your HTML embed snippet below. We will dynamically mount it onto this mock website to preview its behavior.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
            Widget Script Tag
          </label>
          <textarea
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
            placeholder={'<script src="..." data-frosty-key="..."></script>'}
            className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all resize-none shadow-inner"
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleLoad}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-fuchsia-900/50 hover:shadow-fuchsia-900/80 active:scale-[0.98]"
            >
              {isActive ? 'Reload Widget' : 'Load Widget'}
            </button>

            {isActive && (
              <button
                onClick={handleClear}
                className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-all active:scale-[0.98]"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          Powered by Next.js & TailwindCSS
        </div>
      </div>

      {/* RIGHT PANEL: Mock Website Background */}
      <div className="flex-1 relative overflow-y-auto bg-gradient-to-br from-gray-900 via-[#111] to-black">
        {/* Subtle grid pattern for premium feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto p-12 relative z-0">
          <nav className="flex items-center justify-between py-6 border-b border-white/10 mb-16">
            <div className="text-xl font-bold tracking-wider">LUMIÈRE</div>
            <div className="flex gap-8 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Shop</span>
              <span className="hover:text-white cursor-pointer transition-colors">Collections</span>
              <span className="hover:text-white cursor-pointer transition-colors">About</span>
            </div>
          </nav>

          <header className="mb-24">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Elevate your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300">
                everyday style.
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
              Discover our latest collection of premium minimalist accessories designed for the modern professional.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-white/5 rounded-2xl mb-4 overflow-hidden border border-white/5 group-hover:border-white/20 transition-all relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-medium">Premium Item 0{item}</h3>
                <p className="text-gray-500">$129.00</p>
              </div>
            ))}
          </div>

          {/* Extra padding at bottom so scroll behavior can be tested against the widget */}
          <div className="h-64" />
        </div>
      </div>

    </div>
  );
}