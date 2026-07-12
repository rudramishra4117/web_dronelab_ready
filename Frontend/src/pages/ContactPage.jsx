import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Send,
  User,
  MessageSquare,
} from "lucide-react";

const CONTACT_INFO = {
  address: {
    lines: [
      "NIELIT Bhubaneswar(Campus-II)",
      "2nd Floor,Annex Building",
      "IHM Bhubaneswar,VSS Nagar,Bhubaneswar ",
      "Odisha 751010"
    ],
  },
  phone: "+91 (674) 2960-354",
  email: "bbsr@nielit.gov.in",
  workingHours: {
    weekdays: "Monday – Friday: 09:00 AM – 05:30 PM",
    weekends: "Saturday & Sunday: Closed",
  },
};

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.9307914715628!2d85.84596571111408!3d20.303131612226245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190971111bc347%3A0xb696578d6afae0ed!2sIHM%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1782992929402!5m2!1sen!2sin";

const MAP_LINK =
  "https://www.google.com/maps/place/IHM+Bhubaneswar/@20.3031316,85.8459657,17z";

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a submit
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1200);
  };

  return (
    <div className="contact-page">
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
      <section className="contact-hero">
        <div className="contact-hero-glow" />
        <div className="contact-hero-glow-2" />
        <div className="contact-hero-grid" aria-hidden="true" />
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in touch with Drone Lab</h1>
          <p className="contact-hero-subtitle">
            We are here to help you with any inquiries regarding drone
            technology, research collaborations, and lab services.
          </p>
        </div>
      </section>

      {/* ── Main Content: Info Card + Map ────────────────────────── */}
      <section className="contact-main">
        <div className="contact-grid">
          {/* Left — Contact Information Card */}
          <div className="contact-info-card">
            <div className="contact-info-header">
              <div className="contact-info-icon-badge">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h2 className="contact-info-title">Contact Information</h2>
            </div>

            {/* Address */}
            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="contact-info-item-label">Address</h3>
                {CONTACT_INFO.address.lines.map((line, i) => (
                  <p key={i} className="contact-info-item-value">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="contact-info-item-label">Phone</h3>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/[^+\d]/g, "")}`}
                  className="contact-info-item-link"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="contact-info-item-label">Email</h3>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="contact-info-item-link"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="contact-info-item-label">Working Hours</h3>
                <p className="contact-info-item-value">
                  {CONTACT_INFO.workingHours.weekdays}
                </p>
                <p className="contact-info-item-value contact-closed">
                  {CONTACT_INFO.workingHours.weekends}
                </p>
              </div>
            </div>
          </div>

          {/* Right — Google Map */}
          <div className="contact-map-wrapper">
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-map-open-link"
            >
              Open in Maps <ExternalLink size={14} />
            </a>
            <iframe
              src={MAP_EMBED_URL}
              className="contact-map-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Drone Lab Location"
            />
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
}
