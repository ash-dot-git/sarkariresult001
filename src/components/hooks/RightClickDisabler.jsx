'use client';

import { useEffect } from 'react';

export default function RightClickDisabler() {
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disable);
    return () => document.removeEventListener('contextmenu', disable);
  }, []);

  return null;
}
