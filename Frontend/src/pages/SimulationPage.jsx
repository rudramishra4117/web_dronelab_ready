import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import { Plane, Radar, ArrowRight } from "lucide-react";

export function SimulationPage() {
  const navigate = useNavigate();

  return (
    <div className="simulation-page">
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
          className="bg-[#050510]/70 backdrop-blur-lg text-white flex justify-between items-center px-7 py-2"
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

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="sim-hero" id="sim-hero">
        <div className="sim-hero-glow" />
        <div className="sim-hero-glow-2" />
        <div className="sim-hero-grid" aria-hidden="true" />

        {/* Animated particles */}
        <div className="sim-hero-particles" aria-hidden="true">
          <span className="sim-particle sim-particle--1" />
          <span className="sim-particle sim-particle--2" />
          <span className="sim-particle sim-particle--3" />
          <span className="sim-particle sim-particle--4" />
          <span className="sim-particle sim-particle--5" />
        </div>

        <div className="sim-hero-content">
          <div className="sim-hero-badge">
            <span className="sim-hero-badge-dot" />
            Professional Grade Simulators
          </div>
          <h1 className="sim-hero-title">
            Experience Next-Level Realism
          </h1>
          <p className="sim-hero-subtitle">
            Whether you're training for commercial airspace or mastering complex
            drone maneuvers, our high-fidelity simulators provide a safe,
            immersive environment to hone your skills.
          </p>
        </div>
      </section>

      {/* ── Simulator Offerings — Two-Column ────────────────────── */}
      <section className="sim-offerings" id="sim-offerings">
        <div className="sim-offerings-inner">
          {/* Flight Simulation Card */}
          <article className="sim-card" id="sim-card-flight">
            <div className="sim-card-image-wrapper">
              <img
                src="/flight_sim/flightsim_image1.jpeg"
                alt="Aviation Flight Simulator Cockpit"
                className="sim-card-image"
              />
              <div className="sim-card-image-shine" />
            </div>
            <div className="sim-card-body">
              <div className="sim-card-icon-wrapper sim-card-icon--flight">
                <Plane size={24} />
              </div>
              <h2 className="sim-card-title">Aviation Flight Simulators</h2>
              <p className="sim-card-description">
                Take the controls in our full-scale flight simulators. Perfect
                for pilot training, instrument familiarization, and logging
                procedural practice with true-to-life physics.
              </p>
              <ul className="sim-card-features">
                <li>Full-scale cockpit environment</li>
                <li>True-to-life physics engine</li>
                <li>Instrument & procedural training</li>
                <li>Multi-scenario weather simulation</li>
              </ul>
            </div>
          </article>

          {/* Drone Simulation Card */}
          <article className="sim-card" id="sim-card-drone">
            <div className="sim-card-image-wrapper">
              <img
                src="/drone_sim/dronesim_image1.png"
                alt="Commercial Drone Simulator Lab"
                className="sim-card-image"
              />
              <div className="sim-card-image-shine" />
            </div>
            <div className="sim-card-body">
              <div className="sim-card-icon-wrapper sim-card-icon--drone">
                <Radar size={24} />
              </div>
              <h2 className="sim-card-title">Commercial Drone Simulators</h2>
              <p className="sim-card-description">
                Master complex maneuvers and test commercial payloads safely on
                the ground. Our drone simulators replicate real-world
                environments, wind conditions, and telemetry.
              </p>
              <ul className="sim-card-features">
                <li>Real-world environment replication</li>
                <li>Dynamic wind & weather conditions</li>
                <li>Live telemetry data feeds</li>
                <li>Commercial payload testing</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* ── Unified CTA ─────────────────────────────────────────── */}
      <section className="sim-cta" id="sim-cta">
        <div className="sim-cta-glow" />
        <div className="sim-cta-inner">
          <h2 className="sim-cta-title">Ready to take flight?</h2>
          <p className="sim-cta-subtitle">
            Book a session in our state-of-the-art simulation lab and experience
            the future of flight training.
          </p>
          <button
            className="sim-cta-btn"
            id="sim-cta-contact-btn"
            onClick={() => { window.scrollTo(0, 0); navigate("/contact"); }}
          >
            Contact Us to Book
            <ArrowRight size={18} className="sim-cta-btn-icon" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
