import * as THREE from 'three';

const INTRO = 'Hello, I’m Yourin.';

function drawScreen(canvas: HTMLCanvasElement, mode: number, typedChars = INTRO.length) {
  canvas.width = 1440; canvas.height = 900;
  const c = canvas.getContext('2d')!;
  const grad = c.createLinearGradient(0, 0, 1440, 900); grad.addColorStop(0, '#15362e'); grad.addColorStop(.5, '#618774'); grad.addColorStop(1, '#b8c6a5');
  c.fillStyle = grad; c.fillRect(0, 0, 1440, 900);
  c.strokeStyle = '#e0edcf22'; c.lineWidth = 80;
  for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(1380, 920, 430 + i * 130, 700 + i * 90, -.5, 0, Math.PI * 2); c.stroke(); }
  c.fillStyle = '#ffffff24'; c.fillRect(0, 0, 1440, 38); c.fillStyle = '#fff'; c.font = '500 17px sans-serif'; c.fillText('◆   Finder    File    Edit    View    Go    Window', 24, 25); c.fillText('Yourin’s workspace', 1220, 25);
  c.shadowColor = '#0006'; c.shadowBlur = 55; c.fillStyle = '#f7f8f2'; c.beginPath(); c.roundRect(205, 125, 1030, 610, 18); c.fill(); c.shadowBlur = 0;
  c.fillStyle = '#eceee8'; c.beginPath(); c.roundRect(205, 125, 1030, 48, [18, 18, 0, 0]); c.fill();
  ['#ed776c', '#edc768', '#82ba7e'].forEach((color, i) => { c.fillStyle = color; c.beginPath(); c.arc(231 + i * 26, 149, 7, 0, 7); c.fill(); });
  c.fillStyle = '#788077'; c.font = '18px monospace'; c.fillText(mode === 2 ? 'yourin: terminal' : 'yourin.dev / ' + (mode === 1 ? 'selected-work' : 'hello'), 575, 154);
  if (mode === 2) {
    c.fillStyle = '#17231e'; c.fillRect(205, 173, 1030, 545); c.font = '25px monospace';
    ['❯ whoami', 'Ahmad Rizqy Yourin', '', '❯ cat interests.txt', 'Thoughtful interfaces. Reliable systems.', 'Fullstack development + machine learning.', '', '❯ status', 'Ready to build something meaningful. ▌'].forEach((line, i) => { c.fillStyle = line.startsWith('❯') ? '#acd986' : '#e4e9dd'; c.fillText(line, 250, 225 + i * 48); });
  } else if (mode === 1) {
    c.fillStyle = '#192720'; c.font = 'bold 52px sans-serif'; c.fillText('Ideas, made real.', 265, 265);
    ['01   Multi-tenant Ticketing Platform', '02   Smart Bin · Machine Learning', '03   SIMTEG · Student Attendance'].forEach((s, i) => { c.fillStyle = '#e5e9dd'; c.beginPath(); c.roundRect(265, 310 + i * 115, 910, 90, 10); c.fill(); c.fillStyle = '#2e483b'; c.font = '28px sans-serif'; c.fillText(s, 293, 367 + i * 115); });
  } else {
    c.fillStyle = '#6c846a'; c.font = '20px monospace'; c.fillText('A LITTLE INTRODUCTION', 280, 255);
    c.fillStyle = '#1d3025'; c.font = 'bold 86px sans-serif'; c.fillText(INTRO.slice(0, typedChars), 280, 365);
    c.font = '29px sans-serif'; c.fillStyle = '#6c746a'; c.fillText('A fullstack developer turning complex problems', 280, 429); c.fillText('into simple, meaningful digital experiences.', 280, 470);
    c.fillStyle = '#243a2d'; c.beginPath(); c.roundRect(280, 533, 235, 62, 31); c.fill(); c.fillStyle = '#fff'; c.font = '22px sans-serif'; c.fillText('Let’s build together ↗', 300, 573);
    c.fillStyle = '#8a9386'; c.font = '18px monospace'; c.fillText('JAKARTA, INDONESIA    ·    FULLSTACK DEVELOPER', 280, 675);
  }
  c.fillStyle = '#ffffff55'; c.beginPath(); c.roundRect(520, 804, 400, 71, 20); c.fill();
  ['#92bce0', '#f4efe2', '#343b38', '#90a98b', '#5d789a', '#e2b574'].forEach((color, i) => { c.fillStyle = color; c.beginPath(); c.roundRect(535 + i * 64, 815, 51, 49, 10); c.fill(); c.fillStyle = '#ffffffb0'; c.font = 'bold 27px sans-serif'; c.fillText(['⌘', '✉', '>_', '◈', '◎', '♪'][i], 545 + i * 64, 849); });
  return canvas;
}

export function screenTexture(mode: number, typedChars = INTRO.length) {
  const canvas = drawScreen(document.createElement('canvas'), mode, typedChars);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; return texture;
}

export function updateScreenTexture(texture: THREE.CanvasTexture, mode: number, typedChars: number) {
  if (mode !== 0) return;
  drawScreen(texture.image as HTMLCanvasElement, mode, typedChars);
  texture.needsUpdate = true;
}
