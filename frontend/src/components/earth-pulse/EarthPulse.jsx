import React from 'react';
import GeoGlobe from './GeoGlobe';

export default function EarthPulse() {
  return (
    <section className="relative w-full h-screen bg-[#03060f] overflow-hidden">
      {/* 3D Interactive GeoTrade Globe */}
      <div className="absolute inset-0 z-0">
        <GeoGlobe />
      </div>
    </section>
  );
}
