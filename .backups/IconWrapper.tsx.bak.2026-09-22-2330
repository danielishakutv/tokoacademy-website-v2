'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface IconWrapperProps {
  icon: string;
  className?: string;
  ariaHidden?: boolean;
}

const IconComponent = dynamic(() => import('@iconify/react').then(mod => ({ default: mod.Icon })), {
  ssr: false,
  loading: () => <span className="inline-block" />,
});

export function IconWrapper({ icon, className, ariaHidden }: IconWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <span className={className} aria-hidden={ariaHidden} />;
  }

  return <IconComponent icon={icon} className={className} aria-hidden={ariaHidden} />;
}
