import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import { getPocById } from "../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PocPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [poc, setPoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPoc = async () => {
      try {
        setLoading(true);
        const response = await getPocById(id);
        setPoc(response.data);
      } catch (err) {
        setError("Failed to load PoC data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPoc();
    }
  }, [id]);

  const images = poc ? [poc.main_image_url, ...(poc.gallery_images?.map(g => g.image_url) || [])].filter(Boolean) : [];

  // Auto slide effect
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !poc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error || "PoC not found."}
      </div>
    );
  }

  return (
    <div className="poc2-page min-h-screen">
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

      {/* ── Main Content ─────────────────────────────────────────── */}
      <section className="poc2-content relative max-w-7xl mx-auto px-4 py-16">
        {/* Decorative glows */}
        <div className="poc2-glow absolute top-10 left-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="poc2-glow-2 absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Big Hero Image / Carousel */}
        <div className="poc2-image-wrapper relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,100,255,0.3)] group h-[400px] md:h-[600px] w-full">
          {images.map((imgUrl, index) => (
            <img
              key={index}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              src={imgUrl}
              alt={`${poc.title} image ${index + 1}`}
            />
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80 pointer-events-none" />
          
          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ChevronRight size={32} />
              </button>
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="poc2-title text-4xl md:text-5xl font-bold mt-12 mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent relative z-10">
          {poc.title}
        </h1>

        {/* Description */}
        <div className="poc2-description text-gray-300 leading-relaxed text-lg max-w-4xl mx-auto whitespace-pre-wrap relative z-10">
          {poc.description}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
