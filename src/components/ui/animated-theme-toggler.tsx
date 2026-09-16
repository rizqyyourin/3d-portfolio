'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnimatedThemeTogglerProps = {
  className?: string;
};

export function AnimatedThemeToggler({ className }: AnimatedThemeTogglerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    try {
      root.dataset.theme = localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      root.dataset.theme = 'light';
    }

    const syncTheme = () => setDarkMode(root.dataset.theme === 'dark');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const onToggle = useCallback(async () => {
    const button = buttonRef.current;
    if (!button) return;

    const nextDarkMode = document.documentElement.dataset.theme !== 'dark';
    const applyTheme = () => {
      document.documentElement.dataset.theme = nextDarkMode ? 'dark' : 'light';
      setDarkMode(nextDarkMode);
      try { localStorage.setItem('portfolio-theme', nextDarkMode ? 'dark' : 'light'); } catch { /* Theme remains usable without storage. */ }
    };

    if (!document.startViewTransition) {
      applyTheme();
      return;
    }

    const transition = document.startViewTransition(() => flushSync(applyTheme));
    try {
      await transition.ready;
      const { left, top, width, height } = button.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const radius = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY),
      );

      document.documentElement.animate(
        { clipPath: [`circle(0px at ${centerX}px ${centerY}px)`, `circle(${radius}px at ${centerX}px ${centerY}px)`] },
        { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    } catch { /* The theme is already applied if the transition is skipped. */ }
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
      aria-pressed={darkMode}
      className={cn('theme-toggle', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span key="sun" initial={{ opacity: 0, scale: 0.55, rotate: 25 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.33 }} className="theme-toggle-icon">
            <Sun size={18} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ opacity: 0, scale: 0.55, rotate: -25 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.33 }} className="theme-toggle-icon">
            <Moon size={18} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
