import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Music, 
  Shirt, 
  ExternalLink, 
  ChevronRight, 
  Play, 
  ShoppingBag, 
  Globe, 
  Github, 
  Mail, 
  Instagram,
  ArrowLeft,
  Volume2,
  Sparkles,
  Layers,
  Zap,
  Activity
} from 'lucide-react';

/**
 * DOPA-TECH GLOBAL HUB - PHYSICS & ANIMATION ENHANCED
 * A high-impact, multi-tabbed experience with 3D parallax and floating physics.
 */

// Custom Hook for Mouse Position Tracking (Physics Engine Lite)
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mousePosition;
};

// 3D Tilt Component for Physics Manipulation
const TiltCard = ({ children, className = "", intensity = 15 }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const mouse = useMousePosition();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigateTo = (tab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab(tab);
  };

  // --- SUB-COMPONENTS ---

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigateTo('home')}
      >
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-md group-hover:rotate-[360deg] transition-transform duration-700">
          <span className="text-black font-black text-sm">DT</span>
        </div>
        <span className="font-bold tracking-tighter text-xl uppercase group-hover:tracking-[0.2em] transition-all duration-500">Dopa-Tech</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => navigateTo('home')} className={`text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'home' ? 'text-white border-b border-white' : 'text-gray-500 hover:text-white'}`}>Central</button>
        <button onClick={() => navigateTo('music')} className={`text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'music' ? 'text-white border-b border-purple-500' : 'text-gray-500 hover:text-white'}`}>Music</button>
        <button onClick={() => navigateTo('clothing')} className={`text-xs font-mono uppercase tracking-widest transition-all ${activeTab === 'clothing' ? 'text-white border-b border-orange-500' : 'text-gray-500 hover:text-white'}`}>Clothing</button>
        <a href="https://website-kappa-three-68.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs font-mono uppercase tracking-widest text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
          Research <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-24 space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-[0.4em] uppercase text-gray-400 mb-4 animate-bounce">
          <Activity size={12} className="text-cyan-500" /> System Integrity Validated
        </div>
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent leading-none">
          DOPA-TECH
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed font-light">
          Architecture for the <span className="text-white font-medium italic">flow state</span>. 
          A multi-divisional node converging technology, rhythm, and visual identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Research Portal */}
        <TiltCard intensity={10}>
          <div 
            onClick={() => window.open('https://website-kappa-three-68.vercel.app', '_blank')}
            className="group relative h-[500px] rounded-[2rem] overflow-hidden border border-white/10 cursor-pointer bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-transparent to-black" />
            <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
              <Cpu className="text-cyan-400 mb-6 group-hover:rotate-90 transition-transform duration-700" size={48} />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-500/80 mb-2">Node: 01</h3>
              <h2 className="text-4xl font-bold mb-4 tracking-tighter">DEV NE-Thing</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Computational frameworks and music analysis research.</p>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Launch Environment <Zap size={12} className="animate-pulse" />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Music Portal */}
        <TiltCard intensity={10}>
          <div 
            onClick={() => navigateTo('music')}
            className="group relative h-[500px] rounded-[2rem] overflow-hidden border border-white/10 cursor-pointer bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-transparent to-black" />
            <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
              <Music className="text-purple-400 mb-6 group-hover:scale-125 transition-transform duration-500" size={48} />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.5em] text-purple-500/80 mb-2">Node: 02</h3>
              <h2 className="text-4xl font-bold mb-4 tracking-tighter">Hypnotic Pro.</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Auditory expressions and high-fidelity production labs.</p>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-purple-400">
                Enter Studio <Play size={12} fill="currentColor" />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Clothing Portal */}
        <TiltCard intensity={10}>
          <div 
            onClick={() => navigateTo('clothing')}
            className="group relative h-[500px] rounded-[2rem] overflow-hidden border border-white/10 cursor-pointer bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-transparent to-black" />
            <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
              <Shirt className="text-orange-400 mb-6 group-hover:-translate-y-2 transition-transform duration-500" size={48} />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.5em] text-orange-500/80 mb-2">Node: 03</h3>
              <h2 className="text-4xl font-bold mb-4 tracking-tighter">Dopamine Clothing</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Visual identities and independent apparel by Rashad.</p>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-orange-400">
                Open Lookbook <ShoppingBag size={12} />
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );

  const MusicView = () => (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <button 
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-all hover:gap-4 mb-12 text-xs font-mono uppercase tracking-[0.3em]"
      >
        <ArrowLeft size={16} /> Return to Hub
      </button>

      <div className="flex flex-col lg:flex-row gap-16 mb-32 items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-[10px] font-mono uppercase tracking-widest">
            <Volume2 size={12} className="animate-pulse" /> Active Broadcaster
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">HYPNOTIC<br/><span className="text-purple-500 italic">PRODUCTIONS</span></h1>
          <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl">
            Experience our auditory catalog. A synthesis of algorithmic research and raw emotional resonance.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href="https://open.spotify.com/artist/2JSwzULWMjHVovyhzadfiI?si=bczR4Mp9RKivj39iVcE9Zg" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 px-10 py-5 bg-[#1DB954] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">LISTEN ON SPOTIFY <ExternalLink size={16} /></span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
          </div>
        </div>
        
        <TiltCard intensity={20} className="flex-1 w-full max-w-xl">
          <div className="aspect-square bg-white/5 border border-white/10 rounded-[3rem] p-12 flex items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative text-center space-y-6">
               <div className="w-64 h-64 bg-purple-600 rounded-3xl mx-auto shadow-[0_0_80px_rgba(168,85,247,0.4)] flex items-center justify-center animate-pulse">
                  <Music size={120} className="text-white" />
               </div>
               <div className="space-y-2">
                 <h4 className="text-2xl font-bold">Catalog Stream</h4>
                 <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.5em]">2JSwzULWMjHVovyhzadfiI</p>
               </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Enhanced YouTube Section with Physics */}
      <div className="space-y-16">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black tracking-tighter border-l-8 border-purple-500 pl-6 uppercase">Visual Resonance</h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Atmospheric R&D</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { id: 'Yiepm8r7OBg', title: 'Sonic Framework 01', color: 'cyan' },
            { id: '4GYL0yE7nRY', title: 'Atmospheric Research', color: 'purple' },
            { id: 'Kbw9h8QjaSE', title: 'System Pulse', color: 'orange' }
          ].map((vid, idx) => (
            <TiltCard key={vid.id} intensity={15}>
              <div className="group relative rounded-3xl overflow-hidden aspect-video bg-black border border-white/10 hover:border-purple-500/50 transition-colors shadow-2xl">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${vid.id}?modestbranding=1&rel=0`} 
                  title={vid.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                ></iframe>
                <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono bg-black/80 px-2 py-1 rounded text-purple-400">REF: {vid.id}</span>
                </div>
              </div>
              <h4 className="mt-4 font-mono text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                {vid.title}
              </h4>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );

  const ClothingView = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const pictures = [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200"
    ];

    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-all hover:gap-4 mb-12 text-xs font-mono uppercase tracking-[0.3em]"
        >
          <ArrowLeft size={16} /> Return to Hub
        </button>

        <div className="flex flex-col lg:flex-row gap-20 mb-32 items-center">
          <div className="flex-1 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-[10px] font-mono uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" /> Artisan Workflow
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">DOPAMINE<br/><span className="text-orange-500 italic">CLOTHING</span></h1>
            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl">
              Tangible expressions of the flow state. All designs created directly by <span className="text-white font-medium">Rashad</span>, 
              focusing on pure aesthetic frequency and independent textile arts.
            </p>
            
            <div className="space-y-6 pt-6">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-gray-500">Global Storefronts</h4>
              <div className="flex flex-wrap gap-6">
                <a 
                  href="https://dopamine-flow-energy.creator-spring.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-8 py-5 bg-white text-black font-black rounded-2xl transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <ShoppingBag size={20} /> FLOW ENERGY STORE
                </a>
                <a 
                  href="https://nori-lamour.creator-spring.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-8 py-5 bg-orange-600 text-white font-black rounded-2xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-orange-600/20"
                >
                  <ShoppingBag size={20} /> NORI L'AMOUR
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <TiltCard intensity={15}>
              <div className="relative rounded-[3rem] overflow-hidden aspect-[9/16] max-w-[360px] mx-auto border-4 border-white/5 bg-black shadow-[0_50px_100px_rgba(255,51,0,0.2)]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/7h1fsghp_F0?modestbranding=1&autoplay=1&mute=1&loop=1&playlist=7h1fsghp_F0" 
                  title="Dopamine Ad"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none">
                  <p className="text-xl font-black tracking-tight uppercase">Campaign 2025</p>
                  <p className="text-[10px] text-orange-400 font-mono tracking-widest uppercase mt-1">Art Directed by Rashad</p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Dynamic Carousel with Parallax */}
        <div className="space-y-16">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black tracking-tighter border-l-8 border-orange-500 pl-6 uppercase">The Lookbook</h2>
            <div className="flex gap-4">
               {pictures.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-16 bg-orange-500' : 'w-6 bg-white/10 hover:bg-white/30'}`}
                  />
                ))}
            </div>
          </div>
          
          <div className="relative h-[700px] rounded-[3rem] overflow-hidden group shadow-2xl">
            <img 
              src={pictures[currentSlide]} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              alt="Clothing Showcase"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-12 inset-x-12 flex justify-between items-end">
              <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                <p className="text-xs font-mono text-orange-400 uppercase tracking-[0.4em] mb-2">Visual Artifact</p>
                <h4 className="text-5xl font-black uppercase tracking-tighter">The Archetype Flow</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FooterView = () => (
    <footer className="py-24 px-6 border-t border-white/5 bg-black relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl shadow-lg shadow-white/10">
              <span className="text-black font-black text-lg">DT</span>
            </div>
            <span className="font-black tracking-tighter text-2xl uppercase">Dopa-Tech</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-light">
            Building the next generation of cultural and computational infrastructure.
            An integrated ecosystem for research, music, and design.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">The Nodes</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="hover:text-cyan-400 cursor-pointer flex items-center gap-2 group transition-all" onClick={() => window.open('https://website-kappa-three-68.vercel.app', '_blank')}>
              <Cpu size={14} className="group-hover:rotate-45 transition-transform" /> Research Hub
            </li>
            <li className="hover:text-purple-400 cursor-pointer flex items-center gap-2 group transition-all" onClick={() => navigateTo('music')}>
              <Music size={14} className="group-hover:scale-110 transition-transform" /> Music Portfolio
            </li>
            <li className="hover:text-orange-400 cursor-pointer flex items-center gap-2 group transition-all" onClick={() => navigateTo('clothing')}>
              <Shirt size={14} className="group-hover:-translate-y-1 transition-transform" /> Independent Apparel
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">System</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="hover:text-white transition-colors cursor-pointer">Protocol: IP</li>
            <li className="hover:text-white transition-colors cursor-pointer">Security: End-to-End</li>
            <li className="hover:text-white transition-colors cursor-pointer">Status: Optimal</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">Connectivity</h4>
          <div className="flex gap-6">
            <a href="https://github.com/hypnoticproductions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform hover:-translate-y-2"><Github size={24} /></a>
            <a href="mailto:richard@hypnoticproductions.tech" className="text-gray-400 hover:text-white transition-transform hover:-translate-y-2"><Mail size={24} /></a>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
             <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-loose">
               Auth Token: 98eaec.png<br/>
               Location: 3.04PM AST<br/>
               Status: OPERATIONAL
             </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest leading-relaxed text-center md:text-left">
          © 2025 DOPA-TECH INFRASTRUCTURE GMBH. ALL SYSTEMS SYNCED.
        </p>
        <div className="flex gap-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Research</span>
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Rhythm</span>
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Reflection</span>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] font-sans overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Dynamic Physics Background (Cursor Tracker) */}
      <div 
        className="fixed pointer-events-none z-0 transition-all duration-300"
        style={{
          left: mouse.x,
          top: mouse.y,
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${activeTab === 'home' ? 'rgba(6, 182, 212, 0.08)' : activeTab === 'music' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(249, 115, 22, 0.08)'} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}
      />

      {/* Floating Particles (Static simulation) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
         <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-white rounded-full animate-ping" />
         <div className="absolute top-[70%] left-[30%] w-1 h-1 bg-white rounded-full animate-pulse delay-500" />
      </div>

      <Navbar />

      {/* View Logic with Entry Animations */}
      <div className="relative z-10">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'music' && <MusicView />}
        {activeTab === 'clothing' && <ClothingView />}
      </div>

      <FooterView />

      {/* Subtle Technical Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      {/* Global Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default App;
