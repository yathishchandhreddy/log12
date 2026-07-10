import { Project, Education, Experience, Certification, SkillGroup } from "./types";

export const personalInfo = {
  name: "P. Yathish Chandh Reddy",
  tagline: "Building high-performance software, masterminding intelligent systems.",
  role: "Computer Science Engineering Student & Aspiring Software Engineer",
  subRole: "Specializing in AI & ML | Full Stack & DSA Learner | Passionate Developer",
  college: "VSB Engineering College",
  degree: "B.E. Computer Science Engineering (Artificial Intelligence & Machine Learning)",
  year: "2nd Year Undergraduate",
  cgpa: "7.60 CGPA",
  location: "Tamil Nadu, India",
  email: "yathishchandhreddy@gmail.com",
  github: "https://github.com/yathish-chandh-reddy",
  linkedin: "https://linkedin.com/in/yathish-chandh-reddy",
  objective: "Passionate Computer Science student with a strong interest in software development, problem solving, AI, and web technologies. Currently building projects, improving DSA skills, and preparing for software engineering internships at leading technology companies like Microsoft. Looking for opportunities to learn, build scalable solutions, and contribute to impactful products.",
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Java", level: 20 },
      { name: "C", level: 60 },
      { name: "Python", level: 70 },
    ],
  },
  {
    category: "Web Development",
    skills: [
      { name: "React", level: 80 },
      { name: "JavaScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML5 & CSS3", level: 95 },
    ],
  },
  {
    category: "Database & Core CS",
    skills: [
      { name: "MySQL", level: 75 },
      { name: "Data Structures & Algorithms", level: 20 },
      { name: "Object-Oriented Programming (OOP)", level: 40 },
      { name: "DBMS Concepts", level: 30 },
    ],
  },
  {
    category: "Tools & Developer Workflows",
    skills: [
      { name: "Git", level: 80 },
      { name: "GitHub", level: 85 },
      { name: "VS Code", level: 90 },
      { name: "Eclipse IDE", level: 70 },
    ],
  },
  {
    category: "Currently Learning & Core Fundamentals",
    skills: [
      { name: "Operating Systems", level: 20 },
      { name: "Full Stack Development", level: 70 },
      { name: "Machine Learning Foundations", level: 30 },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "drawing-app",
    title: "Drawing Application",
    description: "A web-based interactive drawing application that allows users to express creativity using multi-color brushes, varying stroke sizes, and precise canvas erasing capabilities.",
    techStack: ["HTML5", "CSS3", "JavaScript (ES6)", "Canvas API"],
    githubUrl: "https://github.com/yathish-chandh-reddy/drawing-application",
    liveUrl: "#drawing-demo",
    category: "Frontend Dev",
  },
  {
    id: "counselling-website",
    title: "College Counselling Portal",
    description: "A responsive counselor-matching and detail portal designed to help high school graduates explore engineering college profiles, diverse curriculum courses, and admissions procedures.",
    techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    githubUrl: "https://github.com/yathish-chandh-reddy/college-counselling",
    liveUrl: "#counselling-demo",
    category: "Web App",
  },
  {
    id: "transit-tracking",
    title: "Public Transport Tracking System",
    description: "An AI-based conceptual design for tracking city buses in smaller tier-2/tier-3 cities. Models real-time scheduling patterns and provides ETA updates to enhance daily passenger convenience.",
    techStack: ["AI Systems Design", "Concept Modeling", "Leaflet/Maps Mockup", "JavaScript"],
    githubUrl: "https://github.com/yathish-chandh-reddy/transit-tracker",
    liveUrl: "#transit-demo",
    category: "AI & Systems",
  },
];

export const educationHistory: Education[] = [
  {
    id: "college",
    institution: "VSB Engineering College",
    degree: "B.E. Computer Science and Engineering (Artificial Intelligence & Machine Learning)",
    duration: "2024 - 2028 | Currently in 2nd Year",
    grade: "7.60 CGPA",
    details: "Focusing on Software Development, Data Structures & Algorithms, Object-Oriented Programming, and AI Foundations. Actively participating in technical symposiums and building real-world projects.",
  },
  {
    id: "hs",
    institution: "Higher Secondary School Education (12th Grade)",
    degree: "Central Board of Secondary Education (CBSE)",
    duration: "Completed 2024",
    grade: "65%",
    details: "Specialized in Computer Science, Physics, Chemistry, and Mathematics (PCMC). Strengthened fundamentals in structured logic, problem-solving, and logic theory.",
  },
  {
    id: "sslc",
    institution: "Secondary School Leaving Certificate (10th Grade)",
    degree: "State Board Syllabus",
    duration: "Completed 2022",
    grade: "75%",
    details: "Acquired critical academic foundations, science theory, mathematics, and early programming principles.",
  },
];

export const experiences: Experience[] = [
  {
    id: "internship-krutanic",
    role: "AI Internship Trainee",
    company: "Krutanic Solutions",
    duration: "June 2025 - August 2025",
    points: [
      "Collaborated on practical machine learning models and computer vision workflows, optimizing training performance.",
      "Improved object orientation and algorithmic logic by engineering custom data processing scripts in Python.",
      "Presented bi-weekly technical reviews to project advisors, focusing on model efficiency metrics and business impact analysis.",
      "Participated in dynamic code reviews to learn production standards, software testing methodologies, and collaborative development."
    ],
  },
];

export const achievements: string[] = [
  "Spearheaded the development of multiple responsive web applications, hosting code on a growing GitHub presence.",
  "Constructed an active competitive programming routine, solving 35 core DSA problems on LeetCode and GeeksforGeeks.",
  "Engineered a fully functional, browser-based collaborative Drawing application leveraging raw canvas and mouse listeners.",
  "Successfully completed an immersive professional internship in Artificial Intelligence, demonstrating project integration skills.",
  "Currently training on Microsoft Cloud Fundamentals and Microsoft Learn Tracks (AZ-900, AI-900) in preparation for internships."
];

export const certifications: Certification[] = [
  {
    id: "cert-ai",
    title: "Artificial Intelligence Internship Certificate",
    issuer: "Krutanic Solutions",
    date: "Completed August 2025",
    credentialUrl: "#",
    imagePlaceholderText: "AI",
  },
  {
    id: "cert-web",
    title: "Web Development Specialist Certificate",
    issuer: "Online Training / College Technical Lab",
    date: "Completed March 2025",
    credentialUrl: "#",
    imagePlaceholderText: "Web",
  },
  {
    id: "cert-ms",
    title: "Microsoft Cloud & AI Fundamentals Training",
    issuer: "Microsoft Learn Track (Preparation in Progress)",
    date: "Aimed for Q4 2026",
    credentialUrl: "https://learn.microsoft.com",
    imagePlaceholderText: "MSFT",
  },
];
