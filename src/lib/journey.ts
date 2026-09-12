export const chapters = [
  { name: 'About', title: ['BEYOND', 'THE SCREEN.'], label: 'A PORTFOLIO IN MOTION', caption: 'Ahmad Rizqy Yourin', detail: 'Fullstack developer. Curious by default.', action: 'Visit my resume' },
  { name: 'Work', title: ['IDEAS', 'IN ORBIT.'], label: '01: SELECTED WORK', caption: 'Three problems. Three possibilities.', detail: 'Explore the work and experience behind my builds.', action: 'Open my resume' },
  { name: 'Stack', title: ['UNDER', 'THE HOOD.'], label: '02: THE TOOLKIT', caption: 'Connected across the stack.', detail: 'Interfaces, infrastructure, and everything between.', action: 'Explore my toolkit' },
];
export type JourneyDetail = 'projects' | 'skills' | 'journey' | 'contact' | 'credits' | `project-${number}` | null;
export type JourneyMotion = { progress: number; paused: boolean };
