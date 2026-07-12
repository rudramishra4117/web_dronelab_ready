import React, { useEffect, useRef, useState } from 'react';
import { Printer, Cpu, Radio, Satellite, ScanLine } from 'lucide-react';
import './BentoResources.css';

const BENTO_ITEMS = [
  {
    id: 'ultimaker-s5',
    title: 'Ultimaker S5',
    subtitle: '3D Printer — FDM',
    spec: '330 × 240 × 300 mm',
    specLabel: 'Build Volume',
    image: '/resources/Ultimaker S5 3D Printer.png',
    category: '3D Printing',
    icon: Printer,
    gridArea: 'a',
  },
  {
    id: 'pixhawk-6x',
    title: 'Pixhawk 6X',
    subtitle: 'Flight Controller',
    spec: 'Triple-redundant IMU',
    specLabel: 'Key Feature',
    image: '/resources/Pixhawk 6X Flight Controller.png',
    category: 'Avionics',
    icon: Cpu,
    gridArea: 'b',
  },
  {
    id: 'velodyne-lidar',
    title: 'Velodyne VLP-16',
    subtitle: 'LiDAR Sensor',
    spec: '100 m range · 16 channels',
    specLabel: 'Performance',
    image: '/resources/Velodyne LiDAR VLP-16.png',
    category: 'Sensors',
    icon: ScanLine,
    gridArea: 'c',
  },
  {
    id: 'ender-3-s1',
    title: 'Ender 3 S1',
    subtitle: '3D Printer — FDM',
    spec: '220 × 220 × 270 mm',
    specLabel: 'Build Volume',
    image: '/resources/Ender 3 S1 3D Printer.png',
    category: '3D Printing',
    icon: Printer,
    gridArea: 'd',
  },
  {
    id: 'elegoo-mars',
    title: 'Elegoo Mars 3',
    subtitle: '3D Printer — Resin',
    spec: '143 × 89 × 175 mm',
    specLabel: 'Build Volume',
    image: '/resources/Elegoo Mars 3 Resin Printer.png',
    category: '3D Printing',
    icon: Printer,
    gridArea: 'e',
  },
  {
    id: 'septentrio-gps',
    title: 'Septentrio Mosaic',
    subtitle: 'GNSS / GPS Module',
    spec: 'Multi-band RTK',
    specLabel: 'Accuracy',
    image: '/resources/Septentrio Mosaic GPS.png',
    category: 'Navigation',
    icon: Satellite,
    gridArea: 'f',
  },
  {
    id: 'rfdesign-telemetry',
    title: 'RFD900x Radios',
    subtitle: 'Telemetry Link',
    spec: '> 40 km range',
    specLabel: 'Range',
    image: '/resources/RFDesign Telemetry Radios.png',
    category: 'Communication',
    icon: Radio,
    gridArea: 'g',
  },
];

export default function BentoResources() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bento-section" ref={sectionRef} id="lab-resources">
      {/* Decorative background elements */}
      <div className="bento-glow-top" aria-hidden="true" />
      <div className="bento-glow-bottom" aria-hidden="true" />

      <div className="bento-container">
        {/* Section header */}
        <div className={`bento-header ${revealed ? 'bento-revealed' : ''}`}>
          <div className="bento-badge">
            <span className="bento-badge-dot" />
            Lab Infrastructure
          </div>
          <h2 className="bento-title">Our Arsenal</h2>
          <p className="bento-subtitle">
            From precision 3D printers to advanced avionics — the hardware powering our drone research and development.
          </p>
        </div>

        {/* Bento Grid */}
        <div className={`bento-grid ${revealed ? 'bento-revealed' : ''}`}>
          {BENTO_ITEMS.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className={`bento-card bento-area-${item.gridArea}`}
                style={{ '--bento-delay': `${index * 0.1}s` }}
              >
                {/* Hover shine effect */}
                <div className="bento-card-shine" aria-hidden="true" />

                {/* Category tag */}
                <div className="bento-card-tag">
                  <IconComp size={13} strokeWidth={2.5} />
                  {item.category}
                </div>

                {/* Image */}
                <div className="bento-card-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="bento-card-image"
                    loading="lazy"
                  />
                </div>

                {/* Content overlay */}
                <div className="bento-card-content">
                  <h3 className="bento-card-title">{item.title}</h3>
                  <p className="bento-card-subtitle">{item.subtitle}</p>
                  <div className="bento-card-spec">
                    <span className="bento-spec-label">{item.specLabel}</span>
                    <span className="bento-spec-value">{item.spec}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
