import { Movie, User, AppSettings, AnalyticsData, AppNotification } from '../types';

// --- Mock Data ---

const INITIAL_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Stranger Things: The Movie",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    posterPath: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYkOD82aLQ.jpg",
    genres: ["Sci-Fi", "Horror", "Drama"],
    rating: 9.8,
    isPremium: true,
    year: 2024,
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU"
  },
  {
    id: 2,
    title: "The Dark Knight Rises",
    description: "Eight years after the Joker's reign of anarchy, Batman, with the help of the enigmatic Catwoman, is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane.",
    posterPath: "https://image.tmdb.org/t/p/w500/vzvKcPQ4o7TjWeGIn0aGC9FeVNu.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
    genres: ["Action", "Thriller"],
    rating: 9.0,
    isPremium: false,
    year: 2012,
    trailerUrl: "https://www.youtube.com/embed/g8evyE9TuYk"
  },
  {
    id: 3,
    title: "Interstellar",
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8zEfCb88M3SYmFDqn.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.6,
    isPremium: true,
    year: 2014,
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
  },
  {
    id: 4,
    title: "Inception",
    description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    posterPath: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/s3TBrRGB1jav7y4argnzPkNPZiZ.jpg",
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    isPremium: false,
    year: 2010,
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
  },
  {
    id: 5,
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    posterPath: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 9.5,
    isPremium: true,
    year: 2019,
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c"
  },
  {
    id: 6,
    title: "The Matrix",
    description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/l4QHerTSbMI7qgvxYnMSqWIBlII.jpg",
    genres: ["Action", "Sci-Fi"],
    rating: 8.7,
    isPremium: false,
    year: 1999,
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8"
  },
  {
    id: 7,
    title: "Dune: Part Two",
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    posterPath: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    genres: ["Sci-Fi", "Adventure"],
    rating: 9.2,
    isPremium: true,
    year: 2024,
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w"
  },
  {
    id: 8,
    title: "Cyberpunk: Edgerunners",
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.",
    posterPath: "https://image.tmdb.org/t/p/w500/7c4C21kE73fXW4g9b5f5f5f5f5f.jpg", // Placeholder
    backdropPath: "https://image.tmdb.org/t/p/original/5DUMPBSnHOZsbBv81GFXZxwbD9b.jpg",
    genres: ["Anime", "Sci-Fi", "Action"],
    rating: 8.9,
    isPremium: false,
    year: 2022,
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg"
  },
  {
    id: 9,
    title: "The Godfather",
    description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    posterPath: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    genres: ["Drama", "Crime"],
    rating: 9.3,
    isPremium: false,
    year: 1972,
    trailerUrl: "https://www.youtube.com/embed/sY1S34973zA"
  },
  {
    id: 10,
    title: "Spider-Man: Across the Spider-Verse",
    description: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
    posterPath: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    genres: ["Animation", "Action", "Adventure"],
    rating: 9.4,
    isPremium: true,
    year: 2023,
    trailerUrl: "https://www.youtube.com/embed/shW9i6k8cB0"
  },
  {
    id: 11,
    title: "Breaking Bad",
    description: "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
    posterPath: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    genres: ["Drama", "Crime", "Thriller"],
    rating: 9.5,
    isPremium: true,
    year: 2008,
    trailerUrl: "https://www.youtube.com/embed/HhesaQXLuRY"
  }
];

const INITIAL_USERS: User[] = [
  {
    uid: "admin123",
    email: "admin@myflix.com",
    role: "super_admin",
    planStatus: "premium",
    expiryDate: "2099-12-31",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  },
  {
    uid: "user123",
    email: "user@example.com",
    role: "user",
    planStatus: "free",
    expiryDate: "2024-12-31",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
  }
];

const INITIAL_SETTINGS: AppSettings = {
  tmdbApiKey: "",
  adScriptHeader: "// console.log('Ad Header Loaded')",
  adScriptPopUnder: "// console.log('Popunder Loaded')",
  activeMaintenance: false,
  videoSourcePattern: "https://vidsrc.to/embed/movie/{id}"
};

