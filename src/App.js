import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Shirt, 
  Github, 
  Twitter, 
  Mail, 
  ChevronRight,
  ShieldCheck,
  Cpu,
  Play,
  ExternalLink,
  Instagram,
  Disc,
  Headphones,
  ShoppingBag,
  ArrowRight,
  Star,
  Flame
} from 'lucide-react';

/**
 * Dopa-Tech Enhanced Website v2.0
 * Finalized Branding & Hierarchy:
 * 1. Dopa-Tech (Parent Organization)
 * 2. DEV NE-Thing (Research, Tech & Computational Systems)
 * 3. Hypnotic Productions (Music & Audio)
 * 4. Dopamine Clothing (Fashion & Apparel)
 */

const YOUTUBE_VIDEOS = [
  { id: 'Yiepm8r7OBg', title: 'Hypnotic Beats Vol. 1' },
  { id: '4GYL0yE7nRY', title: 'Sonic Journey' },
  { id: 'Kbw9h8QjaSE', title: 'Production Sessions' }
];

const CLOTHING_STORES = [
  {
    name: 'Dopamine Flow Energy',
    url: 'https://dopamine-flow-energy.creator-spring.com/',
    tagline: 'Wear Your Vibe',
    color: 'from-green-400 to-emerald-600'
  },
  {
    name: 'Nori Lamour',
    url: 'https://nori-lamour.creator-spring.com/',
    tagline: 'Elegance Meets Edge',
    color: 'from-pink-400 to-rose-600'
  }
];

const CLOTHING_IMAGES = [
  '/api/placeholder/400/500',
  '/api/placeholder/400/500',
  '/api/placeholder/400/500',
  '/api/placeholder/400/500'
];

// Floating particles component for wow factor
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: ['#00f0ff', '#ff0055', '#ccff00', '#bf00ff'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Glitch text effect component
const GlitchText = ({ text, className = '', size = 'normal' }) => {
  const fontSize = size === 'large' ? 'text-6xl' : size === 'xlarge' ? 'text-8xl' : 'text-xl';
  
  return (
    <div className={`relative inline-block ${className}`}>
      <span className={`relative z-10 ${fontSize} font-black tracking-tighter uppercase`}>
        {text}
      </span>
      <span className={`absolute top-0 left-0 -z-10 ${fontSize} font-black tracking-tighter uppercase text-cyan-400 opacity-50 animate-pulse translate-x-[2px] ${size === 'xlarge' ? 'hidden lg:inline' : ''}`}>
        {text}
      </span>
      <span className={`absolute top-0 left-0 -z-10 ${fontSize} font-black tracking-tighter uppercase text-pink-500 opacity-50 animate-pulse -translate-x-[2px] ${size === 'xlarge' ? 'hidden lg:inline' : ''}`}>
        {text}
      </span>
    </div>
  );
};

// Video card component
const VideoCard = ({ videoId, title, index }) => (
  <div className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]">
    <div className="aspect-video relative overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`${title} - Video`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white font-bold text-lg truncate">{title}</p>
        <p className="text-cyan-400 text-sm font-mono">Episode {index + 1}</p>
      </div>
      <div className="absolute top-4 right-4 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
        <Play size={16} className="text-white ml-1" />
      </div>
    </div>
  </div>
);

// Carousel component for clothing images
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-900/30 to-purple-900/30 border border-white/10">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentIndex 
                ? 'opacity-100 transform scale-100' 
                : `opacity-0 ${direction > 0 ? 'translate-x-full' : '-translate-x-full'}`
            }`}
          >
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center animate-pulse">
                  <ShoppingBag size={40} className="text-white" />
                </div>
                <p className="text-white/60 font-mono text-sm">Collection Item {index + 1}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-110"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-110"
        >
          <ArrowRight size={20} />
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-cyan-400 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Music section component
const MusicSection = () => {

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 mb-6">
            <Disc size={20} className="text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-pink-400 font-mono text-sm uppercase tracking-widest">Hypnotic Productions</span>
          </div>
          
          <GlitchText text="Sound Beyond Reality" size="xlarge" className="block mb-6" />
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Immersive audio experiences crafted with precision. From beat-driven rhythms to ambient soundscapes, 
            Hypnotic Productions delivers sonic journeys that captivate and inspire.
          </p>
        </div>

        {/* Spotify Embed */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            <div className="flex items-center gap-2 text-pink-400 font-mono uppercase tracking-widest">
              <Headphones size={16} />
              <span>Listen Now</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
          </div>
          
          <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-3xl p-1 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(236,72,153,0.3)]">
            <div className="rounded-2xl overflow-hidden bg-black/50">
              <iframe 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/artist/2JSwzULWMjHVovyhzadfiI?utm_source=generator&theme=0" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                title="Hypnotic Productions - Spotify Player"
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* YouTube Videos Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="flex items-center gap-2 text-cyan-400 font-mono uppercase tracking-widest">
              <Play size={16} />
              <span>Video Content</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {YOUTUBE_VIDEOS.map((video, index) => (
              <VideoCard key={video.id} {...video} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://open.spotify.com/artist/2JSwzULWMjHVovyhzadfiI?si=bczR4Mp9RKivj39iVcE9Zg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all duration-300 hover:scale-105 group"
          >
            <span>Follow on Spotify</span>
            <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Enhanced Clothing section component
const ClothingSection = () => {

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-orange-900/10 to-black pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30 mb-6 animate-pulse">
            <Flame size={20} className="text-orange-500" />
            <span className="text-orange-400 font-mono text-sm uppercase tracking-widest">Dopamine Clothing</span>
          </div>
          
          <GlitchText text="Wear Your Energy" size="xlarge" className="block mb-6" />
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Statement pieces designed by Rashad. Each garment tells a story of creativity, 
            passion, and the raw energy of dopamine-driven inspiration.
          </p>
        </div>

        {/* Video Advert Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <div className="flex items-center gap-2 text-orange-400 font-mono uppercase tracking-widest">
              <Play size={16} />
              <span>Latest Campaign</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          </div>
          
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-500">
            <div className="aspect-[9/16] max-w-sm mx-auto md:max-w-none">
              <iframe
                src="https://www.youtube.com/embed/7h1fsghp_F0"
                title="Dopamine Clothing Advert"
                className="w-full h-full object-cover rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <div className="flex items-center gap-2 text-yellow-400 font-mono uppercase tracking-widest">
              <Star size={16} />
              <span>Collection Preview</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          </div>
          
          <ImageCarousel images={CLOTHING_IMAGES} />
        </div>

        {/* Store Links */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <div className="flex items-center gap-2 text-green-400 font-mono uppercase tracking-widest">
              <ShoppingBag size={16} />
              <span>Shop Now</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CLOTHING_STORES.map((store, index) => (
              <a
                key={index}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${store.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                
                <div className="relative p-8 md:p-12 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${store.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <ShoppingBag size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{store.name}</h3>
                  <p className="text-gray-400 mb-6">{store.tagline}</p>
                  
                  <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${store.color} text-white font-bold group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300`}>
                    <span>Visit Store</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 hover:scale-110">
            <Instagram size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300 hover:scale-110">
            <Twitter size={20} />
          </a>
          <a href="mailto:richard@hypnoticproductions.tech" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-300 hover:scale-110">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

