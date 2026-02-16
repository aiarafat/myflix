export type Role = 'user' | 'admin' | 'super_admin';
export type PlanStatus = 'free' | 'premium';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetUser: 'all' | string; // 'all' or specific uid
}

export interface User {
  uid: string;
  email: string;
  role: Role;
  planStatus: PlanStatus;
  expiryDate: string; // ISO date string
  avatar?: string;
}

export interface Movie {
  id: number; // TMDB ID
  title: string;
  description: string;
  posterPath: string; // URL
  backdropPath: string; // URL
  genres: string[];
  rating: number;
  isPremium: boolean;
  year: number;
  trailerUrl?: string; // YouTube Embed URL
}

export interface AppSettings {
  tmdbApiKey: string;
  adScriptHeader: string;
  adScriptPopUnder: string;
  activeMaintenance: boolean;
  videoSourcePattern: string;
}

export interface AnalyticsData {
  name: string;
  views: number;
  revenue: number;
}