const INITIAL_ANALYTICS: AnalyticsData[] = [
  { name: 'Mon', views: 4000, revenue: 2400 },
  { name: 'Tue', views: 3000, revenue: 1398 },
  { name: 'Wed', views: 2000, revenue: 9800 },
  { name: 'Thu', views: 2780, revenue: 3908 },
  { name: 'Fri', views: 1890, revenue: 4800 },
  { name: 'Sat', views: 2390, revenue: 3800 },
  { name: 'Sun', views: 3490, revenue: 4300 },
];

// --- Service Implementation ---

// Movies
export const getMovies = (): Movie[] => {
  const stored = localStorage.getItem('myflix_movies');
  if (!stored) {
    localStorage.setItem('myflix_movies', JSON.stringify(INITIAL_MOVIES));
    return INITIAL_MOVIES;
  }
  return JSON.parse(stored);
};

export const addMovie = (movie: Movie) => {
  const movies = getMovies();
  // Check for duplicates
  if (movies.some(m => m.id === movie.id)) return;
  
  const updated = [movie, ...movies];
  localStorage.setItem('myflix_movies', JSON.stringify(updated));
};

export const updateMovie = (updatedMovie: Movie) => {
  const movies = getMovies();
  const index = movies.findIndex(m => m.id === updatedMovie.id);
  if (index !== -1) {
    movies[index] = updatedMovie;
    localStorage.setItem('myflix_movies', JSON.stringify(movies));
  }
};

export const deleteMovie = (id: number) => {
  const movies = getMovies();
  const updated = movies.filter(m => m.id !== id);
  localStorage.setItem('myflix_movies', JSON.stringify(updated));
};

// Users
export const getUsers = (): User[] => {
  const stored = localStorage.getItem('myflix_users');
  if (!stored) {
    localStorage.setItem('myflix_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const updateUser = (updatedUser: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.uid === updatedUser.uid);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('myflix_users', JSON.stringify(users));
  }
};

// Settings
export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem('myflix_settings');
  if (!stored) {
    localStorage.setItem('myflix_settings', JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  return JSON.parse(stored);
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem('myflix_settings', JSON.stringify(settings));
};

// Analytics
export const getAnalytics = (): AnalyticsData[] => {
  return INITIAL_ANALYTICS;
};

// Notifications
export const getNotifications = (): AppNotification[] => {
  const stored = localStorage.getItem('myflix_notifications');
  return stored ? JSON.parse(stored) : [];
};

export const addNotification = (note: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
  const notes = getNotifications();
  const newNote: AppNotification = {
    ...note,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false
  };
  localStorage.setItem('myflix_notifications', JSON.stringify([newNote, ...notes]));
};

export const markNotificationRead = (id: string) => {
  const notes = getNotifications();
  const updated = notes.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('myflix_notifications', JSON.stringify(updated));
};

// --- Mock Auth ---
export const login = async (email: string): Promise<User> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (user) return user;
  
  // Create new user if not found for demo simplicity
  const newUser: User = {
    uid: Date.now().toString(),
    email,
    role: 'user',
    planStatus: 'free',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
  };
  
  users.push(newUser);
  localStorage.setItem('myflix_users', JSON.stringify(users));
  return newUser;
};

// --- TMDB Mock Helper ---
export const fetchMockTMDBData = async (tmdbId: number): Promise<Movie> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    id: tmdbId,
    title: `Imported Movie (${tmdbId})`,
    description: "This is a simulated import from TMDB. In a real app, this would be fetched from the API.",
    posterPath: `https://picsum.photos/300/450?random=${tmdbId}`,
    backdropPath: `https://picsum.photos/1200/600?random=${tmdbId}`,
    genres: ["Action", "Thriller"],
    rating: 7.5,
    isPremium: false,
    year: 2024,
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };
};