import React, { useEffect, useState, useCallback, useRef } from "react";

interface Heart {
  id: number;
  x: number; // percentage width
  size: number; // size in px
  delay: number; // seconds delay
  duration: number; // seconds duration
  angle: number; // swing angle offset
  color: string;
}

export default function FloatingHearts({ burstTrigger }: { burstTrigger?: { x: number; y: number; time: number } }) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartIdCounter = useRef(0);

  // Generate continuous background hearts
  useEffect(() => {
    const colors = [
      "rgba(244, 63, 94, 0.4)",  // Rose 500
      "rgba(251, 113, 133, 0.45)", // Rose 400
      "rgba(253, 164, 175, 0.4)", // Rose 300
      "rgba(225, 29, 72, 0.35)",  // Rose 600
      "rgba(159, 18, 57, 0.25)"   // Burgundy / Rose 900
    ];

    const generateHeart = () => {
      const id = ++heartIdCounter.current;
      const x = Math.random() * 100; // 0 to 100% of viewport width
      const size = Math.random() * 18 + 10; // 10px to 28px
      const duration = Math.random() * 8 + 6; // 6s to 14s rise
      const angle = (Math.random() - 0.5) * 40; // -20 to 20 deg sway
      const color = colors[Math.floor(Math.random() * colors.length)];

      setHearts((prev) => [
        ...prev.slice(-30), // Limit total simultaneous hearts for CPU performance
        { id, x, size, delay: 0, duration, angle, color }
      ]);
    };

    // Initial batch
    for (let i = 0; i < 12; i++) {
      generateHeart();
    }

    const interval = setInterval(generateHeart, 1200);
    return () => clearInterval(interval);
  }, []);

  // Handle manual click bursts
  useEffect(() => {
    if (!burstTrigger || burstTrigger.time === 0) return;

    const colors = [
      "#f43f5e", // Rose 500
      "#fb7185", // Rose 400
      "#fda4af", // Rose 300
      "#e11d48", // Rose 600
      "#881337"  // Burgundy
    ];

    const newHearts: Heart[] = Array.from({ length: 8 }).map((_, i) => {
      const id = ++heartIdCounter.current;
      // Convert absolute pixel coordinates to percentage
      const percentX = (burstTrigger.x / window.innerWidth) * 100 + (Math.random() - 0.5) * 10;
      const size = Math.random() * 14 + 12; // 12px to 26px
      const duration = Math.random() * 3 + 2; // Fast rise
      const angle = (Math.random() - 0.5) * 60; // wider sway
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id,
        x: Math.max(0, Math.min(100, percentX)),
        size,
        delay: Math.random() * 0.2,
        duration,
        angle,
        color
      };
    });

    setHearts((prev) => [...prev.slice(-40), ...newHearts]);
  }, [burstTrigger]);

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(105vh) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10vh) scale(1) rotate(var(--sway-angle));
            opacity: 0;
          }
        }
      `}</style>
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: `${heart.x}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            fill: heart.color,
            stroke: "rgba(255, 255, 255, 0.4)",
            strokeWidth: "0.5px",
            animation: `float-up ${heart.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${heart.delay}s`,
            "--sway-angle": `${heart.angle}deg`,
          } as React.CSSProperties}
          onAnimationEnd={() => removeHeart(heart.id)}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}
