import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const InteractiveBackground = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const particlesInit = useCallback(async (engine) => {
    // This loads the tsparticles package bundle, it's required for tsparticles to work
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (event) => {
      if (typeof window !== "undefined") {
        mouseX.set(event.clientX - window.innerWidth / 2);
        mouseY.set(event.clientY - window.innerHeight / 2);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const x1 = useTransform(mouseX, (v) => v * 0.1);
  const y1 = useTransform(mouseY, (v) => v * 0.1);
  const x2 = useTransform(mouseX, (v) => v * -0.05);
  const y2 = useTransform(mouseY, (v) => v * -0.05);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#ffffff",
            },
            move: {
              direction: "none",
              enable: true,
              outModes: "out",
              random: true,
              speed: 0.1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.15, anim: { enable: true, speed: 0.2, opacity_min: 0.05 } },
            size: { value: 1 },
          },
          detectRetina: true,
        }}
      />
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute left-1/4 top-1/4 h-[40rem] w-[40rem] rounded-full bg-red-500/15 opacity-50 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-500/15 opacity-50 blur-3xl"
        animate={{ scale: [1, 0.8, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default InteractiveBackground;