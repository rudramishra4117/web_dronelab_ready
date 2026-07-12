import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GovHeader } from "../components/Header/GovHeader";
import { NavBar2 } from "../components/NavBar2/NavBar2";
import Footer from "../components/Footer/Footer";
import CountUp from "../components/CountUp/CountUp";
import { BootcampGallery } from "../components/BootcampGallery/BootcampGallery";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/lightswind/Pagination";

export function BootcampPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsTrained, setStudentsTrained] = useState(0);
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(bootcamps.length / itemsPerPage);

  // Fetch live students_trained count from the API
  useEffect(() => {
    fetch("/api/content/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.students_trained === "number") {
          setStudentsTrained(data.students_trained);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch bootcamps from the API
  useEffect(() => {
    setLoading(true);
    fetch("/api/content/bootcamps")
      .then((res) => res.json())
      .then((data) => {
        setBootcamps(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBootcamps([]);
        setLoading(false);
      });
  }, []);

  const currentBootcamps = bootcamps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bootcamp-page">
      <GovHeader />

      <div className="sticky top-0 z-[90]">
        <NavBar2
          domain={{
            name: "NIELIT UAS LAB",
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
      <section className="bootcamp-hero">
        <div className="bootcamp-hero-glow" />
        <div className="bootcamp-hero-glow-2" />
        <div className="bootcamp-hero-grid" aria-hidden="true" />
        <div className="bootcamp-hero-content">
          <h1 className="bootcamp-hero-title">Drone Bootcamps</h1>
          <p className="bootcamp-hero-subtitle">
            Hands-on training programs designed to take you from beginner to
            expert in drone technology, design, and operations.
          </p>
        </div>
      </section>

      {/* ── Students Trained Stats ────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center py-16 relative z-10 border-b border-white/5">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-400 uppercase tracking-widest mb-6 text-center">
          Total Number of Students Trained
        </h2>
        <div className="flex items-center text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
          <CountUp
            from={0}
            to={studentsTrained}
            separator=","
            direction="up"
            duration={2.5}
            className="count-up-text"
            delay={0.2}
          />
          <span className="ml-2 text-purple-500">+</span>
        </div>
      </section>

      {/* ── Bootcamp Cards Grid ──────────────────────────────────── */}
      <section className="bootcamp-main">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-lg">No bootcamps added yet.</p>
            <p className="text-sm mt-2 opacity-60">Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="bootcamp-grid">
              {currentBootcamps.map((bootcamp) => (
                <div key={bootcamp.id} className="bootcamp-card" id={`bootcamp-card-${bootcamp.id}`}>
                  <div className="bootcamp-card-image-link">
                    <img
                      className="bootcamp-card-image"
                      src={bootcamp.image_url}
                      alt={bootcamp.title}
                      onError={(e) => {
                        e.target.src = "/drone_images/test_drone.png";
                      }}
                    />
                  </div>
                  <div className="bootcamp-card-body">
                    <h3 className="bootcamp-card-title">{bootcamp.title}</h3>
                    <p className="bootcamp-card-venue text-gray-400 mt-2 text-sm font-medium">
                      📍 {bootcamp.location}
                    </p>
                    <p className="text-cyan-400 mt-1 text-sm font-semibold">
                      👥 {bootcamp.participants.toLocaleString()} students
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ─────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-12 mb-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;

                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNumber}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>

      {/* Gallery Section */}
      <BootcampGallery />

      {/* Footer */}
      <Footer />
    </div>
  );
}
