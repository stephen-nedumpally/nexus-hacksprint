export interface Requirements {
  id: string;
  skills: string[];
  experience: number;
  education?: string;
  positionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  title: string;
  description: string;
  startupId: string;
  requirements: Requirements;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image?: string;
}

export interface Like {
  id: string;
  startupId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dislike {
  id: string;
  startupId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  startupId: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  domain: string[];
  website?: string;
  problem: string;
  solution: string;
  market: string;
  traction: string;
  funding: string;
  teamSize: number;
  founded: Date;
  positions: Position[];
  likes: Like[];
  dislikes: Dislike[];
  comments: Comment[];
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
