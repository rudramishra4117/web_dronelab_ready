import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import {
  GraduationCap,
  FlaskConical,
  Globe,
  Wrench,
  ChevronDown,
  Cpu,
  Radio,
  Battery,
  Camera,
  Compass,
  Box,
  Shield,
  MonitorSmartphone,
  BookOpen,
  Plane,
  Crosshair,
  Server,
  Wifi,
  Hammer,
  Wind,
  ArrowUpRight,
} from "lucide-react";

// ── Core Activities Data ─────────────────────────────────────────────────
const CORE_ACTIVITIES = [
  {
    icon: GraduationCap,
    title: "Training & Skill Development",
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    shadow: "rgba(6, 182, 212, 0.3)",
    items: [
      "Hands-on drone pilot training and certification programs",
      "Software training — Mission planning, Pixhawk, ArduPilot, DJI platforms",
      "VR-based training modules for pilot skill development",
    ],
  },
  {
    icon: FlaskConical,
    title: "Research & Development",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    shadow: "rgba(139, 92, 246, 0.3)",
    items: [
      "Innovative drone design — fixed-wing, multi-rotor, hybrid VTOL",
      "Autonomous systems powered by AI/ML (obstacle avoidance, swarms)",
      "Payload integration — cameras, LiDAR, thermal, sprayers",
    ],
  },
  {
    icon: Globe,
    title: "Real-World Applications",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    shadow: "rgba(16, 185, 129, 0.3)",
    items: [
      "Agriculture: Crop monitoring and precision pesticide spraying",
      "Mapping: GIS mapping, terrain analysis, and surveying",
      "Industry & Disaster: Infrastructure inspection and search-and-rescue",
    ],
  },
  {
    icon: Wrench,
    title: "Fabrication & Testing",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
    shadow: "rgba(245, 158, 11, 0.3)",
    items: [
      "Custom component manufacturing — 3D printing, CNC machining",
      "Indoor/outdoor flight testing and performance evaluation",
      "Rapid prototyping of drone structures and configurations",
    ],
  },
];

// ── Lab Facilities Data ──────────────────────────────────────────────────
const LAB_FACILITIES = [
  {
    icon: Wrench,
    title: "Assembly & Testing Area",
    description:
      "Dedicated workspace with soldering stations, clamps, precision toolkits, and QA platforms for drone assembly and repair.",
  },
  {
    icon: MonitorSmartphone,
    title: "Simulation & Software",
    description:
      "Virtual flight simulation, mission planning tools (Pix4D, DroneDeploy), and AI/ML integration for behavior analysis.",
  },
  {
    icon: Box,
    title: "Fabrication & Prototyping",
    description:
      "In-house 3D printers (filament & resin), CNC machines, and laser cutters for lightweight material fabrication.",
  },
  {
    icon: Battery,
    title: "Battery & Power Management",
    description:
      "Advanced LiPo charging stations, battery testing & maintenance equipment, and safety mechanisms for high-capacity cells.",
  },
  {
    icon: Camera,
    title: "Sensors & Payload Testing",
    description:
      "IMU, GPS, LiDAR, and thermal camera integration zones. Payload testing for surveillance, delivery, and monitoring.",
  },
  {
    icon: Plane,
    title: "Flight Testing & Training",
    description:
      "Indoor obstacle arenas, outdoor landing pads with safety barriers, and VR-based training modules for pilot development.",
  },
  {
    icon: Cpu,
    title: "Workstations & Connectivity",
    description:
      "High-performance computers for programming and data processing with high-speed internet for real-time telemetry.",
  },
  {
    icon: FlaskConical,
    title: "R&D Zone",
    description:
      "Collaboration areas for brainstorming swarm intelligence, autonomous navigation, and hybrid drone innovation.",
  },
  {
    icon: Shield,
    title: "Maintenance & Storage",
    description:
      "Secure anti-static racks, routine repair stations, and safe storage for drones, batteries, and accessories.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Library",
    description:
      "Updated library of drone-related manuals, research papers, tutorials, and A/V documentation aids.",
  },
  {
    icon: Shield,
    title: "Safety & Compliance",
    description:
      "DGCA compliance equipment, emergency kits, protective gear, fire extinguishers, and strict safety protocols.",
  },
];

