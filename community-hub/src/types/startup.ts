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
  positions: Position[];
  createdAt: Date;
  updatedAt: Date;
}
