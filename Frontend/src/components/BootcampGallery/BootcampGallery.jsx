import { useEffect, useState, useCallback } from 'react';

export const BootcampGallery = () => {
    const [images, setImages] = useState(null); // null = loading
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState('right');

    useEffect(() => {
        fetch('/api/content/gallery')
            .then((res) => res.json())
            .then((data) => {
                setImages(Array.isArray(data) && data.length > 0 ? data : []);
            })
            .catch(() => setImages([]));
    }, []);

    const goTo = useCallback((index, dir) => {
        if (animating || !images || images.length === 0) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setCurrent(index);
            setAnimating(false);
        }, 350);
    }, [animating, images]);

    const prev = () => {
        if (!images) return;
        goTo((current - 1 + images.length) % images.length, 'left');
    };

    const next = () => {
        if (!images) return;
        goTo((current + 1) % images.length, 'right');
    };

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [current, animating, images]);

    // Loading
    if (images === null) {
        return (
            <div className="w-full flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Empty
    if (images.length === 0) return null;

    const img = images[current];

    return (
        <div className="w-full px-4 md:px-8 pb-16 pt-6">
            {/* Separator */}
            <hr className="border-t-2 border-gray-400 dark:border-gray-500 mb-8 w-4/5 mx-auto opacity-50" />

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center uppercase tracking-widest drop-shadow-md">
                Bootcamp Gallery
            </h2>

            {/* Carousel Container */}
            <div className="relative mx-auto max-w-4xl select-none">

                {/* Main image */}
                <div
                    className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-black"
                    style={{ aspectRatio: '16/9' }}
                >
                    <img
                        key={`${img.id}-${current}`}
                        src={img.image_url}
                        alt={`Gallery ${current + 1}`}
                        className="w-full h-full object-cover"
                        style={{
                            animation: animating
                                ? direction === 'right'
                                    ? 'slideOutLeft 0.35s ease forwards'
                                    : 'slideOutRight 0.35s ease forwards'
                                : direction === 'right'
                                    ? 'slideInRight 0.35s ease forwards'
                                    : 'slideInLeft 0.35s ease forwards',
                        }}
                    />

                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl" />

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <span className="text-white/80 text-sm font-medium tracking-widest bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
                            {current + 1} / {images.length}
                        </span>
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                                aria-label={`Go to image ${i + 1}`}
                                className={`rounded-full transition-all duration-300 ${
                                    i === current
                                        ? 'w-6 h-2.5 bg-purple-500'
                                        : 'w-2.5 h-2.5 bg-gray-400/50 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Thumbnail strip — shown when 2+ images */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 px-1 justify-center">
                        {images.map((im, i) => (
                            <button
                                key={im.id}
                                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    i === current
                                        ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/30'
                                        : 'border-transparent opacity-60 hover:opacity-90'
                                }`}
                            >
                                <img
                                    src={im.image_url}
                                    alt={`Thumb ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Slide animations */}
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideOutLeft {
                    from { opacity: 1; transform: translateX(0); }
                    to   { opacity: 0; transform: translateX(-60px); }
                }
                @keyframes slideOutRight {
                    from { opacity: 1; transform: translateX(0); }
                    to   { opacity: 0; transform: translateX(60px); }
                }
            `}</style>
        </div>
    );
};