// ── Equipment Inventory Data ────────────────────────────────────────────
const EQUIPMENT_INVENTORY = [
  {
    category: "Agriculture & Heavy Duty",
    drones: "Agriculture Drone",
    support: "Desktop / Monitor / AV / TV setups",
  },
  {
    category: "Imaging & Surveillance",
    drones: "Indoor Imaging Drones, Outdoor Imaging Drones",
    support: "Laptops / Theatre systems",
  },
  {
    category: "Training & Simulation",
    drones: "Micro Training Drone, Nano Training Drone, Drone Simulators",
    support: "Dedicated Simulator Hardware",
  },
  {
    category: "Delivery & Logistics",
    drones: "Outdoor Delivery Drone",
    support: "PA System",
  },
  {
    category: "Fabrication",
    drones: "Hybrid VTOL & Fixed-Wing Frameworks",
    support: "3D Printer (Filament & Resin), CNC Machines, Laser Cutters",
  },
];

// ── Advanced Instruments Data ────────────────────────────────────────────
const ADVANCED_INSTRUMENTS = [
  {
    icon: Compass,
    title: "Flight Control & Navigation",
    color: "#06b6d4",
    items: [
      "Pixhawk, ArduPilot, DJI Naza controllers",
      "High-precision GPS/GNSS modules",
      "Telemetry systems for real-time monitoring",
    ],
  },
  {
    icon: Camera,
    title: "Sensors & Payloads",
    color: "#8b5cf6",
    items: [
      "LiDAR, RGB/Thermal/Multispectral cameras",
      "Ultrasonic & environmental sensors",
      "Agricultural sprayers for precision farming",
    ],
  },
  {
    icon: Battery,
    title: "Power Systems",
    color: "#f59e0b",
    items: [
      "High-capacity LiPo Batteries (6S1P 22.2V 5200mAh)",
      "Multi-port chargers & battery analyzers",
      "Advanced charging and safety mechanisms",
    ],
  },
  {
    icon: Wifi,
    title: "Communication",
    color: "#10b981",
    items: [
      "Long-Range modules for BVLOS operations",
      "FPV equipment for real-time streaming",
      "Radio transmitters & receivers",
    ],
  },
  {
    icon: Wind,
    title: "Testing & Safety",
    color: "#ef4444",
    items: [
      "Wind tunnels & vibration testers",
      "Drone tracking & parachute landing systems",
      "Protective equipment & fire extinguishers",
    ],
  },
  {
    icon: Server,
    title: "Data Processing",
    color: "#3b82f6",
    items: [
      "High-performance servers & workstations",
      "GIS software, Agisoft Metashape, Pix4D",
      "Large-scale data storage and processing",
    ],
  },
];

