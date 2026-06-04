'use client';

import React, { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false,
  });

  useEffect(() => {
    setMounted(true);
    const updateClasses = () => {
      const store = getStore();
      setSettings({
        dyslexiaFont: store.settings.dyslexiaFont,
        highContrast: store.settings.highContrast,
        reducedMotion: store.settings.reducedMotion,
      });

      // Apply to document element
      const htmlEl = document.documentElement;
      if (store.settings.dyslexiaFont) {
        htmlEl.classList.add('dyslexia-font');
      } else {
        htmlEl.classList.remove('dyslexia-font');
      }

      if (store.settings.highContrast) {
        htmlEl.classList.add('high-contrast');
      } else {
        htmlEl.classList.remove('high-contrast');
      }

      if (store.settings.reducedMotion) {
        htmlEl.classList.add('prefers-reduced-motion');
      } else {
        htmlEl.classList.remove('prefers-reduced-motion');
      }
    };

    updateClasses();

    // Listen for custom settings change events
    window.addEventListener('eduverse_settings_change', updateClasses);
    return () => {
      window.removeEventListener('eduverse_settings_change', updateClasses);
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0A0F]" />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${settings.dyslexiaFont ? 'dyslexia-font' : ''} ${settings.highContrast ? 'high-contrast' : ''}`}>
      {children}
    </div>
  );
}
