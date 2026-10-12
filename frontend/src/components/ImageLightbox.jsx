import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const ImageLightbox = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const showNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNext, showPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 text-white text-xl sm:text-2xl p-2.5 rounded-full bg-black/60 sm:bg-black/40 hover:bg-black/80 backdrop-blur-md transition-colors"
          aria-label="Close lightbox"
        >
          <FaTimes />
        </motion.button>

        {/* Previous Button */}
        {images.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 sm:left-5 z-20 p-2.5 sm:p-3.5 bg-black/60 sm:bg-white/20 hover:bg-black/80 sm:hover:bg-white/30 rounded-full text-white text-lg sm:text-2xl backdrop-blur-md transition-colors"
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </motion.button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 sm:right-5 z-20 p-2.5 sm:p-3.5 bg-black/60 sm:bg-white/20 hover:bg-black/80 sm:hover:bg-white/30 rounded-full text-white text-lg sm:text-2xl backdrop-blur-md transition-colors"
            aria-label="Next image"
          >
            <FaArrowRight />
          </motion.button>
        )}

        {/* Image Display */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-8 md:p-14 select-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="max-h-[75vh] sm:max-h-[82vh] max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          {/* Bottom Controls / Thumbnail strip on larger devices */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto py-1 px-2">
            <div className="bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;