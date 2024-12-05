'use client'
import React from 'react';

import { BoostedProps } from './types';
import AnimatedOutfit from './AnimatedOutfit';

export function toProperCase(str: string) {
  return str
    .replace(/([A-Z])/g, (c) => ` ${c.toLowerCase()}`)
    .replace(/^./, (str) => str.toUpperCase());
}


interface BoostedComponentProps {
  kind: 'boss' | 'creature';
  boosted: BoostedProps | null;
  tooltip?: boolean;
}

const BoostedComponent = ({ kind, boosted }: BoostedComponentProps) => {
  if (!boosted) {
    return null;
  }

  return (
    <div
      className="transition-all ease-in-out duration-300 hover:scale-110 rounded-token relative p-2"
      data-tooltip={`Boosted ${toProperCase(kind)}: ${boosted.boostname ?? ''}`}
      data-offset="20"
    >
      <AnimatedOutfit outfit={boosted} alt={boosted.boostname ?? ''} className='w-16 h-16 right-4 -bottom-4'  />
    </div>
  );
};

export default BoostedComponent;
