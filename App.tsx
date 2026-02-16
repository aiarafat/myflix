import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Info, 
  Search, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LayoutDashboard, 
  Film, 
  Users, 
  BarChart3, 
  LogOut, 
  Plus, 
  Shield, 
  X,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  Crown,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Share2,
  Video,
  Loader2,
  Volume2,
  VolumeX,
  Pause,
  Edit2,
  Camera,
  Save,
  Check,
  Languages,
  Eye,
  Trash2,
  MessageSquare,
  Send
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { 
  getMovies, 
  getUsers, 
  getSettings, 
  getAnalytics, 
  login, 
  addMovie, 
  updateMovie,
  deleteMovie,
  fetchMockTMDBData, 
  updateUser, 
  saveSettings,
  getNotifications,
  addNotification,
  markNotificationRead
} from './services/mockStore';
import { Movie, User, AppSettings, AnalyticsData, Role, AppNotification } from './types';

// --- Improved Components ---

const SidebarLink = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
  </div>
);

const SkeletonCard = () => (
  <div className="w-[200px] md:w-[280px] aspect-video bg-white/5 rounded-md animate-pulse flex-none border border-white/5 shadow-sm" />
);

const SkeletonRow = () => (
  <div className="mb-8 md:mb-12 px-4 md:px-12 z-20 relative">
    <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-4" />
    <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);

const TrailerModal = ({ url, onClose }: { url: string, onClose: () => void }) => (
  <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/20" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-black/50 rounded-full p-2 transition-colors">
            <X size={24} />
         </button>
         <iframe 
            src={`${url}?autoplay=1`} 
            className="w-full h-full" 
            title="Trailer"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
         />
    </div>
  </div>
);