// Tech Section (Enhanced Research)
const TechSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-cyan-900/10 to-black pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 mb-6">
            <Cpu size={20} className="text-cyan-400" />
            <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest">DEV NE-Thing</span>
          </div>
          
          <GlitchText text="Computational Excellence" size="xlarge" className="block mb-6" />
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The technological backbone of the Dopa-Tech ecosystem. Responsible for music analysis frameworks, 
            platform architecture, and backend cultural research.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-3xl p-8 border border-cyan-500/30 mb-12 hover:border-cyan-400/50 transition-all duration-500">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              <span className="text-green-400 font-mono uppercase tracking-widest">System Online</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <a
              href="https://website-kappa-three-68.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 font-mono uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300"
            >
              <span>Access Research Portal</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Role Tags */}
        <div className="flex flex-wrap justify-center gap-4">
          {['Platform Architecture', 'Music Analysis', 'Research Ops', 'Backend Systems', 'Cultural Computing'].map((role, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 font-mono text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 cursor-default"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Simple section detection
      const sections = ['home', 'tech', 'music', 'clothing'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'tech', label: 'Research', icon: Cpu },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'clothing', label: 'Clothing', icon: Shirt }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Floating particles */}
      <FloatingParticles />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12 py-6 ${
        scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5' : ''
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-black font-black text-xl tracking-tighter">DT</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tighter uppercase leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Dopa-Tech
              </h1>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">Operational Infrastructure</p>
            </div>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                <span className="font-mono uppercase text-sm tracking-widest">{item.label}</span>
              </a>
            ))}
            
            <div className="h-6 w-px bg-white/10" />
            
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="hidden xl:inline">Secure Ecosystem</span>
            </div>
            
            <a 
              href="mailto:richard@hypnoticproductions.tech"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-black font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-105"
            >
              Inquiry
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <item.icon size={20} />
                <span className="font-mono uppercase tracking-widest">{item.label}</span>
              </a>
            ))}
            <a 
              href="mailto:richard@hypnoticproductions.tech"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-black font-bold uppercase tracking-widest"
            >
              <Mail size={18} />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/10 to-black" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Operational Since 2024</span>
          </div>
          
          <GlitchText text="DOPA-TECH" size="xlarge" className="block mb-6 animate-fade-in-up" />
          
          <p className="text-2xl md:text-3xl text-gray-400 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Where <span className="text-cyan-400">Technology</span> Meets <span className="text-pink-500">Rhythm</span> and <span className="text-orange-400">Style</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a 
              href="#music"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all duration-300 hover:scale-105"
            >
              <Music size={20} />
              <span>Explore Music</span>
            </a>
            <a 
              href="#clothing"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-white font-bold hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag size={20} />
              <span>View Collection</span>
            </a>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-gray-600 rotate-90" />
          </div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Tech Section */}
      <section id="tech">
        <TechSection />
      </section>

      {/* Music Section */}
      <section id="music">
        <MusicSection />
      </section>

      {/* Clothing Section */}
      <section id="clothing">
        <ClothingSection />
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/5 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-lg tracking-tighter">DT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tighter uppercase">Dopa-Tech</h3>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Operational Infrastructure</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://github.com/hypnoticproductions" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
              >
                <Github size={20} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
              >
                <Twitter size={20} />
                <span className="hidden sm:inline">Twitter</span>
              </a>
              <a 
                href="mailto:richard@hypnoticproductions.tech"
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
              >
                <Mail size={20} />
                <span className="hidden sm:inline">Contact</span>
              </a>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                © 2025 DOPA-TECH
              </p>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                ALL SYSTEMS OPERATIONAL
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" style={{ animationDelay: '0.6s' }}></span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-30px) translateX(5px);
            opacity: 0.5;
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
