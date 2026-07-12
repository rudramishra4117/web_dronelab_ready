import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './WhatWeDoSection.css';

export default function WhatWeDoSection({ title = "WHAT WE DO", items = [], seeAllText = "See all >", onSeeAllClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <section className="what-we-do-wrapper">
      <div className="what-we-do-container">
        <h2 className="what-we-do-title">{title}</h2>
        
        <div className="what-we-do-carousel-area">
          <button className="carousel-nav-btn left" onClick={handlePrev} aria-label="Previous">
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          
          <div className="what-we-do-card">
            <div className="card-left-pane">
              <div className="card-content">
                <h3 className="card-title">{currentItem.title}</h3>
                <p className="card-description">{currentItem.description}</p>
              </div>
            </div>
            <div className="card-right-pane">
              <img src={currentItem.image_url || currentItem.image} alt={currentItem.title} className="card-image" />
            </div>
          </div>
          
          <button className="carousel-nav-btn right" onClick={handleNext} aria-label="Next">
            <ArrowRight size={28} strokeWidth={2.5} />
          </button>
        </div>

        <div className="what-we-do-footer">
          <button className="hero-btn-secondary mt-4" onClick={onSeeAllClick}>
            {seeAllText}
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