const Footer = () => {
  return (
    <footer className="w-full bg-black/20 pt-16 pb-8 border-t border-white/5 relative z-20 mt-12">
      <div className="max-w-5xl mx-auto px-4 md:px-12 text-gray-400">
        <div className="flex items-center gap-6 mb-8">
          <Facebook className="w-6 h-6 cursor-pointer hover:text-white transition" />
          <Instagram className="w-6 h-6 cursor-pointer hover:text-white transition" />
          <Twitter className="w-6 h-6 cursor-pointer hover:text-white transition" />
          <Youtube className="w-6 h-6 cursor-pointer hover:text-white transition" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-[13px] mb-8">
          <a href="#" className="hover:underline hover:text-gray-300">Audio Description</a>
          <a href="#" className="hover:underline hover:text-gray-300">Help Center</a>
          <a href="#" className="hover:underline hover:text-gray-300">Gift Cards</a>
          <a href="#" className="hover:underline hover:text-gray-300">Media Center</a>
          <a href="#" className="hover:underline hover:text-gray-300">Investor Relations</a>
          <a href="#" className="hover:underline hover:text-gray-300">Jobs</a>
          <a href="#" className="hover:underline hover:text-gray-300">Terms of Use</a>
          <a href="#" className="hover:underline hover:text-gray-300">Privacy</a>
          <a href="#" className="hover:underline hover:text-gray-300">Legal Notices</a>
          <a href="#" className="hover:underline hover:text-gray-300">Cookie Preferences</a>
          <a href="#" className="hover:underline hover:text-gray-300">Corporate Information</a>
          <a href="#" className="hover:underline hover:text-gray-300">Contact Us</a>
        </div>

        <button className="border border-gray-400 px-4 py-1.5 hover:text-white hover:border-white mb-6 text-[13px] transition">
          Service Code
        </button>

        <div className="text-[11px] text-gray-500">
          © 2024 MyFlix, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  onTrailer: (url: string) => void;
  onShare: (movie: Movie) => void;
  isLarge?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onTrailer, onShare, isLarge = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate a fake view count based on ID and Rating to remain consistent across renders
  const views = Math.floor(movie.rating * 150000 + movie.id * 12345);
  const formattedViews = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(views);

  return (
    <div 
      onClick={onClick}
      className={`group relative flex-none rounded-md overflow-hidden cursor-pointer transition-all duration-500 ease-in-out hover:z-30 hover:scale-105 hover:shadow-2xl hover:shadow-black/80 bg-gray-900 ${isLarge ? 'w-[160px] md:w-[220px] aspect-[2/3]' : 'w-[200px] md:w-[280px] aspect-video'}`}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-0">
          <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
        </div>
      )}
      <img 
        src={isLarge ? movie.posterPath : (movie.backdropPath || movie.posterPath)} 
        alt={movie.title} 
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover rounded-md group-hover:brightness-75 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Premium Badge - Icon Only */}
      {movie.isPremium && (
        <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-yellow-500/30 shadow-lg">
          <Crown size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
           
           {/* Genre Badges */}
           <div className="flex flex-wrap gap-1 mb-2">
             {movie.genres.slice(0, 3).map(g => (
               <span key={g} className="text-[8px] font-semibold bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/10">
                 {g}
               </span>
             ))}
           </div>

           <h3 className="text-white font-bold text-sm md:text-base drop-shadow-md line-clamp-1 mb-3">{movie.title}</h3>

           {/* Buttons */}
           <div className="flex items-center gap-3 mb-3">
             <button 
                title="Play"
                className="bg-white text-black rounded-full p-2.5 hover:bg-gray-200 transition hover:scale-110 shadow-lg"
             >
               <Play size={16} fill="black" />
             </button>
             
             {movie.trailerUrl && (
                <button 
                  title="Watch Trailer"
                  onClick={(e) => { e.stopPropagation(); onTrailer(movie.trailerUrl!); }}
                  className="bg-black/40 text-white rounded-full p-2.5 border border-white/50 hover:border-white hover:bg-white/20 transition hover:scale-110 backdrop-blur-sm"
                >
                  <Video size={16} />
                </button>
             )}

             <button 
                title="Add to List"
                onClick={(e) => e.stopPropagation()}
                className="bg-black/40 text-gray-300 rounded-full p-2.5 border border-gray-500 hover:border-white hover:text-white transition hover:scale-110 hover:bg-white/20 backdrop-blur-sm"
             >
               <Plus size={16} />
             </button>
             
             <button 
                title="Like"
                onClick={(e) => e.stopPropagation()}
                className="bg-black/40 text-gray-300 rounded-full p-2.5 border border-gray-500 hover:border-white hover:text-white transition hover:scale-110 hover:bg-white/20 backdrop-blur-sm ml-auto"
             >
               <ThumbsUp size={16} />
             </button>
           </div>

           {/* Views / Year / HD */}
           <div className="flex items-center justify-between text-[10px] font-semibold text-gray-300">
            <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold flex items-center gap-1">
                   <Eye size={10} /> {formattedViews} Views
                </span>
                <span className="text-white">{movie.year}</span>
            </div>
            <span className="border border-white/40 px-1 rounded text-white/80">HD</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ 
  user, 
  movies,
  onLogout, 
  onAdminClick, 
  onPlay,
  onProfileClick
}: { 
  user: User, 
  movies: Movie[],
  onLogout: () => void, 
  onAdminClick: () => void, 
  onPlay: (m: Movie) => void,
  onProfileClick: () => void
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
     // Poll for notifications
     const interval = setInterval(() => {
        const all = getNotifications();
        const myNotifs = all.filter(n => n.targetUser === 'all' || n.targetUser === user.uid);
        setNotifications(myNotifs);
     }, 2000);
     return () => clearInterval(interval);
  }, [user.uid]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCloseSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length > 0) {
      const lowerVal = val.toLowerCase();
      const matches = movies.filter(m => 
        m.title.toLowerCase().includes(lowerVal) ||
        m.genres.some(g => g.toLowerCase().includes(lowerVal)) ||
        m.year.toString().includes(lowerVal)
      );
      setSuggestions(matches.slice(0, 5)); // Limit to top 5 matches
    } else {
      setSuggestions([]);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-brand-dark/95 backdrop-blur-sm shadow-xl' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-brand-red text-3xl font-bold tracking-tighter cursor-pointer scale-95 hover:scale-105 transition" onClick={handleCloseSearch}>MyFlix</h1>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <button className="hover:text-white transition font-normal">Home</button>
            <button className="hover:text-white transition font-normal">TV Shows</button>
            <button className="hover:text-white transition font-normal">Movies</button>
            <button className="hover:text-white transition font-normal">New & Popular</button>
            <button className="hover:text-white transition font-normal">My List</button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Search Bar Container */}
          <div className="relative">
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-black/80 border border-white/50 px-2 py-1' : 'border border-transparent'}`}>
              <Search 
                className="w-5 h-5 text-gray-200 cursor-pointer hover:text-white" 
                onClick={handleSearchClick}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Titles, people, genres"
                className={`bg-transparent border-none outline-none text-white text-sm ml-2 transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 opacity-100' : 'w-0 opacity-0'}`}
                value={query}
                onChange={handleInputChange}
                onBlur={() => {
                   // Delay closing so click on suggestion registers
                   setTimeout(() => {
                     if (!query) setIsSearchOpen(false);
                   }, 200);
                }}
              />
              {isSearchOpen && query && (
                 <X size={16} className="text-gray-400 hover:text-white cursor-pointer ml-1" onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }} />
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 shadow-2xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="py-1">
                  {suggestions.map((movie) => (
                    <div 
                      key={movie.id}
                      onClick={() => {
                        onPlay(movie);
                        handleCloseSearch();
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <img 
                        src={movie.backdropPath || movie.posterPath} 
                        alt={movie.title} 
                        className="w-16 h-9 object-cover rounded bg-neutral-800"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-white truncate">{movie.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span>{movie.year}</span>
                          {movie.genres[0] && <span>• {movie.genres[0]}</span>}
                          {movie.isPremium && <Crown size={10} className="text-yellow-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results State */}
            {isSearchOpen && query && suggestions.length === 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 shadow-2xl rounded-md p-4 text-center z-50">
                  <span className="text-xs text-gray-400">No results found for "{query}"</span>
               </div>
            )}
          </div>

          <div className="relative group">
             <div className="cursor-pointer" onClick={() => setShowNotifs(!showNotifs)}>
                <Bell className="w-5 h-5 text-gray-200 hover:text-white" />
                {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
                )}
             </div>
             
             {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-black/95 border border-white/10 rounded-md shadow-2xl p-0 overflow-hidden z-50">
                   <div className="p-3 border-b border-white/10 font-bold text-sm bg-white/5">Notifications</div>
                   <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-xs">No notifications</div>
                      ) : (
                        notifications.map(n => (
                           <div 
                              key={n.id} 
                              className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer ${n.read ? 'opacity-50' : 'opacity-100'}`}
                              onClick={() => { markNotificationRead(n.id); }}
                           >
                              <div className="font-bold text-xs text-brand-red mb-1">{n.title}</div>
                              <div className="text-xs text-gray-300">{n.message}</div>
                              <div className="text-[10px] text-gray-500 mt-1">{new Date(n.date).toLocaleDateString()}</div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
             )}
          </div>
          
          <div className="group relative">
            <div className="flex items-center gap-2 cursor-pointer">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-md object-cover border border-white/20 group-hover:border-white transition" 
              />
              <div className="text-[10px] bg-white text-black px-1 rounded hidden md:block group-hover:bg-gray-200">▼</div>
            </div>
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 border border-white/10 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-md overflow-hidden">
               <div className="py-2 px-3 text-xs text-gray-400 border-b border-white/10 mb-1">
                 Signed in as <span className="text-white block truncate">{user.email}</span>
               </div>
              <div className="p-1 flex flex-col gap-0.5">
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <button onClick={onAdminClick} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition">
                    <LayoutDashboard size={16} /> Admin Panel
                  </button>
                )}
                <button 
                  onClick={onProfileClick}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
                >
                  <UserIcon size={16} /> Account
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded transition">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- HomePage Components ---

const Billboard = ({ movie, onPlay }: { movie: Movie, onPlay: () => void }) => {
  // Generate a fake view count based on ID and Rating to remain consistent
  const views = Math.floor(movie.rating * 150000 + movie.id * 12345);
  const formattedViews = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(views);

  return (
    <div className="relative h-[85vh] w-full mb-8">
      <div className="absolute inset-0">
        <img 
          src={movie.backdropPath} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
      </div>
      
      <div className="absolute bottom-[35%] left-0 px-4 md:px-12 w-full md:w-2/3 lg:w-1/2 flex flex-col gap-5 animate-fade-in-up z-20">
        {/* Animated Title Simulation */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl tracking-tight leading-none">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
           <span className="text-green-400 font-black flex items-center gap-1">
             <Eye size={16} /> {formattedViews} Views
           </span>
           <span>{movie.year}</span>
           <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs">HD</span>
           {movie.isPremium && <span className="bg-brand-red text-white px-2 py-0.5 rounded text-xs flex items-center gap-1"><Crown size={10} fill="white"/> PREMIUM</span>}
        </div>

        <p className="text-base md:text-lg text-gray-200 drop-shadow-md line-clamp-3 font-medium max-w-xl">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={onPlay}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-gray-300 transition active:scale-95"
          >
            <Play fill="black" size={24} /> Play
          </button>
          <button className="flex items-center gap-2 bg-gray-500/40 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-500/30 backdrop-blur-sm transition active:scale-95">
            <Info size={24} /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (m: Movie) => void;
  onTrailer: (url: string) => void;
  onShare: (movie: Movie) => void;
  isLarge?: boolean;
}

const MovieRow = ({ title, movies, onPlay, onTrailer, onShare, isLarge = false }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      // Increased scroll speed by scrolling a larger portion of the width (0.8 instead of 0.5)
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 relative group px-4 md:px-12 z-20">
      <h2 className="text-lg md:text-2xl font-bold text-gray-100 mb-3 md:mb-4 group-hover:text-white transition">{title}</h2>
      
      <div className="group/row relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-all cursor-pointer rounded-r-md hidden md:flex"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto pb-8 pt-4 scrollbar-hide -ml-4 md:-ml-0 px-4 md:px-0 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(m => (
            <MovieCard 
              key={m.id} 
              movie={m} 
              onClick={() => onPlay(m)} 
              onTrailer={onTrailer}
              onShare={onShare}
              isLarge={isLarge} 
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-all cursor-pointer rounded-l-md hidden md:flex"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

// --- Pages ---

interface HomePageProps {
  onPlay: (movie: Movie) => void;
  movies: Movie[];
  loading: boolean;
  onTrailer: (url: string) => void;
  onShare: (movie: Movie) => void;
}

const HomePage = ({ onPlay, movies, loading, onTrailer, onShare }: HomePageProps) => {
  const [featured, setFeatured] = useState<Movie | null>(null);

  useEffect(() => {
    // Pick a random movie for billboard
    if (movies.length > 0) {
      const random = movies[Math.floor(Math.random() * movies.length)];
      setFeatured(random);
    }
  }, [movies]);

  if (loading) {
     return (
        <div className="min-h-screen bg-brand-dark pt-20">
           <div className="h-[70vh] w-full bg-white/5 animate-pulse mb-10" />
           <SkeletonRow />
           <SkeletonRow />
           <SkeletonRow />
        </div>
     );
  }

  if (movies.length === 0) {
     return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-center p-8">
           <Film size={64} className="text-gray-600 mb-4" />
           <h2 className="text-2xl font-bold mb-2">No Movies Available</h2>
           <p className="text-gray-400 max-w-md">The library is currently empty. Please import movies from the Admin Panel.</p>
        </div>
     );
  }

  if (!featured) return null;

  return (
    <div className="min-h-screen pb-0 bg-brand-dark overflow-x-hidden">
      {featured && <Billboard movie={featured} onPlay={() => onPlay(featured)} />}

      {/* Rows Container */}
      <div className="relative z-20 -mt-10 md:-mt-24 space-y-4 bg-gradient-to-t from-brand-dark to-transparent pt-10 min-h-[500px]">
        <MovieRow title="Trending Now" movies={movies} onPlay={onPlay} onTrailer={onTrailer} onShare={onShare} isLarge={true} />
        <MovieRow title="Premium Exclusives" movies={movies.filter(m => m.isPremium)} onPlay={onPlay} onTrailer={onTrailer} onShare={onShare} />
        <MovieRow title="Action & Sci-Fi" movies={movies.filter(m => m.genres.includes('Action') || m.genres.includes('Sci-Fi'))} onPlay={onPlay} onTrailer={onTrailer} onShare={onShare} />
        <MovieRow title="Critically Acclaimed" movies={movies.filter(m => m.rating > 8.5)} onPlay={onPlay} onTrailer={onTrailer} onShare={onShare} />
        <MovieRow title="Watch It Again" movies={[...movies].reverse()} onPlay={onPlay} onTrailer={onTrailer} onShare={onShare} />
      </div>

      <Footer />
    </div>
  );
};

// ... (WatchPage and UserProfile components remain largely the same, skipping for brevity but they are included in context) ...
const WatchPage = ({ movie, user, onBack }: { movie: Movie, user: User, onBack: () => void }) => {
  const settings = getSettings();
  const showAds = user.planStatus === 'free' && !movie.isPremium;
  const isAllowed = !movie.isPremium || user.planStatus === 'premium' || user.role.includes('admin');
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // Percentage 0-100
  const [currentTime, setCurrentTime] = useState(1445); // Seconds (start somewhere for demo)
  const [volume, setVolume] = useState(80); // 0-100
  const [prevVolume, setPrevVolume] = useState(80); // Restore level for toggle
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedSubtitle, setSelectedSubtitle] = useState('English');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  
  const totalDuration = 6870; // Mock duration in seconds
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const subtitles = ['Off', 'English', 'Spanish', 'French', 'German'];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      // Adjust interval duration based on playback speed
      // Normal speed: 1000ms. 2x speed: 500ms.
      const intervalMs = 1000 / playbackRate;
      
      interval = setInterval(() => {
        setCurrentTime(curr => {
          const next = curr + 1; // Increment by 1 simulated second
          if (next >= totalDuration) {
             setIsPlaying(false);
             return totalDuration;
          }
          return next;
        });
      }, intervalMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackRate]);

  useEffect(() => {
    setProgress((currentTime / totalDuration) * 100);
  }, [currentTime]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const newTime = (val / 100) * totalDuration;
    setCurrentTime(newTime);
    setProgress(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val > 0) setPrevVolume(val);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 80);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isAllowed) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center space-y-4 max-w-md px-4">
          <Shield className="w-20 h-20 text-brand-red mx-auto" />
          <h2 className="text-3xl font-bold">Premium Content</h2>
          <p className="text-gray-400">This movie is available for Premium members only. Upgrade your plan to watch.</p>
          <button onClick={onBack} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col" onClick={() => { setShowSpeedMenu(false); setShowSubtitleMenu(false); }}>
      <div className="p-4 flex items-center justify-between absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="text-white hover:text-gray-300 flex items-center gap-2 font-bold text-lg drop-shadow-md">
           <ChevronLeft size={28}/> Back
        </button>
        <span className="font-bold text-lg drop-shadow-md">{movie.title}</span>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {/* Mock Player */}
        <div className="w-full h-full max-w-7xl max-h-screen bg-black relative shadow-2xl flex flex-col items-center justify-center group overflow-hidden">
          {/* Main Video Area Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {!isPlaying && <Play size={64} className="text-white/50" />}
          </div>
          
          <div className="text-center p-8 border border-white/10 rounded-lg bg-white/5 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-2">Simulated Video Player</h3>
            <p className="text-sm text-gray-400">Source: {settings.videoSourcePattern.replace('{id}', movie.id.toString())}</p>
            {showAds && (
              <div className="mt-4 p-2 bg-yellow-500/20 text-yellow-500 text-xs border border-yellow-500/50 rounded">
                Ads are enabled for this Free User
              </div>
            )}
            <div className="mt-4 text-xs text-gray-500 flex justify-center gap-4">
               <span>Speed: {playbackRate}x</span>
               <span>Subtitles: {selectedSubtitle}</span>
            </div>
          </div>
          
          {/* Controls overlay */}
          <div className="absolute bottom-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-100 transition-opacity duration-300">
            {/* Seek Bar */}
            <div className="flex items-center gap-4 mb-4 group/seek">
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={progress}
                 onChange={handleSeek}
                 className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-red hover:h-2 transition-all"
               />
               <span className="text-xs text-gray-300 font-mono w-24 text-right">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
               </span>
            </div>

            <div className="flex justify-between text-white items-center relative">
               <div className="flex gap-6 items-center">
                 <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-brand-red transition">
                    {isPlaying ? <Pause size={32} fill="white" className="hover:fill-brand-red"/> : <Play size={32} fill="white" className="hover:fill-brand-red"/>}
                 </button>
                 <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="hover:text-gray-300 transition"><ChevronLeft size={24} className="rotate-180" /> 10</button>
                 <button onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))} className="hover:text-gray-300 transition"><ChevronLeft size={24} /> 10</button>
                 
                 {/* Volume Control */}
                 <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute}>
                       {volume === 0 ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                    </button>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolume}
                      className="w-0 overflow-hidden group-hover/vol:w-24 transition-all h-1 bg-gray-500 accent-white rounded ml-2"
                    />
                 </div>
               </div>
               
               <div className="flex gap-4 items-center relative">
                 {/* Subtitles Menu */}
                 <div className="relative">
                    {showSubtitleMenu && (
                      <div className="absolute bottom-full right-0 mb-4 bg-black/90 border border-white/10 rounded-lg p-2 w-40 flex flex-col gap-1 shadow-xl">
                         <div className="text-xs font-bold text-gray-400 px-2 py-1 mb-1">Subtitles</div>
                         {subtitles.map(sub => (
                           <button 
                             key={sub}
                             onClick={(e) => { e.stopPropagation(); setSelectedSubtitle(sub); setShowSubtitleMenu(false); }}
                             className={`text-sm px-2 py-1.5 rounded text-left flex items-center justify-between hover:bg-white/10 ${selectedSubtitle === sub ? 'text-brand-red font-bold' : 'text-white'}`}
                           >
                             {sub}
                             {selectedSubtitle === sub && <Check size={14} />}
                           </button>
                         ))}
                      </div>
                    )}
                    <button 
                      className={`flex items-center gap-2 font-bold cursor-pointer hover:underline transition ${showSubtitleMenu ? 'text-brand-red' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setShowSubtitleMenu(!showSubtitleMenu); setShowSpeedMenu(false); }}
                    >
                      <Languages size={20} />
                      <span className="hidden md:inline">Audio & Subtitles</span>
                    </button>
                 </div>

                 {/* Speed / Settings Menu */}
                 <div className="relative">
                    {showSpeedMenu && (
                      <div className="absolute bottom-full right-0 mb-4 bg-black/90 border border-white/10 rounded-lg p-2 w-32 flex flex-col gap-1 shadow-xl">
                         <div className="text-xs font-bold text-gray-400 px-2 py-1 mb-1">Playback Speed</div>
                         {speeds.map(speed => (
                           <button 
                             key={speed}
                             onClick={(e) => { e.stopPropagation(); setPlaybackRate(speed); setShowSpeedMenu(false); }}
                             className={`text-sm px-2 py-1.5 rounded text-left flex items-center justify-between hover:bg-white/10 ${playbackRate === speed ? 'text-brand-red font-bold' : 'text-white'}`}
                           >
                             {speed}x
                             {playbackRate === speed && <Check size={14} />}
                           </button>
                         ))}
                      </div>
                    )}
                    <Settings 
                      size={24} 
                      className={`cursor-pointer hover:rotate-90 transition duration-500 ${showSpeedMenu ? 'text-brand-red' : 'text-white'}`}
                      onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowSubtitleMenu(false); }}
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ user, onUpdate, onBack }: { user: User, onUpdate: (u: User) => void, onBack: () => void }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  const predefinedAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Rocky",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Tiger",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Pepper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Misty"
  ];

  const handleSave = () => {
     setIsSaving(true);
     // Simulate API
     setTimeout(() => {
        onUpdate({ ...user, avatar: avatarUrl });
        setIsSaving(false);
     }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 md:px-12 pb-12">
       <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition">
          <ChevronLeft /> Back to Home
       </button>
       
       <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 border-b border-white/10 pb-4">Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Left Col: Membership & Billing (Mock) */}
             <div className="md:col-span-1 space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                   <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2"><Shield size={18}/> Membership</h2>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center bg-black/30 p-2 rounded">
                         <span className="text-sm text-gray-400">Plan</span>
                         <span className={`text-sm font-bold px-2 py-0.5 rounded ${user.planStatus === 'premium' ? 'bg-brand-red' : 'bg-gray-600'}`}>
                            {user.planStatus.toUpperCase()}
                         </span>
                      </div>
                      <div className="text-xs text-gray-500">
                         Member since 2023
                      </div>
                      <div className="text-xs text-gray-500">
                         Expiry: {new Date(user.expiryDate).toLocaleDateString()}
                      </div>
                      {user.planStatus === 'free' && (
                         <button className="w-full bg-brand-red text-white py-2 rounded text-sm font-bold hover:bg-red-700 transition">
                            Upgrade to Premium
                         </button>
                      )}
                   </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                   <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2"><Settings size={18}/> Quick Settings</h2>
                   <div className="space-y-2 text-sm text-gray-400">
                      <button className="hover:text-white hover:underline block">Parental Controls</button>
                      <button className="hover:text-white hover:underline block">Test Participation</button>
                      <button className="hover:text-white hover:underline block">Manage Devices</button>
                      <button className="hover:text-white hover:underline block">Sign out of all devices</button>
                   </div>
                </div>
             </div>

             {/* Right Col: Profile Details */}
             <div className="md:col-span-2 space-y-8">
                <div className="flex items-start gap-6">
                   <div className="relative group cursor-pointer">
                      <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-md object-cover border-2 border-transparent group-hover:border-white transition" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                         <Camera size={24} />
                      </div>
                   </div>
                   <div className="flex-1">
                      <h2 className="text-2xl font-bold">{user.email}</h2>
                      <p className="text-gray-400 text-sm">Role: {user.role}</p>
                      <p className="text-gray-400 text-sm">UID: {user.uid}</p>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Edit2 size={20}/> Change Avatar</h3>
                   <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {predefinedAvatars.map((url, i) => (
                         <img 
                           key={i} 
                           src={url} 
                           alt={`Avatar ${i}`} 
                           onClick={() => setAvatarUrl(url)}
                           className={`w-full aspect-square rounded cursor-pointer hover:scale-110 transition border-2 ${avatarUrl === url ? 'border-brand-red' : 'border-transparent hover:border-gray-400'}`}
                         />
                      ))}
                   </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
                   >
                      {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Changes
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Admin Panel ---

const AdminDashboard = () => {
  const analytics = getAnalytics();
  const movies = getMovies();
  const users = getUsers();
  const premiumUsers = users.filter(u => u.planStatus === 'premium').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "bg-blue-500" },
          { label: "Total Movies", value: movies.length, icon: Film, color: "bg-purple-500" },
          { label: "Premium Subs", value: premiumUsers, icon: Shield, color: "bg-brand-red" },
          { label: "Revenue (30d)", value: "$12,450", icon: BarChart3, color: "bg-green-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-brand-gray/50 backdrop-blur-sm border border-white/5 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.color} p-3 rounded-lg bg-opacity-20`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-brand-gray/50 backdrop-blur-sm border border-white/5 p-6 rounded-xl h-[400px]">
        <h3 className="text-lg font-bold text-white mb-4">Traffic & Revenue</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E50914" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#141414', borderColor: '#333' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="views" stroke="#E50914" fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Updated AdminMovies Component ---
const AdminMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [importId, setImportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
     setMovies(getMovies());
  }, []);

  const handleImport = async () => {
    if (!importId) return;
    setLoading(true);
    try {
      const newMovie = await fetchMockTMDBData(Number(importId));
      addMovie(newMovie);
      setMovies(getMovies()); // Refresh
      setImportId('');
    } catch (e) {
      alert("Failed to import");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
     if (confirm("Are you sure you want to delete this movie?")) {
        deleteMovie(id);
        setMovies(getMovies()); // Refresh
     }
  };

  const handleSaveEdit = () => {
     if (editingMovie) {
        updateMovie(editingMovie);
        setMovies(getMovies());
        setEditingMovie(null);
     }
  };

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      {editingMovie && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-brand-gray border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-4">
               <h3 className="text-xl font-bold">Edit Movie</h3>
               
               <div>
                  <label className="text-xs text-gray-400">Title</label>
                  <input 
                     className="w-full bg-black/50 border border-white/10 rounded p-2 mt-1"
                     value={editingMovie.title}
                     onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="text-xs text-gray-400">Description</label>
                  <textarea 
                     className="w-full bg-black/50 border border-white/10 rounded p-2 mt-1 h-24"
                     value={editingMovie.description}
                     onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})}
                  />
               </div>

               <div className="flex gap-4">
                  <div className="flex-1">
                     <label className="text-xs text-gray-400">Year</label>
                     <input 
                        type="number"
                        className="w-full bg-black/50 border border-white/10 rounded p-2 mt-1"
                        value={editingMovie.year}
                        onChange={(e) => setEditingMovie({...editingMovie, year: Number(e.target.value)})}
                     />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                     <input 
                        type="checkbox"
                        checked={editingMovie.isPremium}
                        onChange={(e) => setEditingMovie({...editingMovie, isPremium: e.target.checked})}
                        className="w-4 h-4 accent-brand-red"
                     />
                     <label className="text-sm">Premium</label>
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button onClick={() => setEditingMovie(null)} className="px-4 py-2 rounded text-gray-300 hover:bg-white/10">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 rounded bg-brand-red hover:bg-red-700 font-bold">Save Changes</button>
               </div>
            </div>
         </div>
      )}

      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-white">Movie Management</h2>
        <div className="flex gap-2 bg-brand-gray p-1 rounded-lg border border-white/10">
          <input 
            type="number" 
            placeholder="Enter TMDB ID..." 
            className="bg-transparent text-sm px-3 py-1 outline-none text-white w-40"
            value={importId}
            onChange={(e) => setImportId(e.target.value)}
          />
          <button 
            onClick={handleImport}
            disabled={loading}
            className="bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading ? 'Fetching...' : <><Plus size={14} /> Import</>}
          </button>
        </div>
      </div>

      {movies.length === 0 ? (
         <div className="bg-brand-gray/20 border border-white/5 rounded-lg p-12 text-center text-gray-500">
            No movies in database. Import one to get started.
         </div>
      ) : (
         <div className="grid grid-cols-1 gap-4">
            {movies.map(movie => (
            <div key={movie.id} className="flex gap-4 bg-brand-gray/30 p-4 rounded-lg border border-white/5 hover:bg-brand-gray/50 transition group">
               <img src={movie.posterPath} alt={movie.title} className="w-16 h-24 object-cover rounded bg-gray-800" />
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{movie.title}</h3>
                  <div className="flex gap-2">
                     <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">TMDB: {movie.id}</span>
                     {movie.isPremium && <span className="text-xs bg-brand-red px-2 py-1 rounded font-bold">PREMIUM</span>}
                  </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{movie.description}</p>
                  <div className="flex gap-2 mt-3">
                  <button 
                     onClick={() => setEditingMovie(movie)}
                     className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/40 flex items-center gap-1"
                  >
                     <Edit2 size={12}/> Edit
                  </button>
                  <button 
                     onClick={() => handleDelete(movie.id)}
                     className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/40 flex items-center gap-1"
                  >
                     <Trash2 size={12}/> Remove
                  </button>
                  </div>
               </div>
            </div>
            ))}
         </div>
      )}
    </div>
  );
};

