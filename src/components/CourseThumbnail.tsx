'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  id: string | number;
  title: string;
  duration?: string;
  courseId?: string | number;
};

export default function CourseThumbnail({ id, title, duration, courseId }: Props) {
  const linkHref = courseId ? `/courses/${courseId}` : undefined;
  
  const thumbnail = (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gradient-to-br from-toko-green/10 to-toko-blue/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/courses/${id}.jpg`}
        alt={`${title} thumbnail`}
        className="w-full h-full object-cover"
        data-variant="jpg"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          const variant = img.getAttribute('data-variant');
          if (variant === 'jpg') {
            img.setAttribute('data-variant', 'png');
            img.src = `/images/courses/${id}.png`;
            return;
          }
          if (variant === 'png') {
            img.setAttribute('data-variant', 'default');
            img.src = `/images/courses/default_course_image.webp`;
            return;
          }
          img.style.display = 'none';
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback if image not available */}
      <div className="absolute inset-0 hidden items-center justify-center">
        <span className="text-xs font-medium px-3 py-1 bg-white/80 text-toko-gray-700 rounded">
          Image coming soon
        </span>
      </div>

      {duration && (
        <span className="absolute top-2 left-2 px-2.5 py-1 text-[11px] font-semibold rounded bg-toko-green text-white shadow">
          {duration}
        </span>
      )}
    </div>
  );

  if (linkHref) {
    return <Link href={linkHref}>{thumbnail}</Link>;
  }

  return thumbnail;
}