// ── Accordion Item Component ─────────────────────────────────────────────
function FacilityAccordion({ facility, index, isOpen, onToggle }) {
  const Icon = facility.icon;

  return (
    <div
      className={`res-accordion-item ${isOpen ? "res-accordion-item--open" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        className="res-accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        id={`facility-trigger-${index}`}
        aria-controls={`facility-content-${index}`}
      >
        <div className="res-accordion-trigger-left">
          <div className="res-accordion-icon-badge">
            <Icon size={18} />
          </div>
          <span className="res-accordion-title">{facility.title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`res-accordion-chevron ${isOpen ? "res-accordion-chevron--open" : ""}`}
        />
      </button>
      <div
        className={`res-accordion-content ${isOpen ? "res-accordion-content--open" : ""}`}
        id={`facility-content-${index}`}
        role="region"
        aria-labelledby={`facility-trigger-${index}`}
      >
        <p className="res-accordion-description">{facility.description}</p>
      </div>
    </div>
  );
}

// ── Main Resources Page ──────────────────────────────────────────────────
export function ResourcesPage() {
  const navigate = useNavigate();
  const [openFacility, setOpenFacility] = useState(null);

  const toggleFacility = (index) => {
    setOpenFacility(openFacility === index ? null : index);
  };

  return (
    <div className="resources-page">
      <GovHeader />

      <div className="sticky top-0 z-[90]">
        <NavBar2
          domain={{
            name: "UNMANNED AIRCRAFT SYSTEM (DRONE) LAB",
            logo: (
              <img
                src="/drone_images/test_drone.png"
                alt="DroneLab Logo"
                className="h-8 w-8 object-contain"
              />
            ),
          }}
          isSticky={false}
          className="bg-[#050510]/70 backdrop-blur-lg text-white flex justify-between items-center px-7 py-2 border-b border-white/5"
          authLinks={{
            login: {
              text: "Login",
              onClick: () => navigate("/auth?tab=login"),
              variant: "ghost",
              className: "text-white hover:text-white/80",
            },
            register: {
              text: "Get Started",
              onClick: () => navigate("/auth?tab=signup"),
              variant: "default",
              className: "bg-white text-black hover:bg-white/90",
            },
          }}
        />
      </div>

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="res-hero">
        <div className="res-hero-glow" />
        <div className="res-hero-glow-2" />
        <div className="res-hero-grid" />

        {/* Floating particles */}
        <div className="res-hero-particles" aria-hidden="true">
          <span className="res-particle res-particle--1" />
          <span className="res-particle res-particle--2" />
          <span className="res-particle res-particle--3" />
          <span className="res-particle res-particle--4" />
          <span className="res-particle res-particle--5" />
          <span className="res-particle res-particle--6" />
        </div>

        <div className="res-hero-content">
          <div className="res-hero-badge">
            <span className="res-hero-badge-dot" />
            UNMANNED AIRCRAFT SYSTEM (DRONE) LAB
          </div>
          <h1 className="res-hero-title">
            Welcome to the
            <br />
            UNMANNED AIRCRAFT SYSTEM (DRONE) LAB
          </h1>
          <p className="res-hero-subtitle">
            Your premier hub for Unmanned Aerial Systems (UAS) innovation,
            training, research, and development — empowering the future of
            aerial technology in India.
          </p>
          <div className="res-hero-actions">
            <a href="#facilities" className="res-hero-btn-primary">
              Explore Facilities
              <ArrowUpRight size={16} />
            </a>
            <a href="#equipment" className="res-hero-btn-secondary">
              View Equipment Inventory
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ Section 1: Core Activities ═══════════ */}
      <section className="res-activities" id="activities">
        <div className="res-section-header">
          <span className="res-section-label">What We Focus On</span>
          <h2 className="res-section-title">Core Activities & Focus Areas</h2>
          <p className="res-section-subtitle">
            Our lab operates across four key pillars — from hands-on training to
            cutting-edge R&D and real-world applications of drone technology.
          </p>
        </div>

        <div className="res-activities-grid">
          {CORE_ACTIVITIES.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                className="res-activity-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="res-activity-icon"
                  style={{
                    background: activity.gradient,
                    boxShadow: `0 4px 16px ${activity.shadow}`,
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="res-activity-title">{activity.title}</h3>
                <ul className="res-activity-list">
                  {activity.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ Section 2: Lab Facilities ═══════════ */}
      <section className="res-facilities" id="facilities">
        <div className="res-section-header">
          <span className="res-section-label">Infrastructure</span>
          <h2 className="res-section-title">State-of-the-Art Lab Facilities</h2>
          <p className="res-section-subtitle">
            Explore our 11 specialized zones — each designed for a critical
            phase of drone development, testing, and operations.
          </p>
        </div>

        <div className="res-accordion-wrapper">
          {LAB_FACILITIES.map((facility, i) => (
            <FacilityAccordion
              key={i}
              facility={facility}
              index={i}
              isOpen={openFacility === i}
              onToggle={() => toggleFacility(i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════ Section 3: Equipment Inventory ═══════════ */}
      <section className="res-equipment" id="equipment">
        <div className="res-section-header">
          <span className="res-section-label">Lab Inventory</span>
          <h2 className="res-section-title">Equipment & Inventory</h2>
          <p className="res-section-subtitle">
            A comprehensive overview of our drone systems and supporting
            infrastructure across all focus areas.
          </p>
        </div>

        <div className="res-table-wrapper">
          <table className="res-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Drones / UAS Equipment</th>
                <th>Supporting Infrastructure</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENT_INVENTORY.map((row, i) => (
                <tr key={i}>
                  <td className="res-table-category">{row.category}</td>
                  <td>{row.drones}</td>
                  <td>{row.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════ Section 4: Advanced Instruments ═══════════ */}
      <section className="res-instruments" id="instruments">
        <div className="res-section-header">
          <span className="res-section-label">Advanced Equipment</span>
          <h2 className="res-section-title">Instruments & Tools</h2>
          <p className="res-section-subtitle">
            Specialized instruments powering every aspect of UAS development —
            from flight control to data processing.
          </p>
        </div>

        <div className="res-instruments-grid">
          {ADVANCED_INSTRUMENTS.map((instrument, i) => {
            const Icon = instrument.icon;
            return (
              <div
                key={i}
                className="res-instrument-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="res-instrument-header">
                  <div
                    className="res-instrument-icon"
                    style={{
                      background: `${instrument.color}18`,
                      color: instrument.color,
                      boxShadow: `0 0 20px ${instrument.color}15`,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="res-instrument-title">{instrument.title}</h3>
                </div>
                <ul className="res-instrument-list">
                  {instrument.items.map((item, j) => (
                    <li key={j}>
                      <span
                        className="res-instrument-dot"
                        style={{ background: instrument.color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
