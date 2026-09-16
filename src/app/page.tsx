'use client';

import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import Image, { type ImageProps } from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Code, Database, DownloadSimpleIcon, EnvelopeSimpleIcon, GithubLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, List, PaperPlaneTilt, Stack, ThreadsLogoIcon, Wrench, X } from '@phosphor-icons/react';
import { SiCodeigniter, SiCss, SiCursor, SiDocker, SiEslint, SiGit, SiGithubcopilot, SiGithubactions, SiGo, SiHtml5, SiJavascript, SiKubernetes, SiLaravel, SiMysql, SiNextdotjs, SiNodedotjs, SiNuxt, SiOpencode, SiPhp, SiPostgresql, SiPostman, SiReact, SiRedis, SiSocket, SiSwagger, SiTypescript, SiVuedotjs } from '@icons-pack/react-simple-icons';
import { skills } from '@/lib/portfolio';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const RESUME_URL = '/cv/CV ATS_Ahmad Rizqy Yourin_EN.pdf';
const GITHUB_URL = 'https://github.com/rizqyyourin';
const INSTAGRAM_URL = 'https://www.instagram.com/rizqyyourin';
const THREADS_URL = 'https://www.threads.net/@rizqyyourin';
const featuredProjects = [
  { name: 'Kohi Cafe', description: 'F&B CMS website built with Next.js', image: '/images/cafe.png', url: 'https://cafe.yourin.my.id', className: 'project-cafe', detail: 'A cafe website with a content management system, built with Next.js.' },
  { name: 'QPAY', description: 'AI-assisted POS website, built with Laravel', image: '/images/qpay.png', url: 'https://qpay.yourin.my.id', className: 'project-qpay', detail: 'An AI-assisted point-of-sale website built with Laravel.' },
  { name: 'Ticketin', description: 'Customer experience inspired by my latest work', image: '/images/ticketin.png', url: 'https://ticketin.yourin.my.id', className: 'project-ticket', detail: 'A customer experience project inspired by my latest work.' },
];
type TechIcon = ComponentType<{ size?: number; color?: string }>;
const techIcons: Record<string, TechIcon> = { HTML5: SiHtml5, CSS3: SiCss, JavaScript: SiJavascript, TypeScript: SiTypescript, 'React.js': SiReact, 'Vue.js': SiVuedotjs, 'Next.js': SiNextdotjs, 'Nuxt.js': SiNuxt, PHP: SiPhp, Go: SiGo, Laravel: SiLaravel, 'CodeIgniter 3': SiCodeigniter, 'Node.js': SiNodedotjs, MySQL: SiMysql, PostgreSQL: SiPostgresql, Redis: SiRedis, Docker: SiDocker, Kubernetes: SiKubernetes, ESLint: SiEslint, Postman: SiPostman, 'REST API': SiSwagger, WebSocket: SiSocket, Git: SiGit, 'CI/CD': SiGithubactions, Mockoon: SiSwagger, 'VS Code': SiGithubcopilot, Cursor: SiCursor, Opencode: SiOpencode };
const stackGroups = [
  { title: 'Frontend', icon: Code, items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React.js', 'Vue.js', 'Next.js', 'Nuxt.js'] },
  { title: 'Backend', icon: Stack, items: ['PHP', 'Go', 'Laravel', 'CodeIgniter 3', 'Node.js', 'REST API', 'WebSocket'] },
  { title: 'Database', icon: Database, items: ['MySQL', 'PostgreSQL', 'Redis'] },
  { title: 'Tools & deployment', icon: Wrench, items: skills[3].items },
];
const threadPosts = [
  'https://www.threads.com/@rizqyyourin/post/DdMA4ZCkx53',
  'https://www.threads.com/@rizqyyourin/post/DdAoaSTHR0r',
  'https://www.threads.com/@rizqyyourin/post/DcVVIGpE8QE',
];

function SkeletonImage({ fallbackLabel, className, alt, ...props }: ImageProps & { fallbackLabel: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  return <>
    {status === 'loading' && <span className="media-skeleton" aria-hidden="true" />}
    {status === 'error' && <span className="media-fallback">{fallbackLabel}</span>}
    <Image {...props} alt={alt} className={`${className ?? ''} ${status === 'ready' ? '' : 'media-image-pending'}`} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
  </>;
}

function ThreadCard({ url }: { url: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let frame: HTMLIFrameElement | null = null;
    const onLoad = () => setStatus('ready');
    const onError = () => setStatus('error');
    const findFrame = () => {
      const nextFrame = card.querySelector<HTMLIFrameElement>('iframe.text-post-media');
      if (!nextFrame || nextFrame === frame) return;
      frame?.removeEventListener('load', onLoad);
      frame?.removeEventListener('error', onError);
      frame = nextFrame;
      frame.addEventListener('load', onLoad);
      frame.addEventListener('error', onError);
    };
    const observer = new MutationObserver(findFrame);
    observer.observe(card, { childList: true });
    findFrame();
    const timeout = window.setTimeout(() => setStatus(current => current === 'loading' ? 'error' : current), 15000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      frame?.removeEventListener('load', onLoad);
      frame?.removeEventListener('error', onError);
    };
  }, []);

  return <div className={`thread-card ${status === 'ready' ? 'thread-card-ready' : ''}`} ref={cardRef}>
    {status !== 'ready' && <div className="thread-skeleton">
      {status === 'loading' ? <div className="thread-skeleton-content" aria-hidden="true"><span className="thread-skeleton-avatar" /><span className="thread-skeleton-line" /><span className="thread-skeleton-line short" /><span className="thread-skeleton-block" /></div> : <p>Preview unavailable</p>}
      <a href={url} target="_blank" rel="noreferrer">View on Threads</a>
    </div>}
    <blockquote className="text-post-media thread-embed" data-text-post-permalink={url} data-text-post-version="0">
      <a href={url} target="_blank" rel="noreferrer">View on Threads</a>
    </blockquote>
  </div>;
}
/*
function Github({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.08c-3.12.68-3.78-1.33-3.78-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.77 2.16 3.27 1.55.1-.73.39-1.23.71-1.51-2.49-.28-5.1-1.24-5.1-5.54 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.67.11 2.96.72.78 1.15 1.78 1.15 3 0 4.31-2.62 5.25-5.12 5.53.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}
function Linkedin({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.36-1.55 2.79-1.55 2.99 0 3.55 1.97 3.55 4.53v5.27Z" /></svg>;
}
}
*/
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
  const scrollReveal = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.threads.com/embed.js';
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <div className="portfolio-window">
      <header className="site-header">
        <a className="traffic-lights" href="#about" aria-label="Back to introduction"><span /><span /><span /></a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          <a href="#about">About</a><a href="#projects">Projects</a><a href={RESUME_URL} target="_blank" rel="noreferrer">My CV</a><a href="mailto:rizqyyourin6@gmail.com">Contact</a>
        </nav>
        <button ref={menuButtonRef} className="menu-toggle" type="button" aria-label={`${menuOpen ? 'Close' : 'Open'} navigation menu`} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <X size={19} /> : <List size={20} />}
        </button>
        <AnimatedThemeToggler />
        <AnimatePresence initial={false}>
          {menuOpen && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Main navigation" aria-hidden={!menuOpen} inert={!menuOpen} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a><a href={RESUME_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>My CV</a><a href="mailto:rizqyyourin6@gmail.com" onClick={() => setMenuOpen(false)}>Contact</a>
          </motion.nav>}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero" id="about" aria-labelledby="intro-title" tabIndex={-1}>
          <div className="hero-copy">
            <motion.h1 id="intro-title" {...reveal(0.12)}>Ahmad Rizqy Yourin</motion.h1>
            <motion.p {...reveal(0.32)}>Computer Engineering graduate from Diponegoro University with experience in fullstack development websites.</motion.p>
            <motion.p {...reveal(0.52)}>Experienced in both monolith and microservices systems, with strong adaptability, problem-solving, and collaboration skills.</motion.p>
            <motion.div className="hero-actions" {...reveal(0.72)}>
              <a className="button button-primary" href="mailto:rizqyyourin6@gmail.com"><PaperPlaneTilt size={16} />Let&apos;s connect</a>
              <a className="button button-secondary" href={RESUME_URL} target="_blank" rel="noreferrer"><DownloadSimpleIcon size={20} />View CV</a>
            </motion.div>
          </div>
          <motion.div className="profile-photo-frame" {...reveal(0.24)}><SkeletonImage className="profile-photo" src="/images/profile.png" alt="Ahmad Rizqy Yourin" width={1374} height={1145} priority fallbackLabel="Photo unavailable" /></motion.div>
        </section>

        <section className="projects-section" id="projects" aria-labelledby="projects-title">
          <motion.h2 id="projects-title" {...scrollReveal()}>Built Projects</motion.h2>
          <div className="project-grid">
            {featuredProjects.map((item, index) => <motion.a className="project-card" key={item.name} href={item.url} target="_blank" rel="noreferrer" aria-label={`Visit ${item.name}`} {...scrollReveal(index * 0.16)}>
              <span className={`project-cover ${item.className}`}><SkeletonImage className="project-image" src={item.image} alt={`${item.name} project preview`} fill sizes="(max-width: 640px) 100vw, 33vw" fallbackLabel="Preview unavailable" /><ArrowUpRight className="project-arrow" size={20} /></span>
              <span className="project-name">{item.name}</span><span className="project-description">{item.description}</span>
            </motion.a>)}
          </div>
        </section>

        <section className="threads-section" aria-labelledby="threads-title">
          <div className="section-heading"><h2 id="threads-title">See me on threads</h2><a className="quiet-link" href={THREADS_URL} target="_blank" rel="noreferrer">More threads <ArrowRight size={15} /></a></div>
          <div className="threads-grid">
            {threadPosts.map(url => <ThreadCard key={url} url={url} />)}
          </div>
        </section>

        <section className="stack-section" aria-labelledby="stack-title">
          <motion.div className="stack-heading" {...scrollReveal()}><h2 id="stack-title">Tech Stack</h2><p>Tech stack I&apos;ve experienced and been using with</p></motion.div>
          <div className="stack-panel">{stackGroups.map(({ title, icon: Icon, items }, index) => <motion.article className="stack-group" key={title} {...scrollReveal(index * 0.13)} whileHover={{ y: -4, transition: { duration: 0.36 } }}><div className="stack-group-heading"><span className="stack-group-icon"><Icon size={18} weight="regular" /></span><div><h3>{title}</h3><p>{items.length} technologies</p></div></div><ul>{items.map(name => { const TechIcon = techIcons[name]; return <li key={name}><span className="tech-mark" aria-hidden="true">{TechIcon ? <TechIcon size={15} /> : name.slice(0, 2)}</span><span>{name}</span></li>; })}</ul></motion.article>)}</div>
        </section>
      </main>

      <footer className="site-footer"><p>© {new Date().getFullYear()} Ahmad Rizqy Yourin.</p><div className="footer-links"><a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub profile"><GithubLogoIcon size={20} /></a><a href="mailto:rizqyyourin6@gmail.com" aria-label="Email Ahmad"><EnvelopeSimpleIcon size={20} /></a><a href="https://www.linkedin.com/in/rizqyyourin" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedinLogoIcon size={20} /></a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram profile"><InstagramLogoIcon size={20} /></a><a href={THREADS_URL} target="_blank" rel="noreferrer" aria-label="Threads profile"><ThreadsLogoIcon size={20} /></a></div></footer>
    </div>

  </>;
}
