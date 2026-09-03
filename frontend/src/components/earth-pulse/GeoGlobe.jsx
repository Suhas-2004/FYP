import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GeoGlobe() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);

  // Fetch GeoJSON countries
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        // Assign random risk scores to countries (0 to 100)
        data.features.forEach(f => {
          f.properties.riskScore = Math.random() * 100;
        });
        setCountries(data);
      })
      .catch(err => console.error("Could not load globe data", err));
  }, []);

  // Generate mock arcs and rings
  useEffect(() => {
    // Generate 15 random arcs between cities/coords
    const N = 15;
    const arcTypes = ['military', 'sanctions', 'trade', 'diplomatic'];
    const colors = {
      military: ['#EF4444', '#B91C1C'],
      sanctions: ['#F59E0B', '#B45309'],
      trade: ['#FBBF24', '#B45309'],
      diplomatic: ['#06B6D4', '#0E7490'],
    };

    const newArcs = [...Array(N).keys()].map(() => {
      const type = arcTypes[Math.floor(Math.random() * arcTypes.length)];
      return {
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        color: colors[type],
        type: type,
      };
    });

    setArcs(newArcs);

    // Generate rings (shockwaves)
    const newRings = [...Array(5).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      maxR: Math.random() * 20 + 10,
      propagationSpeed: (Math.random() - 0.5) * 2 + 3,
      repeatPeriod: Math.random() * 2000 + 1000
    }));

    setRings(newRings);
  }, []);

  // Initial spin and camera setup
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5; // Very slow cinematic spin
      controls.enableZoom = false; // Disable zoom to allow page scrolling
      globeEl.current.pointOfView({ altitude: 2.5 });
    }
  }, []);

  const getCountryColor = (score) => {
    if (score >= 80) return 'rgba(239, 68, 68, 0.7)'; // Critical - Red
    if (score >= 60) return 'rgba(245, 158, 11, 0.7)'; // High - Orange
    if (score >= 35) return 'rgba(6, 182, 212, 0.6)'; // Medium - Cyan
    return 'rgba(16, 185, 129, 0.5)'; // Low - Green
  };

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeEl}
        backgroundColor="#03060f"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        
        // Polygons (Countries)
        polygonsData={countries.features}
        polygonAltitude={0.01}
        polygonCapColor={d => getCountryColor(d.properties.riskScore)}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.5)'}
        polygonStrokeColor={() => '#111'}
        
        // Hover interactions
        onPolygonHover={hoverD => {
          if (globeEl.current) {
             // Optional hover logic
          }
        }}

        // Arcs
        arcsData={arcs}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcAltitudeAutoScale={0.5}

        // Pulse Rings
        ringsData={rings}
        ringColor={() => t => `rgba(6, 182, 212, ${1-t})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"

        // Atmosphere
        atmosphereColor="#06B6D4"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}
