import React, { useState } from 'react';
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
  Star
} from 'lucide-react';

/**
 * Dopa-Tech Parent Website
 * Original Design Preserved & Enhanced:
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

const DIVISIONS = [
  {
    id: 'research',
    entity: 'DEV NE-Thing',
    title: 'Research & Tech',
    subtitle: 'Computational Systems',
    description: 'The technological backbone of the Dopa-Tech ecosystem. Responsible for music analysis frameworks, platform architecture, and backend cultural research.',
    link: 'https://website-kappa-three-68.vercel.app',
    status: 'online',
    color: '#00f0ff',
    icon: Cpu,
    bgGradient: 'from-cyan-900/20 to-black',
    accentClass: 'group-hover:text-[#00f0ff]',
    roles: ['Platform Architecture', 'Music Analysis', 'Research Ops']
  },
  {
    id: 'music',
    entity: 'Hypnotic Productions',
    title: 'Music & Audio',
    subtitle: 'Sonic Experiences',
    description: 'Immersive soundscapes and beat-driven rhythms crafted to captivate. Experience audio that transcends boundaries and inspires movement.',
    link: null,
    status: 'online',
    color: '#ff0055',
    icon: Music,
    bgGradient: 'from-pink-900/20 to-black',
    accentClass: 'group-hover:text-[#ff0055]',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/2JSwzULWMjHVovyhzadfiI?utm_source=generator&theme=0',
    youtubeVideos: YOUTUBE_VIDEOS,
    roles: ['Sound Design', 'Beat Production', 'Audio Engineering']
  },
  {
    id: 'clothing',
    entity: 'Dopamine Clothing',
    title: 'Apparel & Design',
    subtitle: 'Visual Language by Rashad',
    description: 'A dedicated fashion line where all graphics and visual identities are created directly by Rashad, maintaining complete creative independence.',
    link: null,
    status: 'online',
    color: '#ff9500',
    icon: Shirt,
    bgGradient: 'from-orange-900/20 to-black',
    accentClass: 'group-hover:text-[#ff9500]',
    stores: CLOTHING_STORES,
    youtubeAd: '7h1fsghp_F0',
    roles: ['Independent Design', 'Textile Arts', 'Brand Identity']
  }
];

const StatusBadge = ({ status }) => {
  if (status === 'online') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-green-400">Active</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
      <span className="h-2 w-2 rounded-full bg-yellow-500/50"></span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-500/80">Deploying</span>
    </div>
  );
};

// Music content for the column
const MusicContent = ({ division }) => (
  <div className="space-y-6">
    {/* Spotify Embed */}
    <div className="rounded-xl overflow-hidden bg-black/50">
      <iframe
        src={division.spotifyEmbed}
        width="100"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: '12px', width: '100%', height: '152px' }}
      />
    </div>
    
    {/* YouTube Videos */}
    <div className="space-y-3">
      {division.youtubeVideos.map((video, index) => (
        <div key={video.id} className="group relative rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={`${video.title} - Video`}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
    
    {/* Spotify Link */}
    <a
      href="https://open.spotify.com/artist/2JSwzULWMjHVovyhzadfiI?si=bczR4Mp9RKivj39iVcE9Zg"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[#ff0055] transition-colors"
    >
      <span>Listen on Spotify</span>
      <ExternalLink size={12} />
    </a>
  </div>
);

// Clothing content for the column
const ClothingContent = ({ division }) => (
  <div className="space-y-6">
    {/* YouTube Advert */}
    <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10">
      <iframe
        src={`https://www.youtube.com/embed/${division.youtubeAd}`}
        title="Dopamine Clothing Advert"
        className="w-full aspect-[9/16] max-h-[200px] object-cover rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    
    {/* Store Links */}
    <div className="space-y-3">
      {division.stores.map((store, index) => (
        <a
          key={index}
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${store.color} flex items-center justify-center flex-shrink-0`}>
            <ShoppingBag size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-[#ff9500] transition-colors">{store.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{store.tagline}</p>
          </div>
          <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
        </a>
      ))}
    </div>
  </div>
);

const DivisionColumn = ({ division }) => {
  const Icon = division.icon;
  const isOnline = division.status === 'online';
  const hasContent = division.id === 'music' || division.id === 'clothing';
  const [showContent, setShowContent] = useState(false);
  const contentRef = React.useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useState(() => {
    if (showContent && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [showContent]);

  return (
    <div
      className={`relative flex-1 group min-h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 transition-all duration-700 ease-in-out flex flex-col ${
        hasContent && showContent ? 'lg:flex-[2]' : 'hover:lg:flex-[1.3]'
      }`}
    >
      {/* Background Layer */}
      <div className={`absolute inset-0 bg-gradient-to-t ${division.bgGradient} transition-opacity duration-500 opacity-40 ${hasContent && showContent ? 'lg:opacity-80' : 'group-hover:lg:opacity-100'}`} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(${division.color} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Content */}
      <div className="relative z-10 transform transition-transform duration-500 p-8 lg:p-12 flex flex-col h-full">
        <div className="flex-shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 block mb-2">{division.entity}</span>
          <div className={`inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors duration-500 ${division.accentClass}`}>
            <Icon size={32} strokeWidth={1.5} />
          </div>
          
          <StatusBadge status={division.status} />
          
          <h2 className="text-4xl lg:text-5xl font-bold mt-6 tracking-tight text-[#ededed]">
            {division.title}
          </h2>
          
          <p className={`text-xl font-medium mt-2 transition-colors duration-500 ${division.accentClass}`}>
            {division.subtitle}
          </p>
          
          <p className="text-gray-400 mt-4 max-w-md leading-relaxed text-sm lg:text-base">
            {division.description}
          </p>

          {/* Roles list */}
          <div className="mt-4 flex flex-wrap gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            {division.roles.map((role, i) => (
              <span key={i} className="text-[9px] font-mono border border-white/10 px-2 py-0.5 rounded">
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Content for Music and Clothing */}
        {hasContent && (
          <div 
            className="flex-1 overflow-hidden transition-all duration-500 ease-in-out mt-6"
            style={{ 
              maxHeight: showContent ? `${contentHeight + 20}px` : '0px',
              opacity: showContent ? 1 : 0
            }}
          >
            <div ref={contentRef}>
              {division.id === 'music' && <MusicContent division={division} />}
              {division.id === 'clothing' && <ClothingContent division={division} />}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex-shrink-0 mt-auto pt-6">
          {hasContent ? (
            <button
              onClick={() => setShowContent(!showContent)}
              className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-all duration-500"
            >
              <span>{showContent ? 'Collapse' : 'Explore'}</span>
              <ChevronRight size={16} className={`transition-transform duration-300 ${showContent ? 'rotate-90' : ''}`} />
            </button>
          ) : isOnline && division.link ? (
            <a
              href={division.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-all duration-500"
            >
              <span>Access Portal</span>
              <ChevronRight size={16} />
            </a>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-1 transition-all duration-700 group-hover:w-full"
           style={{ backgroundColor: division.color }} />
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12 py-6 flex justify-between items-center ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg">
             <span className="text-black font-black text-xl tracking-tighter">DT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase leading-none">Dopa-Tech</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">Operational Infrastructure</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500">
            <ShieldCheck size={14} className="text-green-500" />
            <span>Secure Ecosystem</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <a href="mailto:richard@hypnoticproductions.tech" className="text-xs font-mono uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
            Inquiry
          </a>
        </div>
      </nav>

      {/* Main Triptych Layout */}
      <main className="flex flex-col lg:flex-row pt-24 lg:pt-0">
        {DIVISIONS.map((division) => (
          <DivisionColumn key={division.id} division={division} />
        ))}
      </main>

      {/* Footer */}
      <footer className="relative lg:fixed bottom-0 left-0 right-0 z-40 p-6 lg:p-12 pointer-events-none">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
          <div className="flex gap-6 pointer-events-auto">
            <a href="https://github.com/hypnoticproductions" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="mailto:richard@hypnoticproductions.tech" className="text-gray-500 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
          
          <div className="text-right pointer-events-auto">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              © 2025 DOPA-TECH. ALL SYSTEMS OPERATIONAL.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
              <span className="w-1 h-1 rounded-full bg-pink-500"></span>
              <span className="w-1 h-1 rounded-full bg-orange-500"></span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
