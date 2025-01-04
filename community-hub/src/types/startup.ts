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

export interface Startup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  foundedYear: number;
  teamSize: number;
  domain: string[];
  website?: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  tam: number;        // Total Addressable Market in millions
  sam: number;        // Serviceable Addressable Market in millions
  competitors: number;
  mrr?: number;       // Monthly Recurring Revenue
  stage: string;      // e.g., "Idea", "MVP", "Growth", "Scale"
  fundingRound?: string; // e.g., "Pre-seed", "Seed", "Series A"
  fundingRaised?: number; // Total funding raised in millions
  traction?: string;  // Key metrics and growth numbers
  positions: Position[];
  createdAt: Date;
  updatedAt: Date;
}