// --- Admin Notifications Component ---
const AdminNotifications = () => {
   const [notifTitle, setNotifTitle] = useState('');
   const [notifMsg, setNotifMsg] = useState('');
   const [target, setTarget] = useState('all');
   const [sentList, setSentList] = useState<AppNotification[]>(getNotifications());
   const [sending, setSending] = useState(false);

   const handleSend = () => {
      if (!notifTitle || !notifMsg) return;
      setSending(true);
      
      // Simulate API call
      setTimeout(() => {
         addNotification({
            title: notifTitle,
            message: notifMsg,
            targetUser: target
         });
         setSentList(getNotifications());
         setNotifTitle('');
         setNotifMsg('');
         setSending(false);
      }, 500);
   };

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-white">System Notifications</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="bg-brand-gray/30 p-6 rounded-lg border border-white/5 space-y-4">
                  <h3 className="font-bold text-lg text-gray-200 flex items-center gap-2"><Send size={18}/> Send Notification</h3>
                  
                  <div>
                     <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                     <select 
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white outline-none"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                     >
                        <option value="all">All Users</option>
                        {getUsers().map(u => (
                           <option key={u.uid} value={u.uid}>{u.email}</option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm text-gray-400 mb-1">Title</label>
                     <input 
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white outline-none"
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="e.g. System Maintenance"
                     />
                  </div>

                  <div>
                     <label className="block text-sm text-gray-400 mb-1">Message</label>
                     <textarea 
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white outline-none h-24"
                        value={notifMsg}
                        onChange={(e) => setNotifMsg(e.target.value)}
                        placeholder="Type your message here..."
                     />
                  </div>

                  <button 
                     onClick={handleSend}
                     disabled={sending}
                     className="w-full bg-brand-red text-white font-bold py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                     {sending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Send Alert
                  </button>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-lg text-gray-200">Recent Alerts</h3>
               <div className="bg-brand-gray/30 rounded-lg border border-white/5 overflow-hidden max-h-[400px] overflow-y-auto">
                  {sentList.length === 0 ? (
                     <div className="p-8 text-center text-gray-500">No notifications sent yet.</div>
                  ) : (
                     sentList.slice(0, 10).map(n => (
                        <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5">
                           <div className="flex justify-between mb-1">
                              <span className="font-bold text-white text-sm">{n.title}</span>
                              <span className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</span>
                           </div>
                           <p className="text-gray-400 text-xs mb-2">{n.message}</p>
                           <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">Target: {n.targetUser === 'all' ? 'Everyone' : 'User ' + n.targetUser}</span>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleToggle = (uid: string) => {
    const user = users.find(u => u.uid === uid);
    if (!user) return;
    const newRole = user.role === 'user' ? 'super_admin' : 'user';
    const updated = { ...user, role: newRole as Role };
    updateUser(updated);
    setUsers(getUsers());
  };

  const handlePlanToggle = (uid: string) => {
    const user = users.find(u => u.uid === uid);
    if (!user) return;
    const newPlan = user.planStatus === 'free' ? 'premium' : 'free';
    const updated = { ...user, planStatus: newPlan as any };
    updateUser(updated);
    setUsers(getUsers());
  };

  const filteredUsers = users.filter(u => u.email.includes(searchTerm) || u.uid.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Base</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-brand-gray border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-brand-red outline-none w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-brand-gray/30 rounded-xl border border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map(user => (
              <tr key={user.uid} className="hover:bg-white/5 transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={user.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                  <div>
                    <div className="font-medium text-white">{user.email}</div>
                    <div className="text-xs text-gray-500">ID: {user.uid}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role.includes('admin') ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.planStatus === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-300'}`}>
                    {user.planStatus}
                  </span>
                </td>
                <td className="p-4">
                   <span className="flex items-center gap-1 text-green-400 text-xs">
                     <CheckCircle size={12} /> Active
                   </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handlePlanToggle(user.uid)} className="text-xs hover:text-white text-gray-400 underline">
                    Switch Plan
                  </button>
                  <button onClick={() => handleRoleToggle(user.uid)} className="text-xs hover:text-white text-gray-400 underline">
                    {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [settings, setSettingsData] = useState<AppSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
      
      <div className="space-y-4">
        <div className="bg-brand-gray/30 p-6 rounded-lg border border-white/5 space-y-4">
          <h3 className="font-bold text-lg text-gray-200 flex items-center gap-2"><Settings size={18}/> General API</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">TMDB API Key</label>
            <input 
              type="password"
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-brand-red outline-none"
              value={settings.tmdbApiKey}
              onChange={e => setSettingsData({...settings, tmdbApiKey: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Video Source Pattern</label>
            <input 
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-brand-red outline-none"
              value={settings.videoSourcePattern}
              onChange={e => setSettingsData({...settings, videoSourcePattern: e.target.value})}
            />
            <p className="text-xs text-gray-500 mt-1">Use {'{id}'} as placeholder for TMDB ID.</p>
          </div>
        </div>

        <div className="bg-brand-gray/30 p-6 rounded-lg border border-white/5 space-y-4">
          <h3 className="font-bold text-lg text-gray-200 flex items-center gap-2"><AlertTriangle size={18}/> Ads & Scripts</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Header Script (Global)</label>
            <textarea 
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-brand-red outline-none font-mono text-xs h-24"
              value={settings.adScriptHeader}
              onChange={e => setSettingsData({...settings, adScriptHeader: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Pop-under Script</label>
            <textarea 
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-brand-red outline-none font-mono text-xs h-24"
              value={settings.adScriptPopUnder}
              onChange={e => setSettingsData({...settings, adScriptPopUnder: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className={`w-full py-3 rounded font-bold transition ${saved ? 'bg-green-600 text-white' : 'bg-brand-red text-white hover:bg-red-700'}`}
        >
          {saved ? 'Settings Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children, activeTab, setActiveTab, onExit }: any) => {
  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/5 flex-none p-4 flex flex-col hidden md:flex">
        <div className="mb-8 px-4 flex items-center gap-2">
           <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded">ADMIN</span>
           <span className="font-bold text-xl">Panel</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink active={activeTab === 'movies'} onClick={() => setActiveTab('movies')} icon={Film} label="Movies" />
          <SidebarLink active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Users" />
          <SidebarLink active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={MessageSquare} label="Notifications" />
          <SidebarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
        </div>

        <button onClick={onExit} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
          <LogOut size={20} /> <span className="font-medium">Exit Panel</span>
        </button>
      </aside>

      {/* Mobile Header for Admin */}
      <div className="md:hidden fixed top-0 w-full bg-brand-dark z-20 p-4 border-b border-white/10 flex justify-between items-center">
         <span className="font-bold">Admin Panel</span>
         <button onClick={onExit}><X/></button>
      </div>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
};

// ... (Rest of the app remains the same, LoginScreen and App component orchestration)

// --- Main App Orchestrator ---

const LoginScreen = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f85718e1-fc6d-4954-bca0-f5eaf78e0842/ea44b42b-ba0c-4535-9614-c1f934b74319/US-en-20230918-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md p-12 bg-black/75 rounded-lg border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="email" 
              required
              placeholder="Email or phone number"
              className="w-full bg-[#333] text-white rounded px-5 py-3 outline-none focus:bg-[#454545] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-[#333] text-white rounded px-5 py-3 outline-none focus:bg-[#454545] transition"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-brand-red text-white font-bold py-3 rounded mt-4 hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-gray-600 border-none" /> Remember me
            </label>
            <a href="#" className="hover:underline">Need help?</a>
          </div>
        </form>

        <div className="mt-10 text-gray-400">
          <p>New to MyFlix? <a href="#" className="text-white hover:underline">Sign up now.</a></p>
          <div className="mt-4 text-xs text-gray-500">
            <p className="mb-2">Demo Logins:</p>
            <div className="flex flex-col gap-1">
              <code className="bg-white/10 p-1 rounded cursor-pointer hover:bg-white/20" onClick={() => setEmail('admin@myflix.com')}>admin@myflix.com (Super Admin)</code>
              <code className="bg-white/10 p-1 rounded cursor-pointer hover:bg-white/20" onClick={() => setEmail('user@example.com')}>user@example.com (Free User)</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'watch' | 'admin' | 'profile'>('home');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for session on mount
    const storedUser = localStorage.getItem('myflix_session_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Simulate loading movies
    const fetchMovies = async () => {
      setLoadingMovies(true);
      await new Promise(r => setTimeout(r, 1000));
      setMovies(getMovies());
      setLoadingMovies(false);
    };
    
    fetchMovies();
  }, [view]); // Refresh movies when view changes (e.g. back from admin)

  const handleLogin = async (email: string) => {
    const loggedInUser = await login(email);
    setUser(loggedInUser);
    localStorage.setItem('myflix_session_user', JSON.stringify(loggedInUser));
    if (loggedInUser.role.includes('admin')) {
      setView('admin');
    } else {
      setView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('myflix_session_user');
    setView('home');
  };

  const handleMoviePlay = (movie: Movie) => {
    setCurrentMovie(movie);
    setView('watch');
  };

  const handleTrailerClick = (url: string) => {
    setTrailerUrl(url);
  };

  const handleShareClick = (movie: Movie) => {
    const url = `${window.location.origin}/watch/${movie.id}`; // Fake URL structure
    const shareData = {
      title: movie.title,
      text: `Watch ${movie.title} on MyFlix!`,
      url: url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(url);
      alert(`Link to ${movie.title} copied to clipboard!`);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
     updateUser(updatedUser);
     setUser(updatedUser);
     localStorage.setItem('myflix_session_user', JSON.stringify(updatedUser));
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view === 'admin') {
    if (!user.role.includes('admin')) {
        // Redirect unauthorized
        setView('home');
        return null;
    }
    return (
      <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab} onExit={() => setView('home')}>
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'movies' && <AdminMovies />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'notifications' && <AdminNotifications />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  if (view === 'watch' && currentMovie) {
    return <WatchPage movie={currentMovie} user={user} onBack={() => setView('home')} />;
  }

  if (view === 'profile') {
     return <UserProfile user={user} onUpdate={handleUserUpdate} onBack={() => setView('home')} />;
  }

  return (
    <div className="bg-brand-dark min-h-screen text-white font-sans selection:bg-brand-red selection:text-white">
      {trailerUrl && <TrailerModal url={trailerUrl} onClose={() => setTrailerUrl(null)} />}
      
      <Navbar 
        user={user} 
        movies={movies} 
        onLogout={handleLogout} 
        onAdminClick={() => setView('admin')} 
        onPlay={handleMoviePlay}
        onProfileClick={() => setView('profile')}
      />
      
      <HomePage 
        onPlay={handleMoviePlay} 
        movies={movies} 
        loading={loadingMovies} 
        onTrailer={handleTrailerClick}
        onShare={handleShareClick}
      />
    </div>
  );
}