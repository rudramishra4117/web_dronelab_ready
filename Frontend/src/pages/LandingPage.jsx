import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import WhatWeDoSection from "../components/WhatWeDo/WhatWeDoSection";
import BentoResources from "../components/BentoResources/BentoResources";
import Footer from "../components/Footer/Footer";

import { getServices, getHeroImages, getWhatWeDoItems } from "../api/axios";

// Data for What We Do is now fetched dynamically



export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Hover states to pause the carousels
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [whatWeDoData, setWhatWeDoData] = useState([]);

  // Fetch Services & Hero Images
  useEffect(() => {
    getServices()
      .then((res) => {
        setServicesData(res.data);
      })
      .catch((err) => console.error("Failed to load services", err));

    getHeroImages()
      .then((res) => {
        setHeroImages(res.data);
      })
      .catch((err) => console.error("Failed to load hero images", err));

    getWhatWeDoItems()
      .then((res) => {
        setWhatWeDoData(res.data);
      })
      .catch((err) => console.error("Failed to load what we do items", err));
  }, []);

  // Hero Image Carousel
  useEffect(() => {
    if (isHeroHovered || heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHeroHovered, heroImages]);

  // Services Carousel
  useEffect(() => {
    if (isServicesHovered || servicesData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % servicesData.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isServicesHovered]);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page relative">
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

      {/* Hero Section */}
      <section className="hero-section">
        {/* Warm glow at top-right */}
        <div className="hero-glow" />

        {/* Decorative hexagons on left */}
        <div className="hero-hexagons" aria-hidden="true">
          <svg width="120" height="260" viewBox="0 0 120 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Column of hexagons */}
            <path d="M60 10 L90 27 L90 61 L60 78 L30 61 L30 27 Z" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
            <path d="M60 70 L90 87 L90 121 L60 138 L30 121 L30 87 Z" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
            <path d="M60 130 L90 147 L90 181 L60 198 L30 181 L30 147 Z" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
            <path d="M60 190 L90 207 L90 241 L60 258 L30 241 L30 207 Z" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" fill="none" />
            {/* Offset column */}
            <path d="M15 40 L45 57 L45 91 L15 108 L-15 91 L-15 57 Z" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" fill="none" />
            <path d="M15 100 L45 117 L45 151 L15 168 L-15 151 L-15 117 Z" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="rgba(255,255,255,0.015)" />
            <path d="M15 160 L45 177 L45 211 L15 228 L-15 211 L-15 177 Z" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Hero Content - Left Side */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Government of India Initiative
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            Precision in Flight.
            <br />
            Excellence in Innovation.
          </h1>

          {/* Description */}
          <p className="hero-description">

            <strong>"Where innovation meets altitude and ideas become reality."</strong>{" "}
            Designing intelligent drones that see, analyze, and act.
            Empowering the next generation of aerial technology.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <button
              className="hero-btn-primary"
              onClick={() => (window.location.href = "/cad/")}
            >
              Try 3D CAD
              <ArrowUpRight size={16} />
            </button>
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                onClick={() => navigate("/dashboard")}
                className="hero-btn-secondary text-black dark:text-white"
              >
                Explore Services
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-56 z-[9999]">
                  <div className="bg-white dark:bg-[#0a0a14] border border-black/10 dark:border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                    {servicesData.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          if (service.is_external) {
                            window.location.href = service.url;
                          } else {
                            navigate(service.url);
                          }
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-slate-900 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="hero-image-wrapper"
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          {heroImages.length > 0 ? (
            <img
              key={currentImageIndex} // Key forces the img to re-mount and trigger the fadeIn animation
              src={heroImages[currentImageIndex]?.image_url || ""}
              alt={heroImages[currentImageIndex]?.title || "Advanced Surveillance Drone"}
              className="hero-drone-image"
            />
          ) : (
            <div className="hero-drone-image flex items-center justify-center text-white/50">
              Loading...
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        {/* Decorative background hexagon for services */}
        <div className="services-hexagon-bg" />

        <div className="services-header">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            Latest and most impactful drone solutions that combine precision engineering with real-world application.
          </p>
        </div>

        <div className="services-content">
          {servicesData.length > 0 ? (
            <>
              <div
                className="services-card"
                onMouseEnter={() => setIsServicesHovered(true)}
                onMouseLeave={() => setIsServicesHovered(false)}
              >
                <img
                  key={currentServiceIndex} // For simple CSS fade-in
                  src={servicesData[currentServiceIndex]?.image || ""}
                  alt={servicesData[currentServiceIndex]?.title || ""}
                  className="services-card-image"
                />
              </div>
              <p className="services-caption">
                {servicesData[currentServiceIndex]?.description}
              </p>
            </>
          ) : (
            <p className="text-white">Loading services...</p>
          )}
        </div>
      </section>

      {/* What We Do Section */}
      <WhatWeDoSection
        title="WHAT WE DO"
        items={whatWeDoData}
        seeAllText="See All Bootcamps"
        onSeeAllClick={() => {
          navigate('/bootcamp');
          window.scrollTo(0, 0);
        }}
      />

      {/* Lab Resources Bento Grid */}
      <BentoResources />

      {/* Footer */}
      <Footer />
    </div>
  );
}
