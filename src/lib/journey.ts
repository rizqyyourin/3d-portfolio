export const chapters = [
  { name: 'Enter', title: ['BEYOND', 'THE SCREEN.'], label: 'A PORTFOLIO IN MOTION', caption: 'Ahmad Rizqy Yourin', detail: 'Fullstack developer. Curious by default.', action: 'Visit my resume' },
  { name: 'Work', title: ['IDEAS', 'IN ORBIT.'], label: '01 — SELECTED WORK', caption: 'Three problems. Three possibilities.', detail: 'Explore the work and experience behind my builds.', action: 'Open my resume' },
  { name: 'Stack', title: ['UNDER', 'THE HOOD.'], label: '02 — THE TOOLKIT', caption: 'Connected across the stack.', detail: 'Interfaces, infrastructure, and everything between.', action: 'Explore my toolkit' },
  { name: 'Journey', title: ['ALWAYS', 'BECOMING.'], label: '03 — EXPERIENCE & EDUCATION', caption: 'Built through experience.', detail: 'A little further with every challenge.', action: 'Explore the journey' },
  { name: 'Connect', title: ['WHAT’S', 'NEXT?'], label: '04 — YOUR IDEA STARTS HERE', caption: 'Let’s build something that matters.', detail: 'Based in Jakarta. Open to new possibilities.', action: 'Start a conversation' },
];
export type JourneyDetail = 'projects' | 'skills' | 'journey' | 'contact' | 'credits' | `project-${number}` | null;
export type JourneyMotion = { progress: number; paused: boolean };
