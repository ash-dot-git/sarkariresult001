'use client';

import dynamic from 'next/dynamic';

const RightClickDisabler = dynamic(() => import('@/components/hooks/RightClickDisabler'), {
  ssr: false,
});

export default RightClickDisabler;