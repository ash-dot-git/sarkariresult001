'use client';

/**
 * @component GoogleAd
 * @description Thin wrapper around the existing AdSlot component for use
 * in the news section. Reuses the mature adsbygoogle push/poll logic.
 */

import AdSlot from './AdSlot';
import { AD_SLOTS } from '@/lib/adsense';

/**
 * Renders a Google AdSense ad unit.
 *
 * @param {Object} props
 * @param {string} [props.slot] - AdSense slot ID (defaults to banner slot)
 * @param {string} [props.variant='banner'] - Ad variant: 'banner' | 'inArticle' | 'sidebar' | 'bottom'
 * @param {string} [props.format='auto'] - Ad format
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function GoogleAd({
  slot,
  variant = 'banner',
  format = 'auto',
  className = '',
}) {
  // Map variant to default slot if not explicitly provided
  const resolvedSlot = slot || AD_SLOTS[variant] || AD_SLOTS.banner;

  if (!resolvedSlot) return null;

  return (
    <AdSlot
      slot={resolvedSlot}
      variant={variant}
      format={format}
      className={className}
    />
  );
}
