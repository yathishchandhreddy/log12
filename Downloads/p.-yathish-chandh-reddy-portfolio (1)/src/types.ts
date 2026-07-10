export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  grade: string;
  details?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  points: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  imagePlaceholderText: string;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number }[]; // level in percentage (e.g. 90)
}
