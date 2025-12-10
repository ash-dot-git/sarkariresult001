'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const UpcomingScroller = ({ posts }) => {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);

  const intervalRef = useRef(null);
  const wheelTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const nextIndex = useCallback(() => {
    if (posts && posts.length > 0) {
      setIndex((prev) => (prev + 1) % posts.length);
    }
  }, [posts]);

  const prevIndex = useCallback(() => {
    if (posts && posts.length > 0) {
      setIndex((prev) => (prev - 1 + posts.length) % posts.length);
    }
  }, [posts]);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(nextIndex, 3000);
  }, [nextIndex]);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (posts && posts.length > 1 && !isHovering && !isWheeling) {
      startInterval();
    } else {
      stopInterval();
    }
    return () => stopInterval();
  }, [posts, isHovering, isWheeling, startInterval]);

  // ✅ Proper wheel handler with preventDefault and non-passive
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e) => {
      e.preventDefault();

      if (isWheeling) return;
      setIsWheeling(true);
      stopInterval();

      if (e.deltaY > 0) {
        nextIndex();
      } else {
        prevIndex();
      }

      clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        setIsWheeling(false);
      }, 600); // throttle scroll frequency
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [isWheeling, nextIndex, prevIndex]);

  const visiblePosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      visible.push(posts[(index + i + posts.length) % posts.length]);
    }
    return visible;
  }, [index, posts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      aria-label="Upcoming Posts"
      className="w-full p-1 mr-4 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="text-center mb-2 md:mb-5">
        <h2 className="text-[#05055f] text-lg hover:bg-yellow-200 md:text-2xl font-bold inline-block border-2 border-[#05055f] px-2 md:px-4 rounded-md">
          <Link href="/upcoming" aria-label="View all upcoming posts">Upcoming</Link>
          <span className="inline-block ml-2">
            <Image
              src="/gifs/live.webp"
              alt="Live Update"
              width={40}
              height={24}
              loading="lazy"
              className="object-contain"
              unoptimized
            />
          </span>
        </h2>
      </div>

      <div className="relative h-[100px] flex flex-col justify-center items-center gap-1">
        {visiblePosts.map((post, i) => {
          const isCenter = i === 1;
          return (
            <Link
              key={post.title_slug}
              href={`/${post.title_slug}`}
              target="_blank"
              rel="noopener"
              className={`block px-2 py-0.5 w-full transition-transform transition-opacity duration-300 cursor-pointer
                ${isCenter
                  ? 'text-red-600 text-lg font-semibold truncate text-center scale-105'
                  : 'text-black text-sm opacity-50 truncate text-center'}
              `}
              aria-label={`Go to ${post.title}`}
              title={post.title}
            >
              <span className="inline-block max-w-full">{post.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          href="/upcoming"
          className="relative text-sm md:text-xl font-semibold text-[#05055f] transition-all duration-300 ease-in-out hover:underline hover:scale-105 hover:text-blue-700 group"
        >
          View All . . .
          <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </Link>
      </div>
    </section>
  );
};

export default UpcomingScroller;
