export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  availability: string[];
  isPublic: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillRequested: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: Date;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
